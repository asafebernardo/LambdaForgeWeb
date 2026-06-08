import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  Req,
  UseGuards,
} from "@nestjs/common";
import { Throttle } from "@nestjs/throttler";
import { Request } from "express";
import { ModsService } from "./mods.service";
import {
  CreateModDto,
  UpdateModDto,
  CreateVersionDto,
  ListModsQueryDto,
  RateModDto,
  CreateCommentDto,
  ListCommentsQueryDto,
} from "./dto/mods.dto";
import { JwtAuthGuard } from "../common/guards/jwt-auth.guard";
import { OptionalJwtAuthGuard } from "../common/guards/optional-jwt.guard";
import { CurrentUser, AuthUser } from "../common/decorators/current-user.decorator";

@Controller("mods")
export class ModsController {
  constructor(private mods: ModsService) {}

  @Get()
  list(@Query() query: ListModsQueryDto) {
    return this.mods.list(query);
  }

  @Get(":slug")
  findBySlug(@Param("slug") slug: string) {
    return this.mods.findBySlug(slug);
  }

  @UseGuards(JwtAuthGuard)
  @Post()
  create(@Body() dto: CreateModDto, @CurrentUser() user: AuthUser) {
    return this.mods.create(dto, user);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(":id")
  update(
    @Param("id") id: string,
    @Body() dto: UpdateModDto,
    @CurrentUser() user: AuthUser,
  ) {
    return this.mods.update(id, dto, user);
  }

  @UseGuards(JwtAuthGuard)
  @Post(":id/versions")
  addVersion(
    @Param("id") id: string,
    @Body() dto: CreateVersionDto,
    @CurrentUser() user: AuthUser,
  ) {
    return this.mods.addVersion(id, dto, user);
  }

  @UseGuards(JwtAuthGuard)
  @Post(":id/publish")
  publish(@Param("id") id: string, @CurrentUser() user: AuthUser) {
    return this.mods.publish(id, user);
  }

  @UseGuards(OptionalJwtAuthGuard)
  @Get(":id/download")
  download(
    @Param("id") id: string,
    @CurrentUser() user: AuthUser | undefined,
    @Req() req: Request,
  ) {
    const ip = req.ip ?? req.headers["x-forwarded-for"]?.toString();
    return this.mods.download(id, user, ip);
  }

  @Get(":id/ratings")
  getRatings(@Param("id") id: string) {
    return this.mods.getRatings(id);
  }

  @UseGuards(JwtAuthGuard)
  @Post(":id/ratings")
  rate(
    @Param("id") id: string,
    @Body() dto: RateModDto,
    @CurrentUser() user: AuthUser,
  ) {
    return this.mods.rate(id, dto, user);
  }

  @Get(":id/comments")
  listComments(@Param("id") id: string, @Query() query: ListCommentsQueryDto) {
    return this.mods.listComments(id, query);
  }

  @UseGuards(JwtAuthGuard)
  @Throttle({ default: { limit: 30, ttl: 60000 } })
  @Post(":id/comments")
  createComment(
    @Param("id") id: string,
    @Body() dto: CreateCommentDto,
    @CurrentUser() user: AuthUser,
  ) {
    return this.mods.createComment(id, dto, user);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(":id/comments/:commentId")
  deleteComment(
    @Param("id") id: string,
    @Param("commentId") commentId: string,
    @CurrentUser() user: AuthUser,
  ) {
    return this.mods.deleteComment(id, commentId, user);
  }
}
