import { Global, Module, OnModuleInit } from "@nestjs/common";
import { StorageService } from "./storage.service";

@Global()
@Module({
  providers: [StorageService],
  exports: [StorageService],
})
export class StorageModule implements OnModuleInit {
  constructor(private storage: StorageService) {}

  async onModuleInit() {
    await this.storage.ensureBucket();
  }
}
