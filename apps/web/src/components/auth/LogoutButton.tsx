"use client";

import { useRouter } from "next/navigation";
import { sdk } from "@/lib/api";

export function LogoutButton() {
  const router = useRouter();

  async function logout() {
    try {
      await sdk.logout();
    } catch {
      // cookie cleared server-side even on error
    }
    router.push("/");
    router.refresh();
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
