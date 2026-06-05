import { cookies } from "next/headers";
import { HeaderNav } from "@/components/HeaderNav";

export type HeaderActive =
  | "home"
  | "download"
  | "mods"
  | "login"
  | "register"
  | "upload";

interface HeaderProps {
  active?: HeaderActive;
  showLandingExtras?: boolean;
}

const publicLinks = [
  { href: "/", label: "Home", key: "home" as const },
  { href: "/download", label: "Download", key: "download" as const },
];

const authLinks = [
  { href: "/", label: "Home", key: "home" as const },
  { href: "/mods", label: "Mods", key: "mods" as const },
  { href: "/download", label: "Download", key: "download" as const },
  { href: "/mods/upload", label: "Upload", key: "upload" as const },
];

export async function Header({
  active = "home",
  showLandingExtras = false,
}: HeaderProps) {
  const cookieStore = await cookies();
  const isAuthenticated = Boolean(cookieStore.get("access_token")?.value);
  const links = isAuthenticated ? authLinks : publicLinks;

  return (
    <HeaderNav
      active={active}
      isAuthenticated={isAuthenticated}
      links={links}
      showLandingExtras={showLandingExtras}
    />
  );
}
