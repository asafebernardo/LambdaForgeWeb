import { Controller, Get, Query } from "@nestjs/common";
import { SearchService } from "./search.service";
import { Public } from "../common/decorators/public.decorator";

@Controller("search")
export class SearchController {
  constructor(private search: SearchService) {}

  @Public()
  @Get()
  status() {
    return { meilisearch: this.search.isAvailable() };
  }
}
