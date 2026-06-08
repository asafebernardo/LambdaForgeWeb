"use client";

import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { sdk } from "@/lib/api";
import type { ModDetail } from "@lambda-forge/types";

export function EditModForm() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const [mod, setMod] = useState<ModDetail | null>(null);
  const [description, setDescription] = useState("");
  const [version, setVersion] = useState("1.0.1");
  const [file, setFile] = useState<File | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!slug) return;
    sdk
      .getMod(slug)
      .then((m) => {
        setMod(m);
        setDescription(m.description);
      })
      .catch(() => setError("Mod not found"));
  }, [slug]);

  async function saveDescription() {
    if (!mod) return;
    setLoading(true);
    setError("");
    try {
      await sdk.updateMod(mod.id, { description });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Update failed");
    } finally {
      setLoading(false);
    }
  }

  async function uploadVersion() {
    if (!mod || !file) return;
    setLoading(true);
    setError("");
    try {
      const presign = await sdk.presignUpload({
        purpose: "mod_file",
        filename: file.name,
        contentType: file.type || "application/zip",
        sizeBytes: file.size,
      });
      await fetch(presign.uploadUrl, {
        method: "PUT",
        body: file,
        headers: { "Content-Type": file.type || "application/zip" },
      });
      await sdk.addModVersion(mod.id, {
        version,
        storageKey: presign.storageKey,
        filename: file.name,
        sizeBytes: file.size,
        mimeType: file.type || "application/zip",
      });
      navigate(`/mods/${mod.slug}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="mx-auto max-w-2xl px-4 py-10">
      <h1 className="text-2xl font-semibold">Edit mod</h1>
      {!mod && !error && <p className="mt-4 text-muted">Loading…</p>}
      {error && <p className="mt-4 text-danger">{error}</p>}
      {mod && (
        <div className="mt-6 space-y-6">
          <label className="block text-sm">
            Description
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={8}
              className="mt-1 w-full rounded-md border border-border bg-bg px-3 py-2"
            />
          </label>
          <button
            type="button"
            disabled={loading}
            onClick={saveDescription}
            className="rounded-md bg-accent px-4 py-2 text-sm font-semibold text-accent-foreground"
          >
            Save description
          </button>

          <hr className="border-border" />

          <h2 className="font-semibold">New version</h2>
          <label className="block text-sm">
            Version
            <input
              value={version}
              onChange={(e) => setVersion(e.target.value)}
              className="mt-1 w-full rounded-md border border-border bg-bg px-3 py-2"
            />
          </label>
          <input
            type="file"
            accept=".zip,.jar"
            onChange={(e) => setFile(e.target.files?.[0] ?? null)}
          />
          <button
            type="button"
            disabled={loading || !file}
            onClick={uploadVersion}
            className="rounded-md border border-accent px-4 py-2 text-sm text-accent"
          >
            Upload version
          </button>
        </div>
      )}
    </main>
  );
}
