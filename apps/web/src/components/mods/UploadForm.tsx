import { useCallback, useEffect, useState } from "react";
import type { Category, Game } from "@lambda-forge/types";
import { useNavigate } from "react-router-dom";
import { sdk } from "@/lib/api";
import { formatBytes } from "@/lib/format";

interface UploadFormProps {
  games: Game[];
  categories: Category[];
  initialGameId?: string;
}

const STEPS = [
  { id: 1, label: "Informações" },
  { id: 2, label: "Arquivo" },
  { id: 3, label: "Publicar" },
] as const;

const ACCEPTED_EXT = [".zip", ".jar"];

function parseError(err: unknown): string {
  if (err instanceof Error) {
    try {
      const json = JSON.parse(err.message) as { message?: string | string[] };
      if (Array.isArray(json.message)) return json.message.join(", ");
      if (json.message) return json.message;
    } catch {
      /* plain text */
    }
    return err.message;
  }
  return "Ocorreu um erro inesperado";
}

export function UploadForm({ games, categories, initialGameId }: UploadFormProps) {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [gameId, setGameId] = useState("");

  useEffect(() => {
    if (initialGameId) setGameId(initialGameId);
    else if (games[0]) setGameId((prev) => prev || games[0].id);
  }, [initialGameId, games]);
  const [categoryId, setCategoryId] = useState("");
  const [tags, setTags] = useState("");

  const [version, setVersion] = useState("1.0.0");
  const [changelog, setChangelog] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [dragOver, setDragOver] = useState(false);

  const [modId, setModId] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const selectedGame = games.find((g) => g.id === gameId);

  const pickFile = useCallback((picked: File | null) => {
    if (!picked) {
      setFile(null);
      return;
    }
    const ext = picked.name.slice(picked.name.lastIndexOf(".")).toLowerCase();
    if (!ACCEPTED_EXT.includes(ext)) {
      setError("Envie um arquivo .zip ou .jar");
      return;
    }
    setError("");
    setFile(picked);
  }, []);

  function validateStep1(): string | null {
    if (title.trim().length < 3) return "O título precisa ter pelo menos 3 caracteres";
    if (description.trim().length < 20) return "A descrição precisa ter pelo menos 20 caracteres";
    if (!gameId) return "Selecione um jogo";
    return null;
  }

  function validateStep2(): string | null {
    if (!version.trim()) return "Informe a versão do mod";
    if (!file) return "Selecione o arquivo do mod";
    return null;
  }

  async function createModDraft() {
    const validation = validateStep1();
    if (validation) {
      setError(validation);
      return;
    }

    setError("");
    setLoading(true);
    try {
      const mod = await sdk.createMod({
        title: title.trim(),
        description: description.trim(),
        gameId,
        categoryId: categoryId || undefined,
        tags: tags
          .split(",")
          .map((t) => t.trim())
          .filter(Boolean),
      });
      setModId(mod.id);
      setStep(2);
    } catch (err) {
      setError(parseError(err));
    } finally {
      setLoading(false);
    }
  }

  async function uploadAndPublish() {
    const validation = validateStep2();
    if (validation) {
      setError(validation);
      return;
    }
    if (!file || !modId) return;

    setError("");
    setLoading(true);
    setStep(3);
    try {
      const presign = await sdk.presignUpload({
        purpose: "mod_file",
        filename: file.name,
        contentType: file.type || "application/zip",
        sizeBytes: file.size,
      });

      const uploadRes = await fetch(presign.uploadUrl, {
        method: "PUT",
        body: file,
        headers: { "Content-Type": file.type || "application/zip" },
      });
      if (!uploadRes.ok) throw new Error("Falha ao enviar o arquivo para o servidor");

      await sdk.addModVersion(modId, {
        version: version.trim(),
        changelog: changelog.trim() || undefined,
        storageKey: presign.storageKey,
        filename: file.name,
        sizeBytes: file.size,
        mimeType: file.type || "application/zip",
      });

      const published = await sdk.publishMod(modId);
      navigate(`/mods/${published.slug}`);
    } catch (err) {
      setStep(2);
      setError(parseError(err));
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto max-w-3xl">
      <nav aria-label="Etapas do envio" className="mb-8">
        <ol className="flex items-center gap-2 sm:gap-4">
          {STEPS.map((s, i) => (
            <li key={s.id} className="flex min-w-0 flex-1 items-center gap-2">
              <span
                className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-semibold ${
                  step >= s.id
                    ? "bg-accent text-accent-foreground"
                    : "border border-border bg-card text-muted"
                }`}
              >
                {s.id}
              </span>
              <span
                className={`hidden truncate text-sm sm:inline ${
                  step >= s.id ? "font-medium text-text" : "text-muted"
                }`}
              >
                {s.label}
              </span>
              {i < STEPS.length - 1 && (
                <span className="mx-1 hidden h-px flex-1 bg-border sm:block" />
              )}
            </li>
          ))}
        </ol>
      </nav>

      {error && (
        <div
          role="alert"
          className="mb-6 rounded-xl border border-danger/30 bg-danger/10 px-4 py-3 text-sm text-danger"
        >
          {error}
        </div>
      )}

      {step === 1 && (
        <section className="glass-card space-y-5 rounded-2xl p-6 sm:p-8">
          <div>
            <h2 className="text-lg font-semibold">Detalhes do mod</h2>
            <p className="mt-1 text-sm text-muted">
              Conte o que seu mod faz e para qual jogo ele é.
            </p>
          </div>

          <label className="block text-sm">
            <span className="font-medium text-text">Título</span>
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Ex.: HUD minimalista para TF2"
              maxLength={120}
              className="mt-1.5 w-full rounded-lg border border-border bg-bg px-3 py-2.5 text-text focus:border-accent/50 focus:outline-none focus:ring-1 focus:ring-accent/30"
              required
            />
          </label>

          <label className="block text-sm">
            <span className="font-medium text-text">Descrição</span>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={6}
              placeholder="Explique o que o mod altera, como instalar e requisitos…"
              className="mt-1.5 w-full rounded-lg border border-border bg-bg px-3 py-2.5 text-text focus:border-accent/50 focus:outline-none focus:ring-1 focus:ring-accent/30"
              required
            />
            <span className="mt-1 block text-xs text-muted">
              Mínimo 20 caracteres · {description.length} digitados
            </span>
          </label>

          <div className="grid gap-5 sm:grid-cols-2">
            <label className="block text-sm">
              <span className="font-medium text-text">Jogo</span>
              <select
                value={gameId}
                onChange={(e) => setGameId(e.target.value)}
                className="mt-1.5 w-full rounded-lg border border-border bg-bg px-3 py-2.5 text-text"
              >
                {games.map((g) => (
                  <option key={g.id} value={g.id}>
                    {g.name}
                  </option>
                ))}
              </select>
            </label>

            {categories.length > 0 && (
              <label className="block text-sm">
                <span className="font-medium text-text">Categoria</span>
                <select
                  value={categoryId}
                  onChange={(e) => setCategoryId(e.target.value)}
                  className="mt-1.5 w-full rounded-lg border border-border bg-bg px-3 py-2.5 text-text"
                >
                  <option value="">Nenhuma</option>
                  {categories.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </label>
            )}
          </div>

          <label className="block text-sm">
            <span className="font-medium text-text">Tags</span>
            <input
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              placeholder="hud, interface, qol (separadas por vírgula)"
              className="mt-1.5 w-full rounded-lg border border-border bg-bg px-3 py-2.5 text-text"
            />
          </label>

          <div className="flex justify-end pt-2">
            <button
              type="button"
              disabled={loading}
              onClick={createModDraft}
              className="rounded-lg bg-accent px-5 py-2.5 text-sm font-semibold text-accent-foreground transition hover:opacity-90 disabled:opacity-50"
            >
              {loading ? "Salvando…" : "Continuar"}
            </button>
          </div>
        </section>
      )}

      {step === 2 && (
        <section className="glass-card space-y-5 rounded-2xl p-6 sm:p-8">
          <div>
            <h2 className="text-lg font-semibold">Arquivo do mod</h2>
            <p className="mt-1 text-sm text-muted">
              Envie o pacote do mod para{" "}
              <span className="text-text">{selectedGame?.name ?? "o jogo selecionado"}</span>.
            </p>
          </div>

          <div className="rounded-xl border border-border/80 bg-bg/40 p-4 text-sm text-muted">
            <p className="font-medium text-text">{title}</p>
            <p className="mt-1 line-clamp-2 text-xs">{description}</p>
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
            <label className="block text-sm">
              <span className="font-medium text-text">Versão</span>
              <input
                value={version}
                onChange={(e) => setVersion(e.target.value)}
                placeholder="1.0.0"
                className="mt-1.5 w-full rounded-lg border border-border bg-bg px-3 py-2.5 text-text"
              />
            </label>
          </div>

          <label className="block text-sm">
            <span className="font-medium text-text">Changelog (opcional)</span>
            <textarea
              value={changelog}
              onChange={(e) => setChangelog(e.target.value)}
              rows={3}
              placeholder="O que mudou nesta versão?"
              className="mt-1.5 w-full rounded-lg border border-border bg-bg px-3 py-2.5 text-text"
            />
          </label>

          <div
            onDragOver={(e) => {
              e.preventDefault();
              setDragOver(true);
            }}
            onDragLeave={() => setDragOver(false)}
            onDrop={(e) => {
              e.preventDefault();
              setDragOver(false);
              pickFile(e.dataTransfer.files[0] ?? null);
            }}
            className={`rounded-xl border-2 border-dashed p-8 text-center transition-colors ${
              dragOver
                ? "border-accent bg-accent/5"
                : file
                  ? "border-accent/40 bg-accent/5"
                  : "border-border bg-bg/30"
            }`}
          >
            {file ? (
              <div className="space-y-2">
                <p className="font-medium text-text">{file.name}</p>
                <p className="text-sm text-muted">{formatBytes(file.size)}</p>
                <button
                  type="button"
                  onClick={() => setFile(null)}
                  className="text-sm text-accent hover:underline"
                >
                  Escolher outro arquivo
                </button>
              </div>
            ) : (
              <>
                <p className="text-sm text-muted">
                  Arraste o arquivo aqui ou clique para selecionar
                </p>
                <p className="mt-1 text-xs text-muted">.zip ou .jar · máx. 500 MB</p>
              </>
            )}
            <input
              type="file"
              accept=".zip,.jar"
              className={file ? "sr-only" : "mt-4 block w-full cursor-pointer text-sm"}
              onChange={(e) => pickFile(e.target.files?.[0] ?? null)}
            />
          </div>

          <div className="flex flex-wrap justify-between gap-3 pt-2">
            <button
              type="button"
              disabled={loading}
              onClick={() => {
                setError("");
                setStep(1);
              }}
              className="rounded-lg border border-border px-4 py-2.5 text-sm text-muted hover:text-text"
            >
              Voltar
            </button>
            <button
              type="button"
              disabled={loading || !file}
              onClick={uploadAndPublish}
              className="rounded-lg bg-accent px-5 py-2.5 text-sm font-semibold text-accent-foreground transition hover:opacity-90 disabled:opacity-50"
            >
              {loading ? "Publicando…" : "Enviar e publicar"}
            </button>
          </div>
        </section>
      )}

      {step === 3 && (
        <section className="glass-card flex flex-col items-center justify-center gap-4 rounded-2xl px-6 py-16 text-center">
          <span className="inline-block h-10 w-10 animate-spin rounded-full border-2 border-accent border-t-transparent" />
          <div>
            <p className="font-medium text-text">Publicando seu mod…</p>
            <p className="mt-1 text-sm text-muted">Enviando arquivo e tornando visível na loja.</p>
          </div>
        </section>
      )}
    </div>
  );
}
