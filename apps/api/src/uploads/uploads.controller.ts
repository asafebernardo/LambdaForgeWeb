import { Body, Controller, Post, UseGuards } from "@nestjs/common";
import { Throttle } from "@nestjs/throttler";
import { UploadsService } from "./uploads.service";
import { PresignUploadDto } from "./dto/presign.dto";
import { JwtAuthGuard } from "../common/guards/jwt-auth.guard";
import { CurrentUser, AuthUser } from "../common/decorators/current-user.decorator";

@Controller("uploads")
export class UploadsController {
  constructor(private uploads: UploadsService) {}

  @UseGuards(JwtAuthGuard)
  @Throttle({ upload: { limit: 20, ttl: 60000 } })
  @Post("presign")
  presign(@Body() dto: PresignUploadDto, @CurrentUser() user: AuthUser) {
    return this.uploads.presign(dto, user);
  }
}
