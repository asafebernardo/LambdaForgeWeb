import { useEffect, useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { Header } from "@/components/Header";
import { DiscoverShell } from "@/components/discover/DiscoverShell";
import { UploadForm } from "@/components/mods/UploadForm";
import { fetchCategories, fetchGames } from "@/lib/api";
import { SITE_NAME } from "@/lib/config";
import type { Category, Game } from "@lambda-forge/types";

export function ModUploadPage() {
  const [searchParams] = useSearchParams();
  const [games, setGames] = useState<Game[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  const gameSlug = searchParams.get("game") ?? undefined;

  const initialGameId = useMemo(() => {
    if (!gameSlug || games.length === 0) return undefined;
    return games.find((g) => g.slug === gameSlug)?.id;
  }, [gameSlug, games]);

  useEffect(() => {
    document.title = `Enviar mod · ${SITE_NAME}`;
  }, []);

  useEffect(() => {
    setLoading(true);
    Promise.all([fetchGames(), fetchCategories()])
      .then(([g, c]) => {
        setGames(g);
        setCategories(c);
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <>
      <Header active="upload" />
      <DiscoverShell>
        <header className="shrink-0 border-b border-border px-6 py-5 sm:px-8">
          <div className="mx-auto flex max-w-3xl flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <Link
                to="/mods"
                className="mb-3 inline-flex items-center gap-1.5 text-sm text-muted no-underline hover:text-accent"
              >
                <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth={2}>
                  <path d="M19 12H5M12 19l-7-7 7-7" />
                </svg>
                Voltar para mods
              </Link>
              <h1 className="font-display text-2xl font-semibold">Enviar mod</h1>
              <p className="mt-1 max-w-lg text-sm text-muted">
                Compartilhe seu mod com a comunidade. Preencha os detalhes, envie o
                arquivo e publique na loja.
              </p>
            </div>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto px-6 py-8 sm:px-8">
          <div className="mx-auto max-w-3xl">
            {loading ? (
              <div className="flex items-center justify-center py-20 text-muted">
                <span className="inline-block h-8 w-8 animate-spin rounded-full border-2 border-accent border-t-transparent" />
              </div>
            ) : games.length === 0 ? (
              <div className="glass-card rounded-2xl px-6 py-12 text-center text-sm text-muted">
                <p className="font-medium text-text">Nenhum jogo disponível</p>
                <p className="mt-1">Não foi possível carregar a lista de jogos.</p>
              </div>
            ) : (
              <>
                <aside className="mb-8 rounded-xl border border-border/80 bg-card/30 px-4 py-3 text-xs text-muted">
                  <p className="font-medium text-text">Antes de enviar</p>
                  <ul className="mt-2 list-inside list-disc space-y-1">
                    <li>Use um arquivo .zip ou .jar com a estrutura correta do jogo</li>
                    <li>Descreva claramente o que o mod faz e como instalar</li>
                    <li>Você poderá editar e enviar novas versões depois</li>
                  </ul>
                </aside>
                <UploadForm
                  games={games}
                  categories={categories}
                  initialGameId={initialGameId}
                />
              </>
            )}
          </div>
        </div>
      </DiscoverShell>
    </>
  );
}
