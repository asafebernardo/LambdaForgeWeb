ALTER TABLE "IndexedMod" ADD COLUMN IF NOT EXISTS "isNsfw" BOOLEAN NOT NULL DEFAULT false;

CREATE INDEX IF NOT EXISTS "IndexedMod_isNsfw_idx" ON "IndexedMod"("isNsfw");
