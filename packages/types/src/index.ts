export interface SupportedGame {
  name: string;
  slug: string;
  steamAppId?: number;
  coverUrl?: string;
}

export interface Game extends SupportedGame {
  id: string;
  modCount?: number;
}

export type UserRole = "USER" | "AUTHOR" | "ADMIN";
export type ModStatus = "DRAFT" | "PUBLISHED";

export interface UserProfile {
  avatarUrl?: string | null;
  bannerUrl?: string | null;
  bio?: string | null;
  website?: string | null;
  twitter?: string | null;
  github?: string | null;
}

export interface User {
  id: string;
  email?: string;
  username: string;
  role: UserRole;
  createdAt?: string;
  profile?: UserProfile | null;
}

export interface Tag {
  id: string;
  name: string;
  slug: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
}

export interface ModFile {
  id: string;
  storageKey: string;
  filename: string;
  sizeBytes: number;
  mimeType: string;
}

export interface ModVersion {
  id: string;
  version: string;
  changelog?: string | null;
  createdAt: string;
  files: ModFile[];
}

export interface ModMedia {
  id: string;
  type: "SCREENSHOT" | "VIDEO";
  storageKey?: string | null;
  url?: string | null;
  sortOrder: number;
}

export interface ModSummary {
  id: string;
  title: string;
  slug: string;
  description: string;
  status: ModStatus;
  downloadCount: number;
  createdAt: string;
  updatedAt: string;
  game: Game;
  author: Pick<User, "id" | "username">;
  category?: Category | null;
  tags: Tag[];
  averageRating: number;
  ratingCount: number;
  commentCount?: number;
}

export interface ModDetail extends ModSummary {
  versions: ModVersion[];
  media: ModMedia[];
  dependencies: Pick<ModSummary, "id" | "title" | "slug">[];
}

export interface PaginatedMeta {
  total: number;
  page: number;
  limit: number;
}

export interface Paginated<T> {
  data: T[];
  meta: PaginatedMeta;
}

export interface RatingSummary {
  average: number;
  count: number;
}

export interface Comment {
  id: string;
  body: string;
  createdAt: string;
  updatedAt: string;
  user: Pick<User, "id" | "username">;
}

export interface PublicUserProfile {
  id: string;
  username: string;
  role: UserRole;
  profile?: UserProfile | null;
  stats: {
    modCount: number;
    totalDownloads: number;
  };
  mods: ModSummary[];
}

export interface AuthResponse {
  user: User;
  accessToken: string;
}

export interface PresignResponse {
  uploadUrl: string;
  storageKey: string;
  publicUrl: string;
}

export interface DownloadResponse {
  url: string;
  filename: string;
}

export interface ListModsParams {
  game?: string;
  category?: string;
  tags?: string[];
  q?: string;
  sort?: "recent" | "popular" | "rating";
  page?: number;
  limit?: number;
}

export interface DownloadAsset {
  id: string;
  os: string;
  title: string;
  file: string | null;
  url: string | null;
  size: number | null;
}

export interface DownloadsManifest {
  version: string;
  released_at: string | null;
  note?: string;
  assets: DownloadAsset[];
}
