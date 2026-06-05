import type { Metadata } from "next";
import "./globals.css";
import { LOGO_SRC, SITE_NAME } from "@/lib/config";

export const metadata: Metadata = {
  title: {
    default: `${SITE_NAME} — Mod Launcher`,
    template: `%s · ${SITE_NAME}`,
  },
  description:
    "Launcher and mod manager for indie and sandbox games. Install mods with one click.",
  icons: {
    apple: LOGO_SRC,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">{children}</body>
    </html>
  );
}
