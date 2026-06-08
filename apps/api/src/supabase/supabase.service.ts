import { Global, Injectable, Logger, OnModuleInit } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { createClient, SupabaseClient } from "@supabase/supabase-js";

@Injectable()
export class SupabaseService implements OnModuleInit {
  private readonly logger = new Logger(SupabaseService.name);
  private admin!: SupabaseClient;
  private configured = false;

  constructor(private config: ConfigService) {}

  onModuleInit() {
    const url = this.config.get<string>("SUPABASE_URL");
    const serviceKey = this.config.get<string>("SUPABASE_SERVICE_ROLE_KEY");
    if (!url || !serviceKey) {
      this.logger.warn(
        "SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY missing — auth validation disabled",
      );
      return;
    }

    this.admin = createClient(url, serviceKey, {
      auth: { autoRefreshToken: false, persistSession: false },
    });
    this.configured = true;
    this.logger.log("Supabase admin client ready");
  }

  isConfigured() {
    return this.configured;
  }

  getAdmin(): SupabaseClient {
    if (!this.configured) {
      throw new Error("Supabase is not configured");
    }
    return this.admin;
  }

  /** Verify a Supabase access token (JWT) and return the auth user. */
  async getUserFromToken(accessToken: string) {
    const { data, error } = await this.admin.auth.getUser(accessToken);
    if (error || !data.user) {
      return null;
    }
    return data.user;
  }

  storage(): SupabaseClient["storage"] {
    return this.getAdmin().storage;
  }

  storageBucket() {
    return this.config.get("SUPABASE_STORAGE_BUCKET", "mods");
  }

  useSupabaseStorage() {
    return (
      this.configured &&
      this.config.get("STORAGE_DRIVER", "supabase") === "supabase"
    );
  }
}
