import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { ThrottlerModule, ThrottlerGuard } from "@nestjs/throttler";
import { APP_GUARD } from "@nestjs/core";
import { PrismaModule } from "./prisma/prisma.module";
import { AuthModule } from "./auth/auth.module";
import { UsersModule } from "./users/users.module";
import { GamesModule } from "./games/games.module";
import { ModsModule } from "./mods/mods.module";
import { UploadsModule } from "./uploads/uploads.module";
import { SearchModule } from "./search/search.module";
import { StorageModule } from "./storage/storage.module";
import { CatalogModule } from "./catalog/catalog.module";
import { SupabaseModule } from "./supabase/supabase.module";

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: [".env", "../../.env"],
    }),
    ThrottlerModule.forRoot([
      { name: "default", ttl: 60000, limit: 100 },
      { name: "auth", ttl: 60000, limit: 10 },
      { name: "upload", ttl: 60000, limit: 20 },
    ]),
    PrismaModule,
    SupabaseModule,
    StorageModule,
    AuthModule,
    UsersModule,
    GamesModule,
    ModsModule,
    UploadsModule,
    SearchModule,
    CatalogModule,
  ],
  providers: [{ provide: APP_GUARD, useClass: ThrottlerGuard }],
})
export class AppModule {}
