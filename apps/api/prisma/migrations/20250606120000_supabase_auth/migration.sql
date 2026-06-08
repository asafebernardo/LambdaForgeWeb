-- AlterTable: Supabase auth — link local User to auth.users, optional passwordHash
ALTER TABLE "User" ADD COLUMN IF NOT EXISTS "supabaseId" TEXT;
CREATE UNIQUE INDEX IF NOT EXISTS "User_supabaseId_key" ON "User"("supabaseId");
ALTER TABLE "User" ALTER COLUMN "passwordHash" DROP NOT NULL;
