import { Controller, Get, NotFoundException, Param } from "@nestjs/common";
import { GamesService } from "./games.service";
import { Public } from "../common/decorators/public.decorator";

@Controller("games")
export class GamesController {
  constructor(private games: GamesService) {}

  @Public()
  @Get()
  findAll() {
    return this.games.findAll();
  }

  @Public()
  @Get("categories/list")
  categories() {
    return this.games.findCategories();
  }

  @Public()
  @Get(":slug")
  async findOne(@Param("slug") slug: string) {
    const game = await this.games.findBySlug(slug);
    if (!game) throw new NotFoundException("Game not found");
    return game;
  }
}
