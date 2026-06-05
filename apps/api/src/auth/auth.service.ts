import { Injectable, UnauthorizedException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { ConfigService } from "@nestjs/config";
import * as bcrypt from "bcrypt";
import { Response } from "express";
import { PrismaService } from "../prisma/prisma.module";
import { RegisterDto, LoginDto } from "./dto/auth.dto";
import { AuthUser } from "../common/decorators/current-user.decorator";

const ACCESS_COOKIE = "access_token";
const REFRESH_COOKIE = "refresh_token";

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwt: JwtService,
    private config: ConfigService,
  ) {}

  private signAccess(user: AuthUser) {
    return this.jwt.sign(
      { sub: user.id, email: user.email, username: user.username, role: user.role },
      {
        secret: this.config.get("JWT_ACCESS_SECRET"),
        expiresIn: this.config.get("JWT_ACCESS_EXPIRES", "15m"),
      },
    );
  }

  private signRefresh(userId: string) {
    return this.jwt.sign(
      { sub: userId, type: "refresh" },
      {
        secret: this.config.get("JWT_REFRESH_SECRET"),
        expiresIn: this.config.get("JWT_REFRESH_EXPIRES", "7d"),
      },
    );
  }

  setAuthCookies(res: Response, accessToken: string, refreshToken: string) {
    const isProd = process.env.NODE_ENV === "production";
    res.cookie(ACCESS_COOKIE, accessToken, {
      httpOnly: true,
      secure: isProd,
      sameSite: "lax",
      maxAge: 15 * 60 * 1000,
    });
    res.cookie(REFRESH_COOKIE, refreshToken, {
      httpOnly: true,
      secure: isProd,
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });
  }

  clearAuthCookies(res: Response) {
    res.clearCookie(ACCESS_COOKIE);
    res.clearCookie(REFRESH_COOKIE);
  }

  async register(dto: RegisterDto, res: Response) {
    const existing = await this.prisma.user.findFirst({
      where: { OR: [{ email: dto.email }, { username: dto.username }] },
    });
    if (existing) {
      throw new UnauthorizedException("Email or username already taken");
    }

    const passwordHash = await bcrypt.hash(dto.password, 12);
    const user = await this.prisma.user.create({
      data: {
        email: dto.email,
        username: dto.username,
        passwordHash,
        role: "AUTHOR",
        profile: { create: {} },
      },
    });

    const authUser: AuthUser = {
      id: user.id,
      email: user.email,
      username: user.username,
      role: user.role,
    };
    const access = this.signAccess(authUser);
    const refresh = this.signRefresh(user.id);
    this.setAuthCookies(res, access, refresh);

    return { user: authUser, accessToken: access };
  }

  async login(dto: LoginDto, res: Response) {
    const user = await this.prisma.user.findFirst({
      where: {
        OR: [{ email: dto.emailOrUsername }, { username: dto.emailOrUsername }],
      },
    });
    if (!user) throw new UnauthorizedException("Invalid credentials");

    const valid = await bcrypt.compare(dto.password, user.passwordHash);
    if (!valid) throw new UnauthorizedException("Invalid credentials");

    const authUser: AuthUser = {
      id: user.id,
      email: user.email,
      username: user.username,
      role: user.role,
    };
    const access = this.signAccess(authUser);
    const refresh = this.signRefresh(user.id);
    this.setAuthCookies(res, access, refresh);

    return { user: authUser, accessToken: access };
  }

  async refresh(refreshToken: string | undefined, res: Response) {
    if (!refreshToken) throw new UnauthorizedException("No refresh token");

    let payload: { sub: string; type?: string };
    try {
      payload = this.jwt.verify(refreshToken, {
        secret: this.config.get("JWT_REFRESH_SECRET"),
      });
    } catch {
      throw new UnauthorizedException("Invalid refresh token");
    }

    if (payload.type !== "refresh") {
      throw new UnauthorizedException("Invalid refresh token");
    }

    const user = await this.prisma.user.findUnique({ where: { id: payload.sub } });
    if (!user) throw new UnauthorizedException("User not found");

    const authUser: AuthUser = {
      id: user.id,
      email: user.email,
      username: user.username,
      role: user.role,
    };
    const access = this.signAccess(authUser);
    const refresh = this.signRefresh(user.id);
    this.setAuthCookies(res, access, refresh);

    return { user: authUser, accessToken: access };
  }

  logout(res: Response) {
    this.clearAuthCookies(res);
    return { ok: true };
  }
}
