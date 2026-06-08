import { useEffect, useState } from "react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { UploadForm } from "@/components/mods/UploadForm";
import { fetchCategories, fetchGames } from "@/lib/api";
import type { Category, Game } from "@lambda-forge/types";

export function ModUploadPage() {
  const [games, setGames] = useState<Game[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {
    Promise.all([fetchGames(), fetchCategories()]).then(([g, c]) => {
      setGames(g);
      setCategories(c);
    });
  }, []);

  return (
    <>
      <Header active="upload" />
      <main className="mx-auto max-w-6xl px-4 py-10">
        <h1 className="text-3xl font-semibold">Upload a mod</h1>
        <p className="mt-2 text-muted">
          Share your mod with the community. You must be logged in.
        </p>
        <div className="mt-8">
          {games.length > 0 ? (
            <UploadForm games={games} categories={categories} />
          ) : (
            <p className="text-muted">Loading…</p>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
