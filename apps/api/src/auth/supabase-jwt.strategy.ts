import {
  Injectable,
  UnauthorizedException,
} from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import { ConfigService } from "@nestjs/config";
import { Request } from "express";
import { PrismaService } from "../prisma/prisma.module";
import { AuthUser } from "../common/decorators/current-user.decorator";
import { UserRole } from "@prisma/client";

function bearerExtractor(req: Request): string | null {
  const auth = req.headers.authorization;
  if (auth?.startsWith("Bearer ")) return auth.slice(7);
  return null;
}

interface SupabaseJwtPayload {
  sub: string;
  email?: string;
  user_metadata?: { username?: string };
}

/** Validates Supabase access JWT and resolves the local Prisma User. */
@Injectable()
export class SupabaseJwtStrategy extends PassportStrategy(
  Strategy,
  "supabase-jwt",
) {
  constructor(
    config: ConfigService,
    private prisma: PrismaService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([bearerExtractor]),
      ignoreExpiration: false,
      secretOrKey: config.getOrThrow<string>("SUPABASE_JWT_SECRET"),
    });
  }

  async validate(payload: SupabaseJwtPayload): Promise<AuthUser> {
    if (!payload.sub) {
      throw new UnauthorizedException("Invalid Supabase token");
    }

    const email =
      payload.email ??
      (await this.prisma.user.findUnique({ where: { supabaseId: payload.sub } }))
        ?.email;

    if (!email) {
      throw new UnauthorizedException("Invalid Supabase token");
    }

    const usernameMeta =
      payload.user_metadata?.username ?? email.split("@")[0];

    let user = await this.prisma.user.findUnique({
      where: { supabaseId: payload.sub },
    });

    if (!user) {
      user = await this.prisma.user.findUnique({ where: { email } });
    }

    if (user) {
      if (!user.supabaseId) {
        user = await this.prisma.user.update({
          where: { id: user.id },
          data: { supabaseId: payload.sub },
        });
      }
    } else {
      const baseUsername =
        usernameMeta.replace(/[^a-zA-Z0-9_-]/g, "") || "user";
      let username = baseUsername;
      let suffix = 0;
      while (await this.prisma.user.findUnique({ where: { username } })) {
        suffix++;
        username = `${baseUsername}${suffix}`;
      }

      user = await this.prisma.user.create({
        data: {
          supabaseId: payload.sub,
          email,
          username,
          role: UserRole.AUTHOR,
          profile: { create: {} },
        },
      });
    }

    return {
      id: user.id,
      email: user.email,
      username: user.username,
      role: user.role,
    };
  }
}
