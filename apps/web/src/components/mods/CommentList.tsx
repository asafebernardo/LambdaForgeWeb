"use client";

import { useState } from "react";
import type { Comment } from "@lambda-forge/types";
import { sdk } from "@/lib/api";

interface CommentListProps {
  modId: string;
  initialComments: Comment[];
  initialTotal: number;
}

export function CommentList({
  modId,
  initialComments,
  initialTotal,
}: CommentListProps) {
  const [comments, setComments] = useState(initialComments);
  const [total, setTotal] = useState(initialTotal);
  const [body, setBody] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const comment = await sdk.createComment(modId, body.trim());
      setComments((prev) => [comment, ...prev]);
      setTotal((t) => t + 1);
      setBody("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to post comment");
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="space-y-4">
      <h2 className="text-lg font-semibold">Comments ({total})</h2>

      <form onSubmit={submit} className="space-y-2">
        <textarea
          value={body}
          onChange={(e) => setBody(e.target.value)}
          rows={3}
          placeholder="Write a comment…"
          className="w-full rounded-md border border-border bg-bg px-3 py-2 text-sm text-text"
          required
        />
        {error && <p className="text-sm text-danger">{error}</p>}
        <button
          type="submit"
          disabled={loading}
          className="rounded-md bg-accent px-4 py-2 text-sm font-semibold text-accent-foreground disabled:opacity-50"
        >
          {loading ? "Posting…" : "Post comment"}
        </button>
      </form>

      <ul className="space-y-3">
        {comments.map((c) => (
          <li key={c.id} className="rounded-md border border-border bg-card/40 p-3">
            <div className="flex items-center justify-between gap-2 text-xs text-muted">
              <span>@{c.user.username}</span>
              <time dateTime={c.createdAt}>
                {new Date(c.createdAt).toLocaleString()}
              </time>
            </div>
            <p className="mt-2 whitespace-pre-wrap text-sm">{c.body}</p>
          </li>
        ))}
      </ul>
    </section>
  );
}
