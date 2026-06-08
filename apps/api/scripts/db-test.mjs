#!/usr/bin/env node
/** Testa DATABASE_URL e DIRECT_URL (carregadas via dotenv). Uso: pnpm db:test */
import { PrismaClient } from "@prisma/client";

const urls = [
  ["DATABASE_URL (pooler)", process.env.DATABASE_URL],
  ["DIRECT_URL (migrations)", process.env.DIRECT_URL],
].filter(([, u]) => u);

let ok = false;
for (const [label, url] of urls) {
  process.env.DATABASE_URL = url;
  const prisma = new PrismaClient();
  try {
    const rows = await prisma.$queryRaw`SELECT 1 AS ok, current_database() AS db`;
    console.log(`✓ ${label}`);
    console.log(" ", rows);
    ok = true;
  } catch (e) {
    const msg = String(e);
    console.error(`✗ ${label}`);
    console.error(
      " ",
      msg.match(/FATAL:[^\n]+/)?.[0] ??
        msg.match(/Can't reach[^\n]+/)?.[0] ??
        msg.split("\n").slice(-2).join(" "),
    );
  } finally {
    await prisma.$disconnect();
  }
}

if (!ok) {
  console.error("\nVerifique no Supabase Dashboard:");
  console.error("  1. Projeto não está pausado → Restore project");
  console.error("  2. Settings → Database → Connection string → copie URI exata");
  console.error("  3. Database → Reset database password");
  process.exit(1);
}
