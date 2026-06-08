"use client";

import { useNavigate } from "react-router-dom";
import { signOut } from "@/lib/supabase";
import { useAuth } from "@/hooks/useAuth";

export function LogoutButton() {
  const navigate = useNavigate();
  const { refreshAuth } = useAuth();

  async function logout() {
    try {
      await signOut();
    } catch {
      // session cleared client-side even on error
    }
    refreshAuth();
    navigate("/home");
  }

  return (
    <button
      type="button"
      onClick={logout}
      className="rounded-lg px-3.5 py-2 text-sm text-muted transition-colors hover:bg-white/5 hover:text-text"
    >
      Log out
    </button>
  );
}
