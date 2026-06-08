import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { AuthorBadge } from "@/components/mods/AuthorBadge";
import { ModStats } from "@/components/mods/ModStats";
import { ModRating } from "@/components/mods/ModRating";
import { CommentList } from "@/components/mods/CommentList";
import { API_URL, sdk } from "@/lib/api";
import type { Comment, ModDetail } from "@lambda-forge/types";

export function ModDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const [mod, setMod] = useState<ModDetail | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [commentTotal, setCommentTotal] = useState(0);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (!slug) return;
    sdk
      .getMod(slug)
      .then((m) => {
        setMod(m);
        return sdk.listComments(m.id);
      })
      .then((c) => {
        setComments(c.data);
        setCommentTotal(c.meta.total);
      })
      .catch(() => setError(true));
  }, [slug]);

  if (error) {
    return (
      <>
        <Header active="mods" />
        <main className="mx-auto max-w-4xl px-4 py-20 text-center">
          <h1 className="text-2xl font-semibold">Mod not found</h1>
          <Link to="/mods" className="mt-4 inline-block text-accent">
            Back to catalog
          </Link>
        </main>
        <Footer />
      </>
    );
  }

  if (!mod) {
    return (
      <>
        <Header active="mods" />
        <main className="mx-auto max-w-4xl px-4 py-20 text-center text-muted">
          Loading…
        </main>
        <Footer />
      </>
    );
  }

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
              href={`${API_URL}/v1/mods/${mod.id}/download`}
              className="rounded-md bg-accent px-4 py-2 text-sm font-semibold text-accent-foreground no-underline"
            >
              Download {latestFile.filename}
            </a>
          )}
          <Link
            to={`/mods/${mod.slug}/edit`}
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
            initialComments={comments}
            initialTotal={commentTotal}
          />
        </div>
      </main>
      <Footer />
    </>
  );
}
