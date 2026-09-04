-- AlterTable
ALTER TABLE "records" ADD COLUMN     "isbn" TEXT;

-- CreateIndex
CREATE INDEX "records_userId_isbn_idx" ON "records"("userId", "isbn");
