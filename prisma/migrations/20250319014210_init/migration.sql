/*
  Warnings:

  - Added the required column `userId` to the `pembukaanRekening` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "pembukaanRekening" ADD COLUMN     "userId" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "pembukaanRekening" ADD CONSTRAINT "pembukaanRekening_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
