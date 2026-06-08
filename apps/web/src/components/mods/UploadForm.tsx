"use client";

import { useState } from "react";
import type { Category, Game } from "@lambda-forge/types";
import { useNavigate } from "react-router-dom";
import { sdk } from "@/lib/api";

interface UploadFormProps {
  games: Game[];
  categories: Category[];
}

export function UploadForm({ games, categories }: UploadFormProps) {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [gameId, setGameId] = useState(games[0]?.id ?? "");
  const [categoryId, setCategoryId] = useState("");
  const [tags, setTags] = useState("");
  const [version, setVersion] = useState("1.0.0");
  const [changelog, setChangelog] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [modId, setModId] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function createMod() {
    setError("");
    setLoading(true);
    try {
      const mod = await sdk.createMod({
        title,
        description,
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
      setError(err instanceof Error ? err.message : "Failed to create mod");
    } finally {
      setLoading(false);
    }
  }

  async function uploadAndPublish() {
    if (!file || !modId) return;
    setError("");
    setLoading(true);
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
      if (!uploadRes.ok) throw new Error("File upload failed");

      await sdk.addModVersion(modId, {
        version,
        changelog: changelog || undefined,
        storageKey: presign.storageKey,
        filename: file.name,
        sizeBytes: file.size,
        mimeType: file.type || "application/zip",
      });

      const published = await sdk.publishMod(modId);
      navigate(`/mods/${published.slug}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div className="flex gap-2 text-sm text-muted">
        <span className={step === 1 ? "text-accent" : ""}>1. Details</span>
        <span>→</span>
        <span className={step === 2 ? "text-accent" : ""}>2. File & publish</span>
      </div>

      {error && <p className="rounded-md bg-danger/10 px-3 py-2 text-sm text-danger">{error}</p>}

      {step === 1 && (
        <div className="space-y-4 rounded-lg border border-border bg-card/40 p-6">
          <label className="block text-sm">
            Title
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="mt-1 w-full rounded-md border border-border bg-bg px-3 py-2"
              required
            />
          </label>
          <label className="block text-sm">
            Description
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={6}
              className="mt-1 w-full rounded-md border border-border bg-bg px-3 py-2"
              required
            />
          </label>
          <label className="block text-sm">
            Game
            <select
              value={gameId}
              onChange={(e) => setGameId(e.target.value)}
              className="mt-1 w-full rounded-md border border-border bg-bg px-3 py-2"
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
              Category
              <select
                value={categoryId}
                onChange={(e) => setCategoryId(e.target.value)}
                className="mt-1 w-full rounded-md border border-border bg-bg px-3 py-2"
              >
                <option value="">None</option>
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </label>
          )}
          <label className="block text-sm">
            Tags (comma-separated)
            <input
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              placeholder="ui, qol"
              className="mt-1 w-full rounded-md border border-border bg-bg px-3 py-2"
            />
          </label>
          <button
            type="button"
            disabled={loading}
            onClick={createMod}
            className="rounded-md bg-accent px-4 py-2 text-sm font-semibold text-accent-foreground disabled:opacity-50"
          >
            {loading ? "Saving…" : "Continue"}
          </button>
        </div>
      )}

      {step === 2 && (
        <div className="space-y-4 rounded-lg border border-border bg-card/40 p-6">
          <label className="block text-sm">
            Version
            <input
              value={version}
              onChange={(e) => setVersion(e.target.value)}
              className="mt-1 w-full rounded-md border border-border bg-bg px-3 py-2"
            />
          </label>
          <label className="block text-sm">
            Changelog
            <textarea
              value={changelog}
              onChange={(e) => setChangelog(e.target.value)}
              rows={3}
              className="mt-1 w-full rounded-md border border-border bg-bg px-3 py-2"
            />
          </label>
          <label className="block text-sm">
            Mod file (.zip or .jar)
            <input
              type="file"
              accept=".zip,.jar"
              onChange={(e) => setFile(e.target.files?.[0] ?? null)}
              className="mt-1 block w-full text-sm"
            />
          </label>
          <button
            type="button"
            disabled={loading || !file}
            onClick={uploadAndPublish}
            className="rounded-md bg-accent px-4 py-2 text-sm font-semibold text-accent-foreground disabled:opacity-50"
          >
            {loading ? "Uploading…" : "Upload & publish"}
          </button>
        </div>
      )}
    </div>
  );
}
