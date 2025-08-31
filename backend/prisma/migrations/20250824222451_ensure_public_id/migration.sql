/*
  Warnings:

  - A unique constraint covering the columns `[publicId]` on the table `Family` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Family" ADD COLUMN "publicId" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "Family_publicId_key" ON "Family"("publicId");
