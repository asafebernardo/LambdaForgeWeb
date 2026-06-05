import type { Metadata } from "next";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { UploadForm } from "@/components/mods/UploadForm";
import { fetchCategories, fetchGames } from "@/lib/api";

export const metadata: Metadata = {
  title: "Upload mod",
  description: "Publish a mod to the Lambda Forge catalog.",
};

export default async function UploadModPage() {
  const [games, categories] = await Promise.all([fetchGames(), fetchCategories()]);

  return (
    <>
      <Header active="upload" />
      <main className="mx-auto max-w-6xl px-4 py-10">
        <h1 className="text-3xl font-semibold">Upload a mod</h1>
        <p className="mt-2 text-muted">
          Share your mod with the community. You must be logged in.
        </p>
        <div className="mt-8">
          <UploadForm
            games={games.filter((g): g is typeof g & { id: string } => "id" in g)}
            categories={categories}
          />
        </div>
      </main>
      <Footer />
    </>
  );
}
