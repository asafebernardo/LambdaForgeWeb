import { Module, ExecutionContext, Injectable } from "@nestjs/common";
import { PassportModule } from "@nestjs/passport";
import { APP_GUARD } from "@nestjs/core";
import { Reflector } from "@nestjs/core";
import { AuthService } from "./auth.service";
import { AuthController } from "./auth.controller";
import { SupabaseJwtStrategy } from "./supabase-jwt.strategy";
import { JwtAuthGuard } from "../common/guards/jwt-auth.guard";
import { IS_PUBLIC_KEY } from "../common/decorators/public.decorator";
import { SupabaseModule } from "../supabase/supabase.module";

@Injectable()
class GlobalSupabaseAuthGuard extends JwtAuthGuard {
  constructor(private reflector: Reflector) {
    super();
  }

  canActivate(context: ExecutionContext) {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (isPublic) return true;
    return super.canActivate(context);
  }
}

@Module({
  imports: [PassportModule, SupabaseModule],
  controllers: [AuthController],
  providers: [
    AuthService,
    SupabaseJwtStrategy,
    { provide: APP_GUARD, useClass: GlobalSupabaseAuthGuard },
  ],
  exports: [AuthService],
})
export class AuthModule {}
