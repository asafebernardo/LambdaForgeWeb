import type {
  AuthResponse,
  Comment,
  DownloadResponse,
  Game,
  ListModsParams,
  ModDetail,
  Paginated,
  PresignResponse,
  PublicUserProfile,
  RatingSummary,
  User,
} from "@lambda-forge/types";

export interface SdkOptions {
  baseUrl: string;
  credentials?: RequestCredentials;
  getToken?: () => string | undefined;
}

export class LambdaForgeSdk {
  private baseUrl: string;
  private credentials: RequestCredentials;
  private getToken?: () => string | undefined;

  constructor(options: SdkOptions) {
    this.baseUrl = options.baseUrl.replace(/\/$/, "");
    this.credentials = options.credentials ?? "include";
    this.getToken = options.getToken;
  }

  private async request<T>(
    path: string,
    init: RequestInit = {},
  ): Promise<T> {
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
      ...(init.headers as Record<string, string>),
    };
    const token = this.getToken?.();
    if (token) headers.Authorization = `Bearer ${token}`;

    const res = await fetch(`${this.baseUrl}/v1${path}`, {
      ...init,
      headers,
      credentials: this.credentials,
    });

    if (!res.ok) {
      const body = await res.text();
      throw new Error(body || res.statusText);
    }

    if (res.status === 204) return undefined as T;
    return res.json() as Promise<T>;
  }

  getGames() {
    return this.request<Game[]>("/games");
  }

  getGame(slug: string) {
    return this.request<Game>(`/games/${slug}`);
  }

  listMods(params: ListModsParams = {}) {
    const qs = new URLSearchParams();
    if (params.game) qs.set("game", params.game);
    if (params.category) qs.set("category", params.category);
    if (params.q) qs.set("q", params.q);
    if (params.sort) qs.set("sort", params.sort);
    if (params.page) qs.set("page", String(params.page));
    if (params.limit) qs.set("limit", String(params.limit));
    params.tags?.forEach((t) => qs.append("tags", t));
    const query = qs.toString();
    return this.request<Paginated<ModDetail>>(`/mods${query ? `?${query}` : ""}`);
  }

  getMod(slug: string) {
    return this.request<ModDetail>(`/mods/${slug}`);
  }

  register(email: string, username: string, password: string) {
    return this.request<AuthResponse>("/auth/register", {
      method: "POST",
      body: JSON.stringify({ email, username, password }),
    });
  }

  login(emailOrUsername: string, password: string) {
    return this.request<AuthResponse>("/auth/login", {
      method: "POST",
      body: JSON.stringify({ emailOrUsername, password }),
    });
  }

  /** Sync local User row after Supabase sign-up or login. */
  syncProfile(username?: string) {
    return this.request<AuthResponse>("/auth/sync", {
      method: "POST",
      body: JSON.stringify(username ? { username } : {}),
    });
  }

  logout() {
    return this.request<{ ok: boolean }>("/auth/logout", { method: "POST" });
  }

  refresh() {
    return this.request<AuthResponse>("/auth/refresh", { method: "POST" });
  }

  getMe() {
    return this.request<User>("/users/me");
  }

  updateProfile(data: Record<string, string | undefined>) {
    return this.request<User>("/users/me", {
      method: "PATCH",
      body: JSON.stringify(data),
    });
  }

  getUser(username: string) {
    return this.request<PublicUserProfile>(`/users/${username}`);
  }

  createMod(data: {
    title: string;
    description: string;
    gameId: string;
    categoryId?: string;
    tags?: string[];
    dependencyModIds?: string[];
  }) {
    return this.request<ModDetail>("/mods", {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  updateMod(
    id: string,
    data: {
      title?: string;
      description?: string;
      categoryId?: string;
      tags?: string[];
      dependencyModIds?: string[];
    },
  ) {
    return this.request<ModDetail>(`/mods/${id}`, {
      method: "PATCH",
      body: JSON.stringify(data),
    });
  }

  addModVersion(
    id: string,
    data: {
      version: string;
      changelog?: string;
      storageKey: string;
      filename: string;
      sizeBytes: number;
      mimeType: string;
    },
  ) {
    return this.request<unknown>(`/mods/${id}/versions`, {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  publishMod(id: string) {
    return this.request<ModDetail>(`/mods/${id}/publish`, { method: "POST" });
  }

  downloadMod(id: string) {
    return this.request<DownloadResponse>(`/mods/${id}/download`);
  }

  getRatings(modId: string) {
    return this.request<RatingSummary>(`/mods/${modId}/ratings`);
  }

  rateMod(modId: string, score: number) {
    return this.request<RatingSummary>(`/mods/${modId}/ratings`, {
      method: "POST",
      body: JSON.stringify({ score }),
    });
  }

  listComments(modId: string, page = 1, limit = 20) {
    return this.request<Paginated<Comment>>(
      `/mods/${modId}/comments?page=${page}&limit=${limit}`,
    );
  }

  createComment(modId: string, body: string) {
    return this.request<Comment>(`/mods/${modId}/comments`, {
      method: "POST",
      body: JSON.stringify({ body }),
    });
  }

  deleteComment(modId: string, commentId: string) {
    return this.request<{ ok: boolean }>(
      `/mods/${modId}/comments/${commentId}`,
      { method: "DELETE" },
    );
  }

  presignUpload(data: {
    purpose: "mod_file" | "screenshot" | "avatar";
    filename: string;
    contentType: string;
    sizeBytes?: number;
  }) {
    return this.request<PresignResponse>("/uploads/presign", {
      method: "POST",
      body: JSON.stringify(data),
    });
  }
}

export function createSdk(baseUrlOrOptions: string | SdkOptions = "http://localhost:4000") {
  const options =
    typeof baseUrlOrOptions === "string"
      ? { baseUrl: baseUrlOrOptions }
      : baseUrlOrOptions;
  return new LambdaForgeSdk(options);
}
