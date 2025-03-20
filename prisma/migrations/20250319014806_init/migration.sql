/*
  Warnings:

  - You are about to drop the column `jenisKelamin` on the `user` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[email]` on the table `user` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "user_namaLengkap_key";

-- AlterTable
ALTER TABLE "user" DROP COLUMN "jenisKelamin";

-- DropEnum
DROP TYPE "JK";

-- CreateIndex
CREATE UNIQUE INDEX "user_email_key" ON "user"("email");
