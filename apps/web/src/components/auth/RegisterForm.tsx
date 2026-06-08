"use client";

import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { sdk } from "@/lib/api";
import { signUp } from "@/lib/supabase";
import { useAuth } from "@/hooks/useAuth";

export function RegisterForm() {
  const navigate = useNavigate();
  const { refreshAuth } = useAuth();
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const { session } = await signUp(email, password, username);
      if (session) {
        await sdk.syncProfile(username);
      }
      refreshAuth();
      if (!session) {
        setError("Check your email to confirm your account, then log in.");
        return;
      }
      navigate("/mods");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Registration failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={submit} className="mx-auto max-w-md space-y-4 rounded-lg border border-border bg-card/40 p-6">
      <h1 className="text-xl font-semibold">Create account</h1>
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
        Username
        <input
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="mt-1 w-full rounded-md border border-border bg-bg px-3 py-2"
          pattern="^[a-zA-Z0-9_-]+$"
          title="Letters, numbers, _ and - only"
          required
        />
      </label>
      <label className="block text-sm">
        Password
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          minLength={8}
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
        {loading ? "Creating…" : "Sign up"}
      </button>
      <p className="text-center text-sm text-muted">
        Already have an account?{" "}
        <Link to="/login" className="text-accent">
          Log in
        </Link>
      </p>
    </form>
  );
}
