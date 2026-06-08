import { prisma } from "../lib/prisma.js";

/** GameBanana game IDs aligned with launcher discover defaults. */
const GAMEBANANA_SOURCES: { slug: string; externalGameId: string; name: string }[] = [
  { slug: "left-4-dead-2", externalGameId: "3456", name: "Left 4 Dead 2" },
  { slug: "garrys-mod", externalGameId: "73", name: "Garry's Mod" },
  { slug: "team-fortress-2", externalGameId: "297", name: "Team Fortress 2" },
  { slug: "portal", externalGameId: "296", name: "Portal" },
  { slug: "portal-2", externalGameId: "4537", name: "Portal 2" },
];

async function main() {
  for (const src of GAMEBANANA_SOURCES) {
    const game = await prisma.game.findUnique({ where: { slug: src.slug } });
    await prisma.syncSource.upsert({
      where: {
        type_externalGameId: {
          type: "GAMEBANANA",
          externalGameId: src.externalGameId,
        },
      },
      create: {
        type: "GAMEBANANA",
        name: src.name,
        baseUrl: "https://gamebanana.com/apiv10",
        gameId: game?.id,
        externalGameId: src.externalGameId,
        enabled: true,
      },
      update: {
        name: src.name,
        gameId: game?.id,
        enabled: true,
      },
    });
    console.log(`SyncSource: ${src.name} (${src.externalGameId})`);
  }
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
