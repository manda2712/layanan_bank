/*
  Warnings:

  - You are about to drop the column `extractedTexts` on the `penerbitanBukti` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "penerbitanBukti" DROP COLUMN "extractedTexts",
ADD COLUMN     "extractedText" TEXT;
