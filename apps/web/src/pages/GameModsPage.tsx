import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { Header } from "@/components/Header";
import { DiscoverStoreView } from "@/components/discover/DiscoverStoreView";
import { fetchGame } from "@/lib/api";
import { SITE_NAME } from "@/lib/config";
import type { Game } from "@lambda-forge/types";

export function GameModsPage() {
  const { gameSlug } = useParams<{ gameSlug: string }>();
  const navigate = useNavigate();
  const [game, setGame] = useState<Game | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    if (!gameSlug) return;
    setLoading(true);
    setNotFound(false);
    fetchGame(gameSlug)
      .then((g) => {
        if (!g) setNotFound(true);
        else {
          setGame(g);
          document.title = `${g.name} Mods · ${SITE_NAME}`;
        }
      })
      .finally(() => setLoading(false));
  }, [gameSlug]);

  if (notFound) {
    return (
      <>
        <Header active="mods" />
        <main className="flex min-h-[calc(100vh-4rem)] flex-col items-center justify-center px-4 text-center">
          <h1 className="text-2xl font-semibold">Game not found</h1>
          <Link to="/mods" className="mt-4 text-accent">
            Back to game library
          </Link>
        </main>
      </>
    );
  }

  if (loading || !game) {
    return (
      <>
        <Header active="mods" />
        <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center text-muted">
          <span className="inline-block h-8 w-8 animate-spin rounded-full border-2 border-accent border-t-transparent" />
        </div>
      </>
    );
  }

  return (
    <>
      <Header active="mods" />
      <DiscoverStoreView game={game} onBack={() => navigate("/mods")} />
    </>
  );
}
