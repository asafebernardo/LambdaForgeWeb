import { Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.module";
import { UpdateProfileDto } from "./dto/update-profile.dto";
import { AuthUser } from "../common/decorators/current-user.decorator";

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async getMe(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: { profile: true },
    });
    if (!user) throw new NotFoundException();
    return this.sanitizeUser(user);
  }

  async updateMe(userId: string, dto: UpdateProfileDto) {
    await this.prisma.profile.upsert({
      where: { userId },
      create: { userId, ...dto },
      update: dto,
    });
    return this.getMe(userId);
  }

  async getPublicProfile(username: string) {
    const user = await this.prisma.user.findUnique({
      where: { username },
      include: {
        profile: true,
        mods: {
          where: { status: "PUBLISHED" },
          include: {
            game: true,
            tags: { include: { tag: true } },
            ratings: { select: { score: true } },
          },
          orderBy: { updatedAt: "desc" },
        },
      },
    });
    if (!user) throw new NotFoundException("User not found");

    const mods = user.mods.map((mod) => ({
      ...mod,
      averageRating: this.avgRating(mod.ratings),
      ratingCount: mod.ratings.length,
      ratings: undefined,
    }));

    return {
      id: user.id,
      username: user.username,
      role: user.role,
      profile: user.profile,
      stats: {
        modCount: mods.length,
        totalDownloads: mods.reduce((s, m) => s + m.downloadCount, 0),
      },
      mods,
    };
  }

  private avgRating(ratings: { score: number }[]) {
    if (!ratings.length) return 0;
    return ratings.reduce((s, r) => s + r.score, 0) / ratings.length;
  }

  private sanitizeUser(user: {
    id: string;
    email: string;
    username: string;
    role: string;
    createdAt: Date;
    profile: unknown;
  }) {
    return {
      id: user.id,
      email: user.email,
      username: user.username,
      role: user.role,
      createdAt: user.createdAt,
      profile: user.profile,
    };
  }
}
