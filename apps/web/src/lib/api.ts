import { createSdk } from "@lambda-forge/sdk";
import { getAccessToken } from "./supabase";
import { SUPPORTED_GAMES } from "./config";
import type { Category, Game, SupportedGame } from "@lambda-forge/types";

export const API_URL = import.meta.env.VITE_API_URL ?? "http://localhost:4000";

export const sdk = createSdk({
  baseUrl: API_URL,
  credentials: "omit",
  getToken: getAccessToken,
});

export function normalizeGame(game: Game | SupportedGame): Game {
  if ("id" in game && game.id) return game as Game;
  return { ...game, id: game.slug };
}

export function normalizeGames(games: (Game | SupportedGame)[]): Game[] {
  return games.map(normalizeGame);
}

export async function fetchGames(): Promise<Game[]> {
  try {
    return normalizeGames(await sdk.getGames());
  } catch {
    return normalizeGames(SUPPORTED_GAMES);
  }
}

export async function fetchGame(slug: string): Promise<Game | null> {
  try {
    return await sdk.getGame(slug);
  } catch {
    const fallback = SUPPORTED_GAMES.find((g) => g.slug === slug);
    return fallback ? { ...fallback, id: slug } : null;
  }
}

export async function fetchCategories(): Promise<Category[]> {
  try {
    const res = await fetch(`${API_URL}/v1/games/categories/list`);
    if (!res.ok) return [];
    return res.json();
  } catch {
    return [];
  }
}
