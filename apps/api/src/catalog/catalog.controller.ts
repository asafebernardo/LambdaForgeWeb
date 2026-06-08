import { Controller, Get, Param, Query } from "@nestjs/common";
import { Public } from "../common/decorators/public.decorator";
import { CatalogService } from "./catalog.service";
import { ListCatalogModsQueryDto } from "./dto/catalog.dto";

/** Local indexed catalog — never hits external APIs at request time. */
@Controller("catalog/mods")
export class CatalogController {
  constructor(private catalog: CatalogService) {}

  @Public()
  @Get()
  list(@Query() query: ListCatalogModsQueryDto) {
    return this.catalog.list(query);
  }

  @Public()
  @Get("search")
  search(@Query() query: ListCatalogModsQueryDto) {
    return this.catalog.searchMods(query);
  }

  @Public()
  @Get("trending")
  trending(@Query("limit") limit?: string) {
    return this.catalog.trending(limit ? Number(limit) : 24);
  }

  @Public()
  @Get("recent")
  recent(@Query("limit") limit?: string) {
    return this.catalog.recent(limit ? Number(limit) : 24);
  }

  @Public()
  @Get("sync/status")
  syncStatus() {
    return this.catalog.syncStatus();
  }

  @Public()
  @Get(":id")
  findById(@Param("id") id: string) {
    return this.catalog.findById(id);
  }
}
