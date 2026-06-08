-- GameBanana category tree: root + subcategory with icons
ALTER TABLE "IndexedMod" ADD COLUMN IF NOT EXISTS "rootCategoryName" TEXT;
ALTER TABLE "IndexedMod" ADD COLUMN IF NOT EXISTS "rootCategoryExternalId" TEXT;
ALTER TABLE "IndexedMod" ADD COLUMN IF NOT EXISTS "rootCategoryIconUrl" TEXT;
ALTER TABLE "IndexedMod" ADD COLUMN IF NOT EXISTS "subCategoryName" TEXT;
ALTER TABLE "IndexedMod" ADD COLUMN IF NOT EXISTS "subCategoryExternalId" TEXT;
ALTER TABLE "IndexedMod" ADD COLUMN IF NOT EXISTS "subCategoryIconUrl" TEXT;
