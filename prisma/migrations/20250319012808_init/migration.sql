/*
  Warnings:

  - You are about to drop the column `catatan` on the `monitoringKoreksiPenerimaan` table. All the data in the column will be lost.
  - You are about to drop the column `catatan` on the `monitoringLaporanRekening` table. All the data in the column will be lost.
  - You are about to drop the column `catatan` on the `monitoringPembukaanRekening` table. All the data in the column will be lost.
  - You are about to drop the column `catatan` on the `monitoringPenerbitanBukti` table. All the data in the column will be lost.
  - You are about to drop the column `catatan` on the `monitoringPenerbitanNota` table. All the data in the column will be lost.
  - You are about to drop the column `catatan` on the `monitoringPengajuanVoid` table. All the data in the column will be lost.
  - You are about to drop the column `catatan` on the `monitoringPengembalianPfk` table. All the data in the column will be lost.
  - You are about to drop the column `catatan` on the `monitoringPengembalianPnbp` table. All the data in the column will be lost.
  - You are about to drop the column `catatan` on the `monitoringReturSp2d` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "monitoringKoreksiPenerimaan_koreksiPenerimaanId_key";

-- DropIndex
DROP INDEX "monitoringLaporanRekening_laporanRekeningId_key";

-- DropIndex
DROP INDEX "monitoringPembukaanRekening_pembukaanRekeningId_key";

-- DropIndex
DROP INDEX "monitoringPenerbitanBukti_penerbitanBuktiId_key";

-- DropIndex
DROP INDEX "monitoringPenerbitanNota_penerbitanNotaId_key";

-- DropIndex
DROP INDEX "monitoringPengajuanVoid_pengajuanVoidId_key";

-- DropIndex
DROP INDEX "monitoringPengembalianPfk_pengembalianPfkId_key";

-- DropIndex
DROP INDEX "monitoringPengembalianPnbp_pengembalianPnbpId_key";

-- DropIndex
DROP INDEX "monitoringReturSp2d_returSp2dId_key";

-- AlterTable
ALTER TABLE "monitoringKoreksiPenerimaan" DROP COLUMN "catatan";

-- AlterTable
ALTER TABLE "monitoringLaporanRekening" DROP COLUMN "catatan";

-- AlterTable
ALTER TABLE "monitoringPembukaanRekening" DROP COLUMN "catatan";

-- AlterTable
ALTER TABLE "monitoringPenerbitanBukti" DROP COLUMN "catatan";

-- AlterTable
ALTER TABLE "monitoringPenerbitanNota" DROP COLUMN "catatan";

-- AlterTable
ALTER TABLE "monitoringPengajuanVoid" DROP COLUMN "catatan";

-- AlterTable
ALTER TABLE "monitoringPengembalianPfk" DROP COLUMN "catatan";

-- AlterTable
ALTER TABLE "monitoringPengembalianPnbp" DROP COLUMN "catatan";

-- AlterTable
ALTER TABLE "monitoringReturSp2d" DROP COLUMN "catatan";
