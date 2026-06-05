import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.module";

@Injectable()
export class GamesService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    const games = await this.prisma.game.findMany({
      orderBy: { name: "asc" },
      include: {
        _count: { select: { mods: { where: { status: "PUBLISHED" } } } },
      },
    });
    return games.map((g) => ({
      id: g.id,
      name: g.name,
      slug: g.slug,
      steamAppId: g.steamAppId,
      coverUrl: g.coverUrl,
      modCount: g._count.mods,
    }));
  }

  async findBySlug(slug: string) {
    const game = await this.prisma.game.findUnique({
      where: { slug },
      include: {
        _count: { select: { mods: { where: { status: "PUBLISHED" } } } },
      },
    });
    if (!game) return null;
    return {
      id: game.id,
      name: game.name,
      slug: game.slug,
      steamAppId: game.steamAppId,
      coverUrl: game.coverUrl,
      modCount: game._count.mods,
    };
  }

  async findCategories() {
    return this.prisma.category.findMany({
      where: { gameId: null },
      orderBy: { name: "asc" },
    });
  }
}
