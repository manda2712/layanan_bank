/*
  Warnings:

  - You are about to drop the column `userId` on the `koreksiPenerimaan` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `laporanRekening` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `pembukaanRekening` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `penerbitanBukti` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `penerbitanNota` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `pengajuanVoid` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `pengembalianPfk` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `pengembalianPnbp` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `returSp2d` table. All the data in the column will be lost.
  - Added the required column `userId` to the `monitoringKoreksiPenerimaan` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userId` to the `monitoringLaporanRekening` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userId` to the `monitoringPembukaanRekening` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userId` to the `monitoringPenerbitanBukti` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userId` to the `monitoringPenerbitanNota` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userId` to the `monitoringPengajuanVoid` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userId` to the `monitoringPengembalianPfk` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userId` to the `monitoringPengembalianPnbp` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userId` to the `monitoringReturSp2d` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "koreksiPenerimaan" DROP CONSTRAINT "koreksiPenerimaan_userId_fkey";

-- DropForeignKey
ALTER TABLE "laporanRekening" DROP CONSTRAINT "laporanRekening_userId_fkey";

-- DropForeignKey
ALTER TABLE "pembukaanRekening" DROP CONSTRAINT "pembukaanRekening_userId_fkey";

-- DropForeignKey
ALTER TABLE "penerbitanBukti" DROP CONSTRAINT "penerbitanBukti_userId_fkey";

-- DropForeignKey
ALTER TABLE "penerbitanNota" DROP CONSTRAINT "penerbitanNota_userId_fkey";

-- DropForeignKey
ALTER TABLE "pengajuanVoid" DROP CONSTRAINT "pengajuanVoid_userId_fkey";

-- DropForeignKey
ALTER TABLE "pengembalianPfk" DROP CONSTRAINT "pengembalianPfk_userId_fkey";

-- DropForeignKey
ALTER TABLE "pengembalianPnbp" DROP CONSTRAINT "pengembalianPnbp_userId_fkey";

-- DropForeignKey
ALTER TABLE "returSp2d" DROP CONSTRAINT "returSp2d_userId_fkey";

-- AlterTable
ALTER TABLE "koreksiPenerimaan" DROP COLUMN "userId";

-- AlterTable
ALTER TABLE "laporanRekening" DROP COLUMN "userId";

-- AlterTable
ALTER TABLE "monitoringKoreksiPenerimaan" ADD COLUMN     "userId" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "monitoringLaporanRekening" ADD COLUMN     "userId" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "monitoringPembukaanRekening" ADD COLUMN     "userId" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "monitoringPenerbitanBukti" ADD COLUMN     "userId" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "monitoringPenerbitanNota" ADD COLUMN     "userId" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "monitoringPengajuanVoid" ADD COLUMN     "userId" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "monitoringPengembalianPfk" ADD COLUMN     "userId" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "monitoringPengembalianPnbp" ADD COLUMN     "userId" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "monitoringReturSp2d" ADD COLUMN     "userId" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "pembukaanRekening" DROP COLUMN "userId";

-- AlterTable
ALTER TABLE "penerbitanBukti" DROP COLUMN "userId";

-- AlterTable
ALTER TABLE "penerbitanNota" DROP COLUMN "userId";

-- AlterTable
ALTER TABLE "pengajuanVoid" DROP COLUMN "userId";

-- AlterTable
ALTER TABLE "pengembalianPfk" DROP COLUMN "userId";

-- AlterTable
ALTER TABLE "pengembalianPnbp" DROP COLUMN "userId";

-- AlterTable
ALTER TABLE "returSp2d" DROP COLUMN "userId";

-- AlterTable
ALTER TABLE "user" ALTER COLUMN "role" DROP DEFAULT;

-- AddForeignKey
ALTER TABLE "monitoringReturSp2d" ADD CONSTRAINT "monitoringReturSp2d_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "monitoringPenerbitanBukti" ADD CONSTRAINT "monitoringPenerbitanBukti_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "monitoringPenerbitanNota" ADD CONSTRAINT "monitoringPenerbitanNota_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "monitoringPengembalianPnbp" ADD CONSTRAINT "monitoringPengembalianPnbp_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "monitoringKoreksiPenerimaan" ADD CONSTRAINT "monitoringKoreksiPenerimaan_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "monitoringPengajuanVoid" ADD CONSTRAINT "monitoringPengajuanVoid_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "monitoringPembukaanRekening" ADD CONSTRAINT "monitoringPembukaanRekening_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "monitoringLaporanRekening" ADD CONSTRAINT "monitoringLaporanRekening_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "monitoringPengembalianPfk" ADD CONSTRAINT "monitoringPengembalianPfk_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
