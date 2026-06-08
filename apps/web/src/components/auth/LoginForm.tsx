"use client";

import { useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { sdk } from "@/lib/api";
import { signIn } from "@/lib/supabase";
import { useAuth } from "@/hooks/useAuth";

export function LoginForm() {
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const { refreshAuth } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await signIn(email, password);
      await sdk.syncProfile();
      refreshAuth();
      navigate(params.get("next") ?? "/mods");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Login failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={submit} className="mx-auto max-w-md space-y-4 rounded-lg border border-border bg-card/40 p-6">
      <h1 className="text-xl font-semibold">Log in</h1>
      <label className="block text-sm">
        Email
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="mt-1 w-full rounded-md border border-border bg-bg px-3 py-2"
          required
        />
      </label>
      <label className="block text-sm">
        Password
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="mt-1 w-full rounded-md border border-border bg-bg px-3 py-2"
          required
        />
      </label>
      {error && <p className="text-sm text-danger">{error}</p>}
      <button
        type="submit"
        disabled={loading}
        className="btn-primary w-full rounded-md py-2 text-sm font-semibold text-accent-foreground disabled:opacity-50"
      >
        {loading ? "Signing in…" : "Sign in"}
      </button>
      <p className="text-center text-sm text-muted">
        No account?{" "}
        <Link to="/register" className="text-accent">
          Sign up
        </Link>
      </p>
    </form>
  );
}
