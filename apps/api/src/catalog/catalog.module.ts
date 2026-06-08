import { Module } from "@nestjs/common";
import { CatalogController } from "./catalog.controller";
import { CatalogService } from "./catalog.service";
import { CatalogSearchService } from "./catalog-search.service";

@Module({
  controllers: [CatalogController],
  providers: [CatalogService, CatalogSearchService],
  exports: [CatalogService],
})
export class CatalogModule {}
