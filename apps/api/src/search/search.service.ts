import { Injectable, Logger, OnModuleInit } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { MeiliSearch } from "meilisearch";

export interface ModSearchDocument {
  id: string;
  title: string;
  description: string;
  slug: string;
  author: string;
  authorId: string;
  game: string;
  gameSlug: string;
  gameId: string;
  category: string | null;
  tags: string[];
  downloadCount: number;
  rating: number;
  ratingCount: number;
  updatedAt: number;
  status: string;
}

@Injectable()
export class SearchService implements OnModuleInit {
  private readonly logger = new Logger(SearchService.name);
  private client: MeiliSearch | null = null;
  private available = false;
  private readonly indexName = "mods";

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
        "category",
        "tags",
        "status",
      ]);
      await index.updateSortableAttributes([
        "downloadCount",
        "rating",
        "updatedAt",
      ]);
      this.available = true;
    } catch (err) {
      this.logger.warn(`Meilisearch unavailable: ${err}`);
      this.available = false;
    }
  }

  isAvailable() {
    return this.available && this.client !== null;
  }

  async indexMod(doc: ModSearchDocument) {
    if (!this.isAvailable()) return;
    await this.client!.index(this.indexName).addDocuments([doc]);
  }

  async removeMod(id: string) {
    if (!this.isAvailable()) return;
    await this.client!.index(this.indexName).deleteDocument(id);
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

    const filters: string[] = ['status = "PUBLISHED"'];
    if (options.game) filters.push(`gameSlug = "${options.game}"`);
    if (options.category) filters.push(`category = "${options.category}"`);
    if (options.tags?.length) {
      const tagFilters = options.tags.map((t) => `tags = "${t}"`);
      filters.push(`(${tagFilters.join(" OR ")})`);
    }

    let sort: string[] | undefined;
    switch (options.sort) {
      case "popular":
        sort = ["downloadCount:desc"];
        break;
      case "rating":
        sort = ["rating:desc"];
        break;
      case "recent":
      default:
        sort = ["updatedAt:desc"];
    }

    const page = options.page ?? 1;
    const limit = options.limit ?? 20;

    const result = await this.client!.index(this.indexName).search(q, {
      filter: filters.join(" AND "),
      sort,
      offset: (page - 1) * limit,
      limit,
    });

    return {
      ids: result.hits.map((h) => (h as ModSearchDocument).id),
      total: result.estimatedTotalHits ?? result.hits.length,
      page,
      limit,
    };
  }
}
