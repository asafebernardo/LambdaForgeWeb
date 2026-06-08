-- CreateEnum
CREATE TYPE "SyncSourceType" AS ENUM ('GAMEBANANA', 'STEAM_WORKSHOP', 'TF2MAPS', 'CUSTOM');

-- CreateEnum
CREATE TYPE "SyncJobType" AS ENUM ('METADATA_SYNC', 'IMAGE_SYNC', 'POPULARITY_UPDATE', 'STALE_REFRESH', 'FULL_GAME_SYNC', 'CATEGORY_ROTATION');

-- CreateEnum
CREATE TYPE "SyncJobStatus" AS ENUM ('PENDING', 'PROCESSING', 'COMPLETED', 'FAILED', 'CANCELLED');

-- CreateTable
CREATE TABLE "SyncSource" (
    "id" TEXT NOT NULL,
    "type" "SyncSourceType" NOT NULL,
    "name" TEXT NOT NULL,
    "baseUrl" TEXT,
    "gameId" TEXT,
    "externalGameId" TEXT,
    "enabled" BOOLEAN NOT NULL DEFAULT true,
    "config" JSONB,
    "lastFullSyncAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SyncSource_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "IndexedAuthor" (
    "id" TEXT NOT NULL,
    "externalId" TEXT,
    "source" "SyncSourceType" NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT,
    "profileUrl" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "IndexedAuthor_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "IndexedMod" (
    "id" TEXT NOT NULL,
    "externalId" TEXT NOT NULL,
    "source" "SyncSourceType" NOT NULL,
    "syncSourceId" TEXT,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "description" TEXT,
    "shortDescription" TEXT,
    "version" TEXT,
    "authorId" TEXT,
    "authorName" TEXT,
    "gameId" TEXT,
    "categoryExternalId" TEXT,
    "categoryName" TEXT,
    "views" INTEGER NOT NULL DEFAULT 0,
    "downloads" INTEGER NOT NULL DEFAULT 0,
    "likes" INTEGER NOT NULL DEFAULT 0,
    "downloadsRecent" INTEGER NOT NULL DEFAULT 0,
    "viewsRecent" INTEGER NOT NULL DEFAULT 0,
    "thumbnailUrl" TEXT,
    "thumbnailCachedKey" TEXT,
    "externalUrl" TEXT,
    "downloadUrl" TEXT,
    "mirrorUrls" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "fileSizeBytes" BIGINT,
    "checksum" TEXT,
    "etag" TEXT,
    "contentHash" TEXT,
    "syncPriority" INTEGER NOT NULL DEFAULT 50,
    "priorityScore" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "failedSyncAttempts" INTEGER NOT NULL DEFAULT 0,
    "externalUpdatedAt" TIMESTAMP(3),
    "lastSyncAt" TIMESTAMP(3),
    "lastSuccessfulSync" TIMESTAMP(3),
    "nextSyncAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "IndexedMod_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "IndexedModImage" (
    "id" TEXT NOT NULL,
    "modId" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "cachedKey" TEXT,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "IndexedModImage_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "IndexedModVersion" (
    "id" TEXT NOT NULL,
    "modId" TEXT NOT NULL,
    "version" TEXT NOT NULL,
    "downloadUrl" TEXT,
    "fileSizeBytes" BIGINT,
    "checksum" TEXT,
    "changelog" TEXT,
    "externalUpdatedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "IndexedModVersion_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "IndexedModTag" (
    "modId" TEXT NOT NULL,
    "tag" TEXT NOT NULL,

    CONSTRAINT "IndexedModTag_pkey" PRIMARY KEY ("modId","tag")
);

-- CreateTable
CREATE TABLE "SyncLog" (
    "id" TEXT NOT NULL,
    "syncSourceId" TEXT,
    "jobType" "SyncJobType" NOT NULL,
    "status" "SyncJobStatus" NOT NULL,
    "message" TEXT,
    "metadata" JSONB,
    "durationMs" INTEGER,
    "rateLimitHit" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "SyncLog_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SyncQueueItem" (
    "id" TEXT NOT NULL,
    "bullJobId" TEXT,
    "jobType" "SyncJobType" NOT NULL,
    "status" "SyncJobStatus" NOT NULL DEFAULT 'PENDING',
    "priority" INTEGER NOT NULL DEFAULT 0,
    "payload" JSONB NOT NULL,
    "attempts" INTEGER NOT NULL DEFAULT 0,
    "maxAttempts" INTEGER NOT NULL DEFAULT 5,
    "lastError" TEXT,
    "scheduledFor" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "startedAt" TIMESTAMP(3),
    "completedAt" TIMESTAMP(3),
    "syncSourceId" TEXT,
    "indexedModId" TEXT,

    CONSTRAINT "SyncQueueItem_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "SyncSource_type_externalGameId_key" ON "SyncSource"("type", "externalGameId");

-- CreateIndex
CREATE INDEX "SyncSource_enabled_idx" ON "SyncSource"("enabled");

-- CreateIndex
CREATE UNIQUE INDEX "IndexedAuthor_source_externalId_key" ON "IndexedAuthor"("source", "externalId");

-- CreateIndex
CREATE INDEX "IndexedAuthor_name_idx" ON "IndexedAuthor"("name");

-- CreateIndex
CREATE UNIQUE INDEX "IndexedMod_slug_key" ON "IndexedMod"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "IndexedMod_source_externalId_key" ON "IndexedMod"("source", "externalId");

-- CreateIndex
CREATE INDEX "IndexedMod_gameId_idx" ON "IndexedMod"("gameId");

-- CreateIndex
CREATE INDEX "IndexedMod_syncPriority_idx" ON "IndexedMod"("syncPriority");

-- CreateIndex
CREATE INDEX "IndexedMod_priorityScore_idx" ON "IndexedMod"("priorityScore");

-- CreateIndex
CREATE INDEX "IndexedMod_nextSyncAt_idx" ON "IndexedMod"("nextSyncAt");

-- CreateIndex
CREATE INDEX "IndexedMod_lastSuccessfulSync_idx" ON "IndexedMod"("lastSuccessfulSync");

-- CreateIndex
CREATE INDEX "IndexedMod_downloads_idx" ON "IndexedMod"("downloads");

-- CreateIndex
CREATE INDEX "IndexedMod_updatedAt_idx" ON "IndexedMod"("updatedAt");

-- CreateIndex
CREATE INDEX "IndexedModImage_modId_idx" ON "IndexedModImage"("modId");

-- CreateIndex
CREATE UNIQUE INDEX "IndexedModVersion_modId_version_key" ON "IndexedModVersion"("modId", "version");

-- CreateIndex
CREATE INDEX "IndexedModTag_tag_idx" ON "IndexedModTag"("tag");

-- CreateIndex
CREATE INDEX "SyncLog_createdAt_idx" ON "SyncLog"("createdAt");

-- CreateIndex
CREATE INDEX "SyncLog_jobType_status_idx" ON "SyncLog"("jobType", "status");

-- CreateIndex
CREATE UNIQUE INDEX "SyncQueueItem_bullJobId_key" ON "SyncQueueItem"("bullJobId");

-- CreateIndex
CREATE INDEX "SyncQueueItem_status_scheduledFor_idx" ON "SyncQueueItem"("status", "scheduledFor");

-- CreateIndex
CREATE INDEX "SyncQueueItem_jobType_status_idx" ON "SyncQueueItem"("jobType", "status");

-- AddForeignKey
ALTER TABLE "SyncSource" ADD CONSTRAINT "SyncSource_gameId_fkey" FOREIGN KEY ("gameId") REFERENCES "Game"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "IndexedMod" ADD CONSTRAINT "IndexedMod_syncSourceId_fkey" FOREIGN KEY ("syncSourceId") REFERENCES "SyncSource"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "IndexedMod" ADD CONSTRAINT "IndexedMod_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "IndexedAuthor"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "IndexedMod" ADD CONSTRAINT "IndexedMod_gameId_fkey" FOREIGN KEY ("gameId") REFERENCES "Game"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "IndexedModImage" ADD CONSTRAINT "IndexedModImage_modId_fkey" FOREIGN KEY ("modId") REFERENCES "IndexedMod"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "IndexedModVersion" ADD CONSTRAINT "IndexedModVersion_modId_fkey" FOREIGN KEY ("modId") REFERENCES "IndexedMod"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "IndexedModTag" ADD CONSTRAINT "IndexedModTag_modId_fkey" FOREIGN KEY ("modId") REFERENCES "IndexedMod"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SyncLog" ADD CONSTRAINT "SyncLog_syncSourceId_fkey" FOREIGN KEY ("syncSourceId") REFERENCES "SyncSource"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SyncQueueItem" ADD CONSTRAINT "SyncQueueItem_syncSourceId_fkey" FOREIGN KEY ("syncSourceId") REFERENCES "SyncSource"("id") ON DELETE SET NULL ON UPDATE CASCADE;
