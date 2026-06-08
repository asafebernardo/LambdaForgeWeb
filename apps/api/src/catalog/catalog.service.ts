import { Injectable, NotFoundException } from "@nestjs/common";
import { Prisma } from "@prisma/client";
import { PrismaService } from "../prisma/prisma.module";
import { CatalogSearchService } from "./catalog-search.service";
import { ListCatalogModsQueryDto } from "./dto/catalog.dto";

const catalogInclude = {
  game: true,
  author: true,
  tags: true,
  images: { orderBy: { sortOrder: "asc" as const } },
  versions: { orderBy: { createdAt: "desc" as const }, take: 1 },
};

@Injectable()
export class CatalogService {
  constructor(
    private prisma: PrismaService,
    private catalogSearch: CatalogSearchService,
  ) {}

  private formatMod(
    mod: Prisma.IndexedModGetPayload<{ include: typeof catalogInclude }>,
  ) {
    const latestVersion = mod.versions[0];
    return {
      id: mod.id,
      externalId: mod.externalId,
      source: mod.source,
      name: mod.name,
      slug: mod.slug,
      description: mod.description ?? "",
      shortDescription: mod.shortDescription,
      version: mod.version,
      author: mod.authorName ?? mod.author?.name ?? "Unknown",
      game: mod.game,
      category: mod.categoryName,
      tags: mod.tags.map((t) => t.tag),
      views: mod.views,
      downloads: mod.downloads,
      likes: mod.likes,
      thumbnailUrl: mod.thumbnailUrl,
      images: mod.images.map((i) => i.url),
      externalUrl: mod.externalUrl,
      download: {
        downloadUrl: latestVersion?.downloadUrl ?? mod.downloadUrl,
        mirrors: mod.mirrorUrls,
        fileSize: latestVersion?.fileSizeBytes
          ? Number(latestVersion.fileSizeBytes)
          : mod.fileSizeBytes
            ? Number(mod.fileSizeBytes)
            : null,
        checksum: latestVersion?.checksum ?? mod.checksum,
      },
      priorityScore: mod.priorityScore,
      updatedAt: mod.updatedAt,
      createdAt: mod.createdAt,
      lastSyncAt: mod.lastSyncAt,
    };
  }

  async list(query: ListCatalogModsQueryDto) {
    const page = query.page ?? 1;
    const limit = query.limit ?? 24;
    const sort = query.sort ?? "recent";

    if (this.catalogSearch.isAvailable() && (query.q || sort !== "recent")) {
      const searchResult = await this.catalogSearch.search(query.q ?? "", {
        game: query.game,
        category: query.category,
        tags: query.tags,
        sort,
        page,
        limit,
      });
      if (searchResult?.ids.length) {
        const mods = await this.prisma.indexedMod.findMany({
          where: { id: { in: searchResult.ids } },
          include: catalogInclude,
        });
        const ordered = searchResult.ids
          .map((id) => mods.find((m) => m.id === id))
          .filter(Boolean) as typeof mods;
        return {
          data: ordered.map((m) => this.formatMod(m)),
          meta: { total: searchResult.total, page, limit },
        };
      }
      if (searchResult && query.q) {
        return { data: [], meta: { total: 0, page, limit } };
      }
    }

    const where: Prisma.IndexedModWhereInput = {};
    if (query.game) where.game = { slug: query.game };
    if (query.category) where.categoryName = query.category;
    if (query.tags?.length) {
      where.tags = { some: { tag: { in: query.tags } } };
    }
    if (query.q) {
      where.OR = [
        { name: { contains: query.q, mode: "insensitive" } },
        { description: { contains: query.q, mode: "insensitive" } },
        { authorName: { contains: query.q, mode: "insensitive" } },
      ];
    }

    let orderBy: Prisma.IndexedModOrderByWithRelationInput = { updatedAt: "desc" };
    if (sort === "popular") orderBy = { downloads: "desc" };
    if (sort === "trending") orderBy = { priorityScore: "desc" };
    if (sort === "likes") orderBy = { likes: "desc" };

    const [mods, total] = await Promise.all([
      this.prisma.indexedMod.findMany({
        where,
        include: catalogInclude,
        orderBy,
        skip: (page - 1) * limit,
        take: limit,
      }),
      this.prisma.indexedMod.count({ where }),
    ]);

    return {
      data: mods.map((m) => this.formatMod(m)),
      meta: { total, page, limit },
    };
  }

  async searchMods(query: ListCatalogModsQueryDto) {
    return this.list({ ...query, q: query.q ?? "" });
  }

  async trending(limit = 24) {
    return this.list({ sort: "trending", limit, page: 1 });
  }

  async recent(limit = 24) {
    return this.list({ sort: "recent", limit, page: 1 });
  }

  async findById(id: string) {
    const mod = await this.prisma.indexedMod.findFirst({
      where: { OR: [{ id }, { slug: id }] },
      include: {
        ...catalogInclude,
        versions: { orderBy: { createdAt: "desc" } },
      },
    });
    if (!mod) throw new NotFoundException("Indexed mod not found");
    return this.formatMod(mod);
  }

  async syncStatus() {
    const [sources, queuePending, queueFailed, modCount, lastLog] =
      await Promise.all([
        this.prisma.syncSource.count({ where: { enabled: true } }),
        this.prisma.syncQueueItem.count({ where: { status: "PENDING" } }),
        this.prisma.syncQueueItem.count({ where: { status: "FAILED" } }),
        this.prisma.indexedMod.count(),
        this.prisma.syncLog.findFirst({ orderBy: { createdAt: "desc" } }),
      ]);

    return {
      enabledSources: sources,
      indexedModCount: modCount,
      queuePending,
      queueFailed,
      searchAvailable: this.catalogSearch.isAvailable(),
      lastSync: lastLog
        ? {
            jobType: lastLog.jobType,
            status: lastLog.status,
            at: lastLog.createdAt,
            rateLimitHit: lastLog.rateLimitHit,
          }
        : null,
    };
  }
}
