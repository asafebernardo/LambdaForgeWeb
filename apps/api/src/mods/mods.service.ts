import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { createHash } from "crypto";
import slugify from "slugify";
import { Prisma } from "@prisma/client";
import { PrismaService } from "../prisma/prisma.module";
import { SearchService } from "../search/search.service";
import { StorageService } from "../storage/storage.service";
import {
  CreateModDto,
  UpdateModDto,
  CreateVersionDto,
  ListModsQueryDto,
  RateModDto,
  CreateCommentDto,
  ListCommentsQueryDto,
} from "./dto/mods.dto";
import { AuthUser } from "../common/decorators/current-user.decorator";

const modInclude = {
  game: true,
  author: { select: { id: true, username: true } },
  category: true,
  tags: { include: { tag: true } },
  versions: {
    orderBy: { createdAt: "desc" as const },
    include: { files: true },
  },
  media: { orderBy: { sortOrder: "asc" as const } },
  dependencies: { include: { dependsOnMod: { select: { id: true, title: true, slug: true } } } },
  ratings: { select: { score: true } },
  _count: { select: { comments: true, ratings: true } },
};

@Injectable()
export class ModsService {
  constructor(
    private prisma: PrismaService,
    private search: SearchService,
    private storage: StorageService,
  ) {}

  private avgRating(ratings: { score: number }[]) {
    if (!ratings.length) return 0;
    return Math.round((ratings.reduce((s, r) => s + r.score, 0) / ratings.length) * 10) / 10;
  }

  private formatMod(mod: Prisma.ModGetPayload<{ include: typeof modInclude }>) {
    return {
      id: mod.id,
      title: mod.title,
      slug: mod.slug,
      description: mod.description,
      status: mod.status,
      downloadCount: mod.downloadCount,
      createdAt: mod.createdAt,
      updatedAt: mod.updatedAt,
      game: mod.game,
      author: mod.author,
      category: mod.category,
      tags: mod.tags.map((t) => t.tag),
      versions: mod.versions,
      media: mod.media,
      dependencies: mod.dependencies.map((d) => d.dependsOnMod),
      averageRating: this.avgRating(mod.ratings),
      ratingCount: mod._count.ratings,
      commentCount: mod._count.comments,
    };
  }

  private async ensureUniqueSlug(base: string): Promise<string> {
    let slug = slugify(base, { lower: true, strict: true });
    let suffix = 0;
    while (true) {
      const candidate = suffix ? `${slug}-${suffix}` : slug;
      const existing = await this.prisma.mod.findUnique({ where: { slug: candidate } });
      if (!existing) return candidate;
      suffix++;
    }
  }

  private async syncTags(tagNames: string[]) {
    const tags = [];
    for (const name of tagNames) {
      const slug = slugify(name, { lower: true, strict: true });
      const tag = await this.prisma.tag.upsert({
        where: { slug },
        create: { name, slug },
        update: { name },
      });
      tags.push(tag);
    }
    return tags;
  }

  private async indexMod(modId: string) {
    const mod = await this.prisma.mod.findUnique({
      where: { id: modId },
      include: {
        game: true,
        author: true,
        category: true,
        tags: { include: { tag: true } },
        ratings: { select: { score: true } },
      },
    });
    if (!mod || mod.status !== "PUBLISHED") {
      if (mod) await this.search.removeMod(modId);
      return;
    }
    await this.search.indexMod({
      id: mod.id,
      title: mod.title,
      description: mod.description,
      slug: mod.slug,
      author: mod.author.username,
      authorId: mod.author.id,
      game: mod.game.name,
      gameSlug: mod.game.slug,
      gameId: mod.game.id,
      category: mod.category?.slug ?? null,
      tags: mod.tags.map((t) => t.tag.slug),
      downloadCount: mod.downloadCount,
      rating: this.avgRating(mod.ratings),
      ratingCount: mod.ratings.length,
      updatedAt: mod.updatedAt.getTime(),
      status: mod.status,
    });
  }

  async list(query: ListModsQueryDto) {
    const page = query.page ?? 1;
    const limit = query.limit ?? 20;
    const sort = query.sort ?? "recent";

    if (this.search.isAvailable() && (query.q || sort !== "recent")) {
      const searchResult = await this.search.search(query.q ?? "", {
        game: query.game,
        category: query.category,
        tags: query.tags,
        sort,
        page,
        limit,
      });
      if (searchResult?.ids.length) {
        const mods = await this.prisma.mod.findMany({
          where: { id: { in: searchResult.ids }, status: "PUBLISHED" },
          include: modInclude,
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

    const where: Prisma.ModWhereInput = { status: "PUBLISHED" };
    if (query.game) where.game = { slug: query.game };
    if (query.category) where.category = { slug: query.category };
    if (query.tags?.length) {
      where.tags = { some: { tag: { slug: { in: query.tags } } } };
    }
    if (query.q) {
      where.OR = [
        { title: { contains: query.q, mode: "insensitive" } },
        { description: { contains: query.q, mode: "insensitive" } },
      ];
    }

    let orderBy: Prisma.ModOrderByWithRelationInput = { updatedAt: "desc" };
    if (sort === "popular") orderBy = { downloadCount: "desc" };

    const [mods, total] = await Promise.all([
      this.prisma.mod.findMany({
        where,
        include: modInclude,
        orderBy,
        skip: (page - 1) * limit,
        take: limit,
      }),
      this.prisma.mod.count({ where }),
    ]);

    let data = mods.map((m) => this.formatMod(m));
    if (sort === "rating") {
      data = data.sort((a, b) => b.averageRating - a.averageRating);
    }

    return { data, meta: { total, page, limit } };
  }

  async findBySlug(slug: string) {
    const mod = await this.prisma.mod.findUnique({
      where: { slug },
      include: modInclude,
    });
    if (!mod) throw new NotFoundException("Mod not found");
    return this.formatMod(mod);
  }

  async create(dto: CreateModDto, user: AuthUser) {
    const game = await this.prisma.game.findUnique({ where: { id: dto.gameId } });
    if (!game) throw new BadRequestException("Invalid game");

    const slug = await this.ensureUniqueSlug(dto.title);
    const tags = dto.tags?.length ? await this.syncTags(dto.tags) : [];

    const mod = await this.prisma.mod.create({
      data: {
        title: dto.title,
        slug,
        description: dto.description,
        gameId: dto.gameId,
        authorId: user.id,
        categoryId: dto.categoryId,
        tags: tags.length
          ? { create: tags.map((t) => ({ tagId: t.id })) }
          : undefined,
        dependencies: dto.dependencyModIds?.length
          ? { create: dto.dependencyModIds.map((id) => ({ dependsOnModId: id })) }
          : undefined,
      },
      include: modInclude,
    });

    return this.formatMod(mod);
  }

  async update(id: string, dto: UpdateModDto, user: AuthUser) {
    const mod = await this.prisma.mod.findUnique({ where: { id } });
    if (!mod) throw new NotFoundException();
    if (mod.authorId !== user.id && user.role !== "ADMIN") {
      throw new ForbiddenException();
    }

    if (dto.tags) {
      await this.prisma.modTag.deleteMany({ where: { modId: id } });
      const tags = await this.syncTags(dto.tags);
      await this.prisma.modTag.createMany({
        data: tags.map((t) => ({ modId: id, tagId: t.id })),
      });
    }

    if (dto.dependencyModIds) {
      await this.prisma.modDependency.deleteMany({ where: { modId: id } });
      await this.prisma.modDependency.createMany({
        data: dto.dependencyModIds.map((depId) => ({
          modId: id,
          dependsOnModId: depId,
        })),
      });
    }

    const updated = await this.prisma.mod.update({
      where: { id },
      data: {
        title: dto.title,
        description: dto.description,
        categoryId: dto.categoryId,
      },
      include: modInclude,
    });

    if (updated.status === "PUBLISHED") await this.indexMod(id);
    return this.formatMod(updated);
  }

  async addVersion(id: string, dto: CreateVersionDto, user: AuthUser) {
    const mod = await this.prisma.mod.findUnique({ where: { id } });
    if (!mod) throw new NotFoundException();
    if (mod.authorId !== user.id && user.role !== "ADMIN") {
      throw new ForbiddenException();
    }

    const version = await this.prisma.modVersion.create({
      data: {
        modId: id,
        version: dto.version,
        changelog: dto.changelog,
        files: {
          create: {
            storageKey: dto.storageKey,
            filename: dto.filename,
            sizeBytes: dto.sizeBytes,
            mimeType: dto.mimeType,
          },
        },
      },
    });

    await this.prisma.mod.update({
      where: { id },
      data: { updatedAt: new Date() },
    });

    if (mod.status === "PUBLISHED") await this.indexMod(id);
    return version;
  }

  async publish(id: string, user: AuthUser) {
    const mod = await this.prisma.mod.findUnique({
      where: { id },
      include: { versions: { include: { files: true } } },
    });
    if (!mod) throw new NotFoundException();
    if (mod.authorId !== user.id && user.role !== "ADMIN") {
      throw new ForbiddenException();
    }
    if (!mod.versions.some((v) => v.files.length > 0)) {
      throw new BadRequestException("Mod must have at least one file before publishing");
    }

    const updated = await this.prisma.mod.update({
      where: { id },
      data: { status: "PUBLISHED" },
      include: modInclude,
    });

    await this.indexMod(id);
    return this.formatMod(updated);
  }

  async download(identifier: string, user: AuthUser | undefined, ip?: string) {
    const mod = await this.prisma.mod.findFirst({
      where: {
        OR: [{ id: identifier }, { slug: identifier }],
        status: "PUBLISHED",
      },
      include: {
        versions: {
          orderBy: { createdAt: "desc" },
          take: 1,
          include: { files: true },
        },
      },
    });
    if (!mod) throw new NotFoundException();
    const file = mod.versions[0]?.files[0];
    if (!file) throw new NotFoundException("No downloadable file");

    const ipHash = ip ? createHash("sha256").update(ip).digest("hex") : null;
    await this.prisma.$transaction([
      this.prisma.downloadEvent.create({
        data: { modId: mod.id, userId: user?.id, ipHash },
      }),
      this.prisma.mod.update({
        where: { id: mod.id },
        data: { downloadCount: { increment: 1 } },
      }),
    ]);

    const url = await this.storage.presignDownload(file.storageKey);
    return { url, filename: file.filename };
  }

  async rate(modId: string, dto: RateModDto, user: AuthUser) {
    const mod = await this.prisma.mod.findUnique({ where: { id: modId, status: "PUBLISHED" } });
    if (!mod) throw new NotFoundException();

    await this.prisma.rating.upsert({
      where: { userId_modId: { userId: user.id, modId } },
      create: { userId: user.id, modId, score: dto.score },
      update: { score: dto.score },
    });

    const agg = await this.prisma.rating.aggregate({
      where: { modId },
      _avg: { score: true },
      _count: true,
    });

    await this.indexMod(modId);
    return {
      average: Math.round((agg._avg.score ?? 0) * 10) / 10,
      count: agg._count,
    };
  }

  async getRatings(modId: string) {
    const agg = await this.prisma.rating.aggregate({
      where: { modId },
      _avg: { score: true },
      _count: true,
    });
    return {
      average: Math.round((agg._avg.score ?? 0) * 10) / 10,
      count: agg._count,
    };
  }

  async listComments(modId: string, query: ListCommentsQueryDto) {
    const page = query.page ?? 1;
    const limit = query.limit ?? 20;
    const [comments, total] = await Promise.all([
      this.prisma.comment.findMany({
        where: { modId },
        include: { user: { select: { id: true, username: true } } },
        orderBy: { createdAt: "desc" },
        skip: (page - 1) * limit,
        take: limit,
      }),
      this.prisma.comment.count({ where: { modId } }),
    ]);
    return { data: comments, meta: { total, page, limit } };
  }

  async createComment(modId: string, dto: CreateCommentDto, user: AuthUser) {
    const mod = await this.prisma.mod.findUnique({ where: { id: modId, status: "PUBLISHED" } });
    if (!mod) throw new NotFoundException();

    return this.prisma.comment.create({
      data: { modId, userId: user.id, body: dto.body.trim() },
      include: { user: { select: { id: true, username: true } } },
    });
  }

  async deleteComment(modId: string, commentId: string, user: AuthUser) {
    const comment = await this.prisma.comment.findFirst({
      where: { id: commentId, modId },
    });
    if (!comment) throw new NotFoundException();
    if (comment.userId !== user.id && user.role !== "ADMIN") {
      throw new ForbiddenException();
    }
    await this.prisma.comment.delete({ where: { id: commentId } });
    return { ok: true };
  }
}
