import { Injectable, Logger } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import {
  S3Client,
  PutObjectCommand,
  GetObjectCommand,
  HeadBucketCommand,
  CreateBucketCommand,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { SupabaseService } from "../supabase/supabase.service";

@Injectable()
export class StorageService {
  private readonly logger = new Logger(StorageService.name);
  private client: S3Client;
  private bucket: string;

  constructor(
    private config: ConfigService,
    private supabase: SupabaseService,
  ) {
    this.bucket = config.get("S3_BUCKET", "lambdaforge-mods");
    this.client = new S3Client({
      endpoint: config.get("S3_ENDPOINT", "http://localhost:9000"),
      region: config.get("S3_REGION", "us-east-1"),
      credentials: {
        accessKeyId: config.get("S3_ACCESS_KEY", "minioadmin"),
        secretAccessKey: config.get("S3_SECRET_KEY", "minioadmin"),
      },
      forcePathStyle: true,
    });
  }

  private useSupabase() {
    return this.supabase.useSupabaseStorage();
  }

  async ensureBucket() {
    if (this.useSupabase()) return;

    try {
      await this.client.send(new HeadBucketCommand({ Bucket: this.bucket }));
    } catch {
      try {
        await this.client.send(new CreateBucketCommand({ Bucket: this.bucket }));
      } catch (err) {
        this.logger.warn(
          `MinIO/S3 unavailable at ${this.config.get("S3_ENDPOINT")} — uploads disabled until storage is running`,
        );
        this.logger.debug(String(err));
      }
    }
  }

  async presignUpload(key: string, contentType: string, expiresIn = 3600) {
    if (this.useSupabase()) {
      const bucket = this.supabase.storageBucket();
      const { data, error } = await this.supabase
        .storage()
        .from(bucket)
        .createSignedUploadUrl(key);
      if (error || !data) {
        throw error ?? new Error("Failed to create Supabase upload URL");
      }
      return { url: data.signedUrl, key, token: data.token };
    }

    const command = new PutObjectCommand({
      Bucket: this.bucket,
      Key: key,
      ContentType: contentType,
    });
    const url = await getSignedUrl(this.client, command, { expiresIn });
    return { url, key };
  }

  async presignDownload(key: string, expiresIn = 3600) {
    if (this.useSupabase()) {
      const bucket = this.supabase.storageBucket();
      const { data, error } = await this.supabase
        .storage()
        .from(bucket)
        .createSignedUrl(key, expiresIn);
      if (error || !data) {
        throw error ?? new Error("Failed to create Supabase download URL");
      }
      return data.signedUrl;
    }

    const command = new GetObjectCommand({
      Bucket: this.bucket,
      Key: key,
    });
    return getSignedUrl(this.client, command, { expiresIn });
  }

  publicUrl(key: string): string {
    if (this.useSupabase()) {
      const base = this.config.get("SUPABASE_URL", "").replace(/\/$/, "");
      const bucket = this.supabase.storageBucket();
      return `${base}/storage/v1/object/public/${bucket}/${key}`;
    }

    const base = this.config.get("S3_PUBLIC_URL", "");
    return `${base}/${key}`;
  }
}
