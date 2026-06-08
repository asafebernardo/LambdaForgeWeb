import { indexerConfig } from "../../config.js";
import { globalRateLimiter } from "../../lib/rate-limiter.js";

export class UpstreamRateLimitError extends Error {
  constructor(
    message: string,
    public retryAfterMs?: number,
  ) {
    super(message);
    this.name = "UpstreamRateLimitError";
  }
}

export interface GameBananaModRecord {
  externalId: string;
  name: string;
  description: string;
  shortDescription: string | null;
  authorName: string | null;
  authorExternalId: string | null;
  categoryName: string | null;
  categoryExternalId: string | null;
  views: number;
  downloads: number;
  likes: number;
  thumbnailUrl: string | null;
  externalUrl: string;
  downloadUrl: string | null;
  fileSizeBytes: number | null;
  version: string | null;
  externalUpdatedAt: Date | null;
  previewUrls: string[];
  tags: string[];
}

const API = "https://gamebanana.com/apiv10";

function pickString(obj: Record<string, unknown>, ...keys: string[]): string | null {
  for (const k of keys) {
    const v = obj[k];
    if (typeof v === "string" && v.trim()) return v.trim();
  }
  return null;
}

function pickNumber(obj: Record<string, unknown>, ...keys: string[]): number {
  for (const k of keys) {
    const v = obj[k];
    if (typeof v === "number" && Number.isFinite(v)) return v;
    if (typeof v === "string" && v.trim()) {
      const n = Number(v.replace(/,/g, ""));
      if (Number.isFinite(n)) return n;
    }
  }
  return 0;
}

function parseMod(raw: Record<string, unknown>): GameBananaModRecord {
  const id = String(raw._idRow ?? raw._id ?? raw.id ?? "");
  const name = pickString(raw, "_sName", "name") ?? `Mod ${id}`;
  const desc = pickString(raw, "_sDescription", "description") ?? "";
  const short = pickString(raw, "_sProfileInfo", "shortDescription");
  const authorBlock = (raw._aSubmitter ?? raw.submitter) as Record<string, unknown> | undefined;
  const authorName = authorBlock
    ? pickString(authorBlock, "_sName", "name")
    : pickString(raw, "_sAuthor", "author");
  const authorExternalId = authorBlock
    ? String(authorBlock._idRow ?? authorBlock.id ?? "")
    : null;

  const categoryBlock = (raw._aCategory ?? raw.category) as Record<string, unknown> | undefined;
  const categoryName = categoryBlock
    ? pickString(categoryBlock, "_sName", "name")
    : null;
  const categoryExternalId = categoryBlock
    ? String(categoryBlock._idRow ?? categoryBlock.id ?? "")
    : null;

  const thumb =
    pickString(raw, "_sPreviewUrl", "_sIconUrl", "previewUrl") ??
    (Array.isArray(raw._aPreviewMedia) &&
    (raw._aPreviewMedia[0] as Record<string, unknown>)?._sImageUrl
      ? String((raw._aPreviewMedia[0] as Record<string, unknown>)._sImageUrl)
      : null);

  const previewUrls: string[] = [];
  if (Array.isArray(raw._aPreviewMedia)) {
    for (const item of raw._aPreviewMedia) {
      const url = pickString(item as Record<string, unknown>, "_sImageUrl", "_sFile");
      if (url) previewUrls.push(url);
    }
  }

  const updatedRaw = pickString(raw, "_tsDateModified", "_tsDateAdded", "updatedAt");
  const externalUpdatedAt = updatedRaw ? new Date(updatedRaw) : null;

  return {
    externalId: id,
    name,
    description: desc,
    shortDescription: short,
    authorName,
    authorExternalId: authorExternalId || null,
    categoryName,
    categoryExternalId: categoryExternalId || null,
    views: pickNumber(raw, "_nViewCount", "views"),
    downloads: pickNumber(raw, "_nDownloadCount", "downloads"),
    likes: pickNumber(raw, "_nLikeCount", "likes"),
    thumbnailUrl: thumb,
    externalUrl: `https://gamebanana.com/mods/${id}`,
    downloadUrl: null,
    fileSizeBytes: null,
    version: pickString(raw, "_sVersion", "version"),
    externalUpdatedAt:
      externalUpdatedAt && !Number.isNaN(externalUpdatedAt.getTime())
        ? externalUpdatedAt
        : null,
    previewUrls,
    tags: [],
  };
}

async function fetchJson<T>(url: string): Promise<T> {
  await globalRateLimiter.acquire();
  try {
    const res = await fetch(url, {
      headers: {
        "User-Agent": indexerConfig.userAgent,
        Accept: "application/json",
      },
    });

    if (res.status === 403 || res.status === 429) {
      const retryAfter = res.headers.get("retry-after");
      const retryMs = retryAfter ? Number(retryAfter) * 1000 : undefined;
      globalRateLimiter.enterCooldown(retryMs);
      throw new UpstreamRateLimitError(`Rate limited (${res.status})`, retryMs);
    }

    if (!res.ok) {
      throw new Error(`GameBanana HTTP ${res.status}: ${url}`);
    }

    return (await res.json()) as T;
  } finally {
    globalRateLimiter.release();
  }
}

export async function fetchGameModPage(
  externalGameId: string,
  page: number,
  perPage: number,
): Promise<{ records: GameBananaModRecord[]; totalPages: number }> {
  const url =
    `${API}/Game/${externalGameId}/Subfeed/Mod` +
    `?_nPage=${page}&_nPerpage=${perPage}&_sSort=default` +
    `&_csvProperties=_idRow,_sName,_sDescription,_sProfileInfo,_nViewCount,_nDownloadCount,_nLikeCount,_tsDateModified,_sPreviewUrl,_aPreviewMedia,_aSubmitter,_aCategory,_sVersion`;

  const data = await fetchJson<Record<string, unknown>>(url);
  const recordsRaw = (data._aRecords ?? data.records ?? []) as Record<string, unknown>[];
  const records = recordsRaw.map(parseMod);
  const totalPages = pickNumber(data, "_nMaxPage", "totalPages") || page;

  return { records, totalPages: Math.max(totalPages, page) };
}

export async function fetchModDetail(externalModId: string): Promise<GameBananaModRecord> {
  const url =
    `${API}/Mod/${externalModId}/Profile/_Single` +
    `?_csvProperties=_idRow,_sName,_sDescription,_sProfileInfo,_nViewCount,_nDownloadCount,_nLikeCount,_tsDateModified,_sPreviewUrl,_aPreviewMedia,_aSubmitter,_aCategory,_sVersion,_aFiles`;

  const data = await fetchJson<Record<string, unknown>>(url);
  const mod = parseMod(data);

  const files = (data._aFiles ?? []) as Record<string, unknown>[];
  const primary = files[0];
  if (primary) {
    mod.downloadUrl = pickString(primary, "_sDownloadUrl", "_sFile");
    mod.fileSizeBytes = pickNumber(primary, "_nFilesize", "size") || null;
    if (!mod.version) mod.version = pickString(primary, "_sVersion", "version");
  }

  return mod;
}
