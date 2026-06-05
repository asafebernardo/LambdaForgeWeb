import { BadRequestException, Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { randomUUID } from "crypto";
import { extname } from "path";
import { StorageService } from "../storage/storage.service";
import { PresignUploadDto, UploadPurpose } from "./dto/presign.dto";
import { AuthUser } from "../common/decorators/current-user.decorator";

const ALLOWED: Record<UploadPurpose, { mimes: string[]; maxBytes: number }> = {
  [UploadPurpose.MOD_FILE]: {
    mimes: [
      "application/zip",
      "application/x-zip-compressed",
      "application/java-archive",
      "application/octet-stream",
    ],
    maxBytes: 524288000,
  },
  [UploadPurpose.SCREENSHOT]: {
    mimes: ["image/jpeg", "image/png", "image/webp", "image/gif"],
    maxBytes: 10_485_760,
  },
  [UploadPurpose.AVATAR]: {
    mimes: ["image/jpeg", "image/png", "image/webp"],
    maxBytes: 2_097_152,
  },
};

const ALLOWED_EXT: Record<UploadPurpose, string[]> = {
  [UploadPurpose.MOD_FILE]: [".zip", ".jar"],
  [UploadPurpose.SCREENSHOT]: [".jpg", ".jpeg", ".png", ".webp", ".gif"],
  [UploadPurpose.AVATAR]: [".jpg", ".jpeg", ".png", ".webp"],
};

@Injectable()
export class UploadsService {
  constructor(
    private storage: StorageService,
    private config: ConfigService,
  ) {}

  async presign(dto: PresignUploadDto, user: AuthUser) {
    const rules = ALLOWED[dto.purpose];
    const ext = extname(dto.filename).toLowerCase();
    if (!ALLOWED_EXT[dto.purpose].includes(ext)) {
      throw new BadRequestException(`File extension ${ext} not allowed`);
    }
    if (!rules.mimes.includes(dto.contentType)) {
      throw new BadRequestException("Content type not allowed");
    }
    if (dto.sizeBytes && dto.sizeBytes > rules.maxBytes) {
      throw new BadRequestException("File too large");
    }

    const prefix =
      dto.purpose === UploadPurpose.MOD_FILE
        ? `mods/${user.id}`
        : dto.purpose === UploadPurpose.SCREENSHOT
          ? `screenshots/${user.id}`
          : `avatars/${user.id}`;

    const key = `${prefix}/${randomUUID()}${ext}`;
    const { url } = await this.storage.presignUpload(key, dto.contentType);

    return {
      uploadUrl: url,
      storageKey: key,
      publicUrl: this.storage.publicUrl(key),
    };
  }
}
