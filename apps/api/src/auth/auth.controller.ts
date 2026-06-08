import { Body, Controller, Post, UseGuards } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { SyncProfileDto } from "./dto/auth.dto";
import { JwtAuthGuard } from "../common/guards/jwt-auth.guard";
import { CurrentUser, AuthUser } from "../common/decorators/current-user.decorator";

@Controller("auth")
export class AuthController {
  constructor(private auth: AuthService) {}

  /** Sync local profile after Supabase sign-up (username) or first login. */
  @UseGuards(JwtAuthGuard)
  @Post("sync")
  sync(@CurrentUser() user: AuthUser, @Body() dto: SyncProfileDto) {
    return this.auth.syncProfile(user, dto);
  }

  @UseGuards(JwtAuthGuard)
  @Post("me")
  me(@CurrentUser() user: AuthUser) {
    return this.auth.me(user);
  }
}
