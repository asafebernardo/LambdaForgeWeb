import { useEffect, useState } from "react";
import { Header } from "@/components/Header";
import { DiscoverBrowseView } from "@/components/discover/DiscoverBrowseView";
import { fetchGames } from "@/lib/api";
import { SITE_NAME } from "@/lib/config";
import type { Game } from "@lambda-forge/types";

export function ModsPage() {
  const [games, setGames] = useState<Game[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    document.title = `Mods · ${SITE_NAME}`;
  }, []);

  useEffect(() => {
    setLoading(true);
    fetchGames()
      .then(setGames)
      .finally(() => setLoading(false));
  }, []);

  return (
    <>
      <Header active="mods" />
      <DiscoverBrowseView games={games} loading={loading} />
    </>
  );
}
