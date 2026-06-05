import { createSdk } from "@lambda-forge/sdk";
import { SUPPORTED_GAMES } from "./config";
import type { Category, Game, SupportedGame } from "@lambda-forge/types";

export const sdk = createSdk(
  process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000",
);

export async function fetchGames(): Promise<(Game | SupportedGame)[]> {
  try {
    return await sdk.getGames();
  } catch {
    return SUPPORTED_GAMES;
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
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000"}/v1/games/categories/list`,
      { next: { revalidate: 300 } },
    );
    if (!res.ok) return [];
    return res.json();
  } catch {
    return [];
  }
}
