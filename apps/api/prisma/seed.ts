import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const GAMES = [
  {
    name: "Vintage Story",
    slug: "vintage-story",
    coverUrl: "/assets/games/vintage-story.png",
  },
  { name: "Project Zomboid", slug: "project-zomboid", steamAppId: 108600 },
  { name: "Kenshi", slug: "kenshi", steamAppId: 233860 },
  {
    name: "Starsector",
    slug: "starsector",
    coverUrl: "/assets/games/starsector.png",
  },
  { name: "OpenTTD", slug: "openttd", steamAppId: 1536610 },
  {
    name: "OpenRCT2",
    slug: "openrct2",
    coverUrl: "/assets/games/openrct2.jpg",
  },
  { name: "Mindustry", slug: "mindustry", steamAppId: 1127400 },
  { name: "Barotrauma", slug: "barotrauma", steamAppId: 602960 },
  { name: "Unturned", slug: "unturned", steamAppId: 304930 },
  { name: "CDDA", slug: "cdda", steamAppId: 2330750 },
  { name: "Songs of Syx", slug: "songs-of-syx", steamAppId: 1162750 },
];

const CATEGORIES = [
  { name: "Gameplay", slug: "gameplay" },
  { name: "UI", slug: "ui" },
  { name: "Maps", slug: "maps" },
  { name: "Quality of Life", slug: "qol" },
  { name: "Total Conversion", slug: "total-conversion" },
];

async function main() {
  for (const game of GAMES) {
    await prisma.game.upsert({
      where: { slug: game.slug },
      create: game,
      update: game,
    });
  }

  for (const category of CATEGORIES) {
    const existing = await prisma.category.findFirst({
      where: { slug: category.slug, gameId: null },
    });
    if (existing) {
      await prisma.category.update({
        where: { id: existing.id },
        data: { name: category.name },
      });
    } else {
      await prisma.category.create({
        data: { name: category.name, slug: category.slug },
      });
    }
  }

  console.log(`Seeded ${GAMES.length} games and ${CATEGORIES.length} categories`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
