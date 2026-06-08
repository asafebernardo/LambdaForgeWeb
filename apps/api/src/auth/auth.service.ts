import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.module";
import { AuthUser } from "../common/decorators/current-user.decorator";
import { SyncProfileDto } from "./dto/auth.dto";

@Injectable()
export class AuthService {
  constructor(private prisma: PrismaService) {}

  async syncProfile(user: AuthUser, dto: SyncProfileDto) {
    if (!dto.username || dto.username === user.username) {
      return { user };
    }

    const taken = await this.prisma.user.findFirst({
      where: {
        username: dto.username,
        NOT: { id: user.id },
      },
    });
    if (taken) {
      throw new ConflictException("Username already taken");
    }

    const updated = await this.prisma.user.update({
      where: { id: user.id },
      data: { username: dto.username },
    });

    return {
      user: {
        id: updated.id,
        email: updated.email,
        username: updated.username,
        role: updated.role,
      },
    };
  }

  async me(user: AuthUser) {
    const dbUser = await this.prisma.user.findUnique({ where: { id: user.id } });
    if (!dbUser) throw new UnauthorizedException();
    return {
      user: {
        id: dbUser.id,
        email: dbUser.email,
        username: dbUser.username,
        role: dbUser.role,
      },
    };
  }
}
