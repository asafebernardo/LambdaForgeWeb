import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import {
  S3Client,
  PutObjectCommand,
  GetObjectCommand,
  HeadBucketCommand,
  CreateBucketCommand,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

@Injectable()
export class StorageService {
  private client: S3Client;
  private bucket: string;

  constructor(private config: ConfigService) {
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

  async ensureBucket() {
    try {
      await this.client.send(new HeadBucketCommand({ Bucket: this.bucket }));
    } catch {
      await this.client.send(new CreateBucketCommand({ Bucket: this.bucket }));
    }
  }

  async presignUpload(key: string, contentType: string, expiresIn = 3600) {
    const command = new PutObjectCommand({
      Bucket: this.bucket,
      Key: key,
      ContentType: contentType,
    });
    const url = await getSignedUrl(this.client, command, { expiresIn });
    return { url, key };
  }

  async presignDownload(key: string, expiresIn = 3600) {
    const command = new GetObjectCommand({
      Bucket: this.bucket,
      Key: key,
    });
    return getSignedUrl(this.client, command, { expiresIn });
  }

  publicUrl(key: string): string {
    const base = this.config.get("S3_PUBLIC_URL", "");
    return `${base}/${key}`;
  }
}
