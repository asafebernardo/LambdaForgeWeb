import { Injectable, Logger, NotFoundException, OnModuleInit } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { MeiliSearch } from "meilisearch";
import { Prisma } from "@prisma/client";

export interface IndexedModSearchDocument {
  id: string;
  name: string;
  slug: string;
  description: string;
  shortDescription: string;
  authorName: string;
  source: string;
  gameSlug: string | null;
  gameName: string | null;
  categoryName: string | null;
  tags: string[];
  downloads: number;
  likes: number;
  views: number;
  priorityScore: number;
  updatedAt: number;
}

@Injectable()
export class CatalogSearchService implements OnModuleInit {
  private readonly logger = new Logger(CatalogSearchService.name);
  private client: MeiliSearch | null = null;
  private available = false;
  private readonly indexName = "indexed_mods";

  constructor(private config: ConfigService) {}

  async onModuleInit() {
    const host = this.config.get("MEILI_HOST");
    const apiKey = this.config.get("MEILI_API_KEY");
    if (!host) return;

    try {
      this.client = new MeiliSearch({ host, apiKey });
      await this.client.getIndex(this.indexName).catch(async () => {
        await this.client!.createIndex(this.indexName, { primaryKey: "id" });
      });
      const index = this.client.index(this.indexName);
      await index.updateFilterableAttributes([
        "gameSlug",
        "source",
        "categoryName",
        "tags",
      ]);
      await index.updateSortableAttributes([
        "downloads",
        "likes",
        "views",
        "priorityScore",
        "updatedAt",
      ]);
      this.available = true;
    } catch (err) {
      this.logger.warn(`Meilisearch indexed_mods unavailable: ${err}`);
    }
  }

  isAvailable() {
    return this.available && this.client !== null;
  }

  async search(
    q: string,
    options: {
      game?: string;
      category?: string;
      tags?: string[];
      sort?: string;
      page?: number;
      limit?: number;
    },
  ) {
    if (!this.isAvailable()) return null;

    const filters: string[] = [];
    if (options.game) filters.push(`gameSlug = "${options.game}"`);
    if (options.category) filters.push(`categoryName = "${options.category}"`);
    if (options.tags?.length) {
      filters.push(`(${options.tags.map((t) => `tags = "${t}"`).join(" OR ")})`);
    }

    let sort: string[] | undefined;
    switch (options.sort) {
      case "popular":
        sort = ["downloads:desc"];
        break;
      case "trending":
        sort = ["priorityScore:desc"];
        break;
      case "likes":
        sort = ["likes:desc"];
        break;
      case "recent":
      default:
        sort = ["updatedAt:desc"];
    }

    const page = options.page ?? 1;
    const limit = options.limit ?? 20;

    const result = await this.client!.index(this.indexName).search(q, {
      filter: filters.length ? filters.join(" AND ") : undefined,
      sort,
      offset: (page - 1) * limit,
      limit,
    });

    return {
      ids: result.hits.map((h) => (h as IndexedModSearchDocument).id),
      total: result.estimatedTotalHits ?? result.hits.length,
      page,
      limit,
    };
  }
}
