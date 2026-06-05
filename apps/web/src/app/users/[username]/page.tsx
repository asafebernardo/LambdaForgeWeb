import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { ModGrid } from "@/components/mods/ModGrid";
import { sdk } from "@/lib/api";

export const revalidate = 60;

interface UserPageProps {
  params: Promise<{ username: string }>;
}

export async function generateMetadata({ params }: UserPageProps): Promise<Metadata> {
  const { username } = await params;
  return { title: `@${username}` };
}

export default async function UserPage({ params }: UserPageProps) {
  const { username } = await params;

  let profile;
  try {
    profile = await sdk.getUser(username);
  } catch {
    notFound();
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
            <dd className="font-semibold">{profile.stats.totalDownloads.toLocaleString()}</dd>
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
