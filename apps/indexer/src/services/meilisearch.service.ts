import { MeiliSearch } from "meilisearch";
import { indexerConfig } from "../config.js";

const INDEX = "indexed_mods";

let client: MeiliSearch | null = null;
let ready = false;

async function getIndex() {
  if (!client) {
    client = new MeiliSearch({
      host: indexerConfig.meiliHost,
      apiKey: indexerConfig.meiliApiKey,
    });
  }

  if (!ready) {
    try {
      await client.getIndex(INDEX);
    } catch {
      await client.createIndex(INDEX, { primaryKey: "id" });
    }
    const index = client.index(INDEX);
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
    ready = true;
  }

  return client.index(INDEX);
}

export async function indexModDocument(mod: {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  shortDescription: string | null;
  authorName: string | null;
  source: string;
  game?: { slug: string; name: string } | null;
  categoryName: string | null;
  tags?: { tag: string }[];
  downloads: number;
  likes: number;
  views: number;
  priorityScore: number;
  updatedAt: Date;
}) {
  try {
    const index = await getIndex();
    await index.addDocuments([
      {
        id: mod.id,
        name: mod.name,
        slug: mod.slug,
        description: mod.description ?? "",
        shortDescription: mod.shortDescription ?? "",
        authorName: mod.authorName ?? "",
        source: mod.source,
        gameSlug: mod.game?.slug ?? null,
        gameName: mod.game?.name ?? null,
        categoryName: mod.categoryName,
        tags: mod.tags?.map((t) => t.tag) ?? [],
        downloads: mod.downloads,
        likes: mod.likes,
        views: mod.views,
        priorityScore: mod.priorityScore,
        updatedAt: mod.updatedAt.getTime(),
      },
    ]);
  } catch (err) {
    console.warn("[meilisearch] index failed:", err);
  }
}

export async function removeModDocument(id: string) {
  try {
    const index = await getIndex();
    await index.deleteDocument(id);
  } catch {
    /* optional */
  }
}
