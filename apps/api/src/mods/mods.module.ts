import { Module } from "@nestjs/common";
import { ModsService } from "./mods.service";
import { ModsController } from "./mods.controller";
import { SearchModule } from "../search/search.module";

@Module({
  imports: [SearchModule],
  controllers: [ModsController],
  providers: [ModsService],
  exports: [ModsService],
})
export class ModsModule {}
