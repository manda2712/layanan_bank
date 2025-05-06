/*
  Warnings:

  - You are about to drop the column `link` on the `Notification` table. All the data in the column will be lost.
  - You are about to drop the column `monitoringKoreksiPenerimaanId` on the `Notification` table. All the data in the column will be lost.
  - You are about to drop the column `monitoringLaporanRekeningId` on the `Notification` table. All the data in the column will be lost.
  - You are about to drop the column `monitoringPembukaanRekeningId` on the `Notification` table. All the data in the column will be lost.
  - You are about to drop the column `monitoringPenerbitanBuktiId` on the `Notification` table. All the data in the column will be lost.
  - You are about to drop the column `monitoringPenerbitanNotaId` on the `Notification` table. All the data in the column will be lost.
  - You are about to drop the column `monitoringPengajuanVoidId` on the `Notification` table. All the data in the column will be lost.
  - You are about to drop the column `monitoringPengembalianPfkId` on the `Notification` table. All the data in the column will be lost.
  - You are about to drop the column `monitoringPengembalianPnbpId` on the `Notification` table. All the data in the column will be lost.
  - You are about to drop the column `monitoringReturSp2dId` on the `Notification` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Notification" DROP CONSTRAINT "Notification_monitoringKoreksiPenerimaanId_fkey";

-- DropForeignKey
ALTER TABLE "Notification" DROP CONSTRAINT "Notification_monitoringLaporanRekeningId_fkey";

-- DropForeignKey
ALTER TABLE "Notification" DROP CONSTRAINT "Notification_monitoringPembukaanRekeningId_fkey";

-- DropForeignKey
ALTER TABLE "Notification" DROP CONSTRAINT "Notification_monitoringPenerbitanBuktiId_fkey";

-- DropForeignKey
ALTER TABLE "Notification" DROP CONSTRAINT "Notification_monitoringPenerbitanNotaId_fkey";

-- DropForeignKey
ALTER TABLE "Notification" DROP CONSTRAINT "Notification_monitoringPengajuanVoidId_fkey";

-- DropForeignKey
ALTER TABLE "Notification" DROP CONSTRAINT "Notification_monitoringPengembalianPfkId_fkey";

-- DropForeignKey
ALTER TABLE "Notification" DROP CONSTRAINT "Notification_monitoringPengembalianPnbpId_fkey";

-- DropForeignKey
ALTER TABLE "Notification" DROP CONSTRAINT "Notification_monitoringReturSp2dId_fkey";

-- AlterTable
ALTER TABLE "Notification" DROP COLUMN "link",
DROP COLUMN "monitoringKoreksiPenerimaanId",
DROP COLUMN "monitoringLaporanRekeningId",
DROP COLUMN "monitoringPembukaanRekeningId",
DROP COLUMN "monitoringPenerbitanBuktiId",
DROP COLUMN "monitoringPenerbitanNotaId",
DROP COLUMN "monitoringPengajuanVoidId",
DROP COLUMN "monitoringPengembalianPfkId",
DROP COLUMN "monitoringPengembalianPnbpId",
DROP COLUMN "monitoringReturSp2dId",
ADD COLUMN     "monitoringId" INTEGER,
ADD COLUMN     "monitoringType" TEXT;
