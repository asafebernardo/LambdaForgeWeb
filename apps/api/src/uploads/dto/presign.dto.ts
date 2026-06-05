import {
  IsEnum,
  IsInt,
  IsOptional,
  IsString,
  Max,
  Min,
} from "class-validator";

export enum UploadPurpose {
  MOD_FILE = "mod_file",
  SCREENSHOT = "screenshot",
  AVATAR = "avatar",
}

export class PresignUploadDto {
  @IsEnum(UploadPurpose)
  purpose!: UploadPurpose;

  @IsString()
  filename!: string;

  @IsString()
  contentType!: string;

  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(524288000)
  sizeBytes?: number;
}
