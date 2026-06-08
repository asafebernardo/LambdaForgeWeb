import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { ModGrid } from "@/components/mods/ModGrid";
import { sdk } from "@/lib/api";
import type { PublicUserProfile } from "@lambda-forge/types";

export function UserPage() {
  const { username } = useParams<{ username: string }>();
  const [profile, setProfile] = useState<PublicUserProfile | null>(null);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    if (!username) return;
    sdk
      .getUser(username)
      .then(setProfile)
      .catch(() => setNotFound(true));
  }, [username]);

  if (notFound) {
    return (
      <>
        <Header />
        <main className="mx-auto max-w-6xl px-4 py-20 text-center">
          <h1 className="text-2xl font-semibold">User not found</h1>
          <Link to="/mods" className="mt-4 inline-block text-accent">
            Back to mods
          </Link>
        </main>
        <Footer />
      </>
    );
  }

  if (!profile) {
    return (
      <>
        <Header />
        <main className="mx-auto max-w-6xl px-4 py-20 text-center text-muted">
          Loading…
        </main>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Header />
      <main className="mx-auto max-w-6xl px-4 py-10">
        <h1 className="text-3xl font-semibold">@{profile.username}</h1>
        {profile.profile?.bio && (
          <p className="mt-2 max-w-2xl text-muted">{profile.profile.bio}</p>
        )}
        <dl className="mt-4 flex gap-6 text-sm">
          <div>
            <dt className="text-muted">Mods</dt>
            <dd className="font-semibold">{profile.stats.modCount}</dd>
          </div>
          <div>
            <dt className="text-muted">Downloads</dt>
            <dd className="font-semibold">
              {profile.stats.totalDownloads.toLocaleString()}
            </dd>
          </div>
        </dl>

        <section className="mt-10">
          <h2 className="text-xl font-semibold">Published mods</h2>
          <div className="mt-4">
            <ModGrid mods={profile.mods} emptyMessage="No published mods yet." />
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
