import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { AuthorBadge } from "@/components/mods/AuthorBadge";
import { ModStats } from "@/components/mods/ModStats";
import { ModRating } from "@/components/mods/ModRating";
import { CommentList } from "@/components/mods/CommentList";
import { sdk } from "@/lib/api";

export const revalidate = 60;

interface ModPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: ModPageProps): Promise<Metadata> {
  const { slug } = await params;
  try {
    const mod = await sdk.getMod(slug);
    return {
      title: mod.title,
      description: mod.description.slice(0, 160),
    };
  } catch {
    return { title: "Mod not found" };
  }
}

export default async function ModPage({ params }: ModPageProps) {
  const { slug } = await params;

  let mod;
  try {
    mod = await sdk.getMod(slug);
  } catch {
    notFound();
  }

  const comments = await sdk
    .listComments(mod.id)
    .catch(() => ({ data: [], meta: { total: 0, page: 1, limit: 20 } }));

  const latestVersion = mod.versions[0];
  const latestFile = latestVersion?.files[0];

  return (
    <>
      <Header active="mods" />
      <main className="mx-auto max-w-4xl px-4 py-10">
        <div className="space-y-2">
          <p className="text-sm text-muted">{mod.game.name}</p>
          <h1 className="text-3xl font-semibold">{mod.title}</h1>
          <AuthorBadge username={mod.author.username} />
        </div>

        <div className="mt-6">
          <ModStats mod={mod} />
        </div>

        <div className="mt-6 flex flex-wrap gap-3">
          {latestFile && (
            <a
              href={`${process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000"}/v1/mods/${mod.id}/download`}
              className="rounded-md bg-accent px-4 py-2 text-sm font-semibold text-accent-foreground no-underline"
            >
              Download {latestFile.filename}
            </a>
          )}
          <Link
            href={`/mods/${mod.slug}/edit`}
            className="rounded-md border border-border px-4 py-2 text-sm text-text no-underline hover:border-accent/40"
          >
            Edit
          </Link>
        </div>

        <article className="prose prose-invert mt-8 max-w-none">
          <h2 className="text-lg font-semibold">Description</h2>
          <p className="whitespace-pre-wrap text-muted">{mod.description}</p>
        </article>

        {mod.tags.length > 0 && (
          <div className="mt-6 flex flex-wrap gap-2">
            {mod.tags.map((tag) => (
              <span
                key={tag.id}
                className="rounded bg-white/5 px-2 py-1 text-xs text-muted"
              >
                {tag.name}
              </span>
            ))}
          </div>
        )}

        {latestVersion && (
          <section className="mt-8 rounded-lg border border-border bg-card/40 p-4">
            <h2 className="font-semibold">Latest version — {latestVersion.version}</h2>
            {latestVersion.changelog && (
              <p className="mt-2 whitespace-pre-wrap text-sm text-muted">
                {latestVersion.changelog}
              </p>
            )}
          </section>
        )}

        <section className="mt-8">
          <h2 className="text-lg font-semibold">Rate this mod</h2>
          <div className="mt-2">
            <ModRating
              modId={mod.id}
              initialAverage={mod.averageRating}
              initialCount={mod.ratingCount}
            />
          </div>
        </section>

        <div className="mt-10">
          <CommentList
            modId={mod.id}
            initialComments={comments.data}
            initialTotal={comments.meta.total}
          />
        </div>
      </main>
      <Footer />
    </>
  );
}
