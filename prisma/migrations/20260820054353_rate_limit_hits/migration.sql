/*
  Warnings:

  - You are about to drop the `registration_attempts` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE "registration_attempts";

-- CreateTable
CREATE TABLE "rate_limit_hits" (
    "id" TEXT NOT NULL,
    "key" TEXT NOT NULL,
    "kind" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "rate_limit_hits_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "rate_limit_hits_key_kind_createdAt_idx" ON "rate_limit_hits"("key", "kind", "createdAt");
