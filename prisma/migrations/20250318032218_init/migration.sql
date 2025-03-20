/*
  Warnings:

  - You are about to drop the `Monitoring` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `userId` to the `koreksiPenerimaan` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userId` to the `laporanRekening` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userId` to the `pembukaanRekening` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userId` to the `penerbitanBukti` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userId` to the `penerbitanNota` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userId` to the `pengajuanVoid` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userId` to the `pengembalianPfk` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userId` to the `pengembalianPnbp` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userId` to the `returSp2d` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Monitoring" DROP CONSTRAINT "Monitoring_koreksiPenerimaanId_fkey";

-- DropForeignKey
ALTER TABLE "Monitoring" DROP CONSTRAINT "Monitoring_laporanRekeningId_fkey";

-- DropForeignKey
ALTER TABLE "Monitoring" DROP CONSTRAINT "Monitoring_pembukaanRekeningId_fkey";

-- DropForeignKey
ALTER TABLE "Monitoring" DROP CONSTRAINT "Monitoring_penerbitanBuktiId_fkey";

-- DropForeignKey
ALTER TABLE "Monitoring" DROP CONSTRAINT "Monitoring_penerbitanNotaId_fkey";

-- DropForeignKey
ALTER TABLE "Monitoring" DROP CONSTRAINT "Monitoring_pengajuanVoidId_fkey";

-- DropForeignKey
ALTER TABLE "Monitoring" DROP CONSTRAINT "Monitoring_pengembalianPfkId_fkey";

-- DropForeignKey
ALTER TABLE "Monitoring" DROP CONSTRAINT "Monitoring_pengembalianPnbpId_fkey";

-- DropForeignKey
ALTER TABLE "Monitoring" DROP CONSTRAINT "Monitoring_returSp2dId_fkey";

-- DropForeignKey
ALTER TABLE "Monitoring" DROP CONSTRAINT "Monitoring_userId_fkey";

-- AlterTable
ALTER TABLE "koreksiPenerimaan" ADD COLUMN     "userId" INTEGER NOT NULL,
ALTER COLUMN "kodeSatker" SET DATA TYPE TEXT;

-- AlterTable
ALTER TABLE "laporanRekening" ADD COLUMN     "userId" INTEGER NOT NULL,
ALTER COLUMN "kodeSatker" SET DATA TYPE TEXT;

-- AlterTable
ALTER TABLE "pembukaanRekening" ADD COLUMN     "userId" INTEGER NOT NULL,
ALTER COLUMN "kodeSatker" SET DATA TYPE TEXT;

-- AlterTable
ALTER TABLE "penerbitanBukti" ADD COLUMN     "userId" INTEGER NOT NULL,
ALTER COLUMN "kodeSatker" SET DATA TYPE TEXT;

-- AlterTable
ALTER TABLE "penerbitanNota" ADD COLUMN     "userId" INTEGER NOT NULL,
ALTER COLUMN "kodeSatker" SET DATA TYPE TEXT;

-- AlterTable
ALTER TABLE "pengajuanVoid" ADD COLUMN     "userId" INTEGER NOT NULL,
ALTER COLUMN "kodeSatker" SET DATA TYPE TEXT;

-- AlterTable
ALTER TABLE "pengembalianPfk" ADD COLUMN     "userId" INTEGER NOT NULL,
ALTER COLUMN "kodeSatker" SET DATA TYPE TEXT;

-- AlterTable
ALTER TABLE "pengembalianPnbp" ADD COLUMN     "userId" INTEGER NOT NULL,
ALTER COLUMN "kodeSatker" SET DATA TYPE TEXT;

-- AlterTable
ALTER TABLE "returSp2d" ADD COLUMN     "userId" INTEGER NOT NULL,
ALTER COLUMN "kodeSatker" SET DATA TYPE TEXT;

-- DropTable
DROP TABLE "Monitoring";

-- CreateTable
CREATE TABLE "monitoringReturSp2d" (
    "id" SERIAL NOT NULL,
    "returSp2dId" INTEGER NOT NULL,
    "status" "StatusMonitoring" NOT NULL,
    "catatan" TEXT,

    CONSTRAINT "monitoringReturSp2d_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "monitoringPenerbitanBukti" (
    "id" SERIAL NOT NULL,
    "penerbitanBuktiId" INTEGER NOT NULL,
    "status" "StatusMonitoring" NOT NULL,
    "catatan" TEXT,

    CONSTRAINT "monitoringPenerbitanBukti_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "monitoringPenerbitanNota" (
    "id" SERIAL NOT NULL,
    "penerbitanNotaId" INTEGER NOT NULL,
    "status" "StatusMonitoring" NOT NULL,
    "catatan" TEXT,

    CONSTRAINT "monitoringPenerbitanNota_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "monitoringPengembalianPnbp" (
    "id" SERIAL NOT NULL,
    "pengembalianPnbpId" INTEGER NOT NULL,
    "status" "StatusMonitoring" NOT NULL,
    "catatan" TEXT,

    CONSTRAINT "monitoringPengembalianPnbp_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "monitoringKoreksiPenerimaan" (
    "id" SERIAL NOT NULL,
    "koreksiPenerimaanId" INTEGER NOT NULL,
    "status" "StatusMonitoring" NOT NULL,
    "catatan" TEXT,

    CONSTRAINT "monitoringKoreksiPenerimaan_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "monitoringPengajuanVoid" (
    "id" SERIAL NOT NULL,
    "pengajuanVoidId" INTEGER NOT NULL,
    "status" "StatusMonitoring" NOT NULL,
    "catatan" TEXT,

    CONSTRAINT "monitoringPengajuanVoid_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "monitoringPembukaanRekening" (
    "id" SERIAL NOT NULL,
    "pembukaanRekeningId" INTEGER NOT NULL,
    "status" "StatusMonitoring" NOT NULL,
    "catatan" TEXT,

    CONSTRAINT "monitoringPembukaanRekening_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "monitoringLaporanRekening" (
    "id" SERIAL NOT NULL,
    "laporanRekeningId" INTEGER NOT NULL,
    "status" "StatusMonitoring" NOT NULL,
    "catatan" TEXT,

    CONSTRAINT "monitoringLaporanRekening_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "monitoringPengembalianPfk" (
    "id" SERIAL NOT NULL,
    "pengembalianPfkId" INTEGER NOT NULL,
    "status" "StatusMonitoring" NOT NULL,
    "catatan" TEXT,

    CONSTRAINT "monitoringPengembalianPfk_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "monitoringReturSp2d_returSp2dId_key" ON "monitoringReturSp2d"("returSp2dId");

-- CreateIndex
CREATE UNIQUE INDEX "monitoringPenerbitanBukti_penerbitanBuktiId_key" ON "monitoringPenerbitanBukti"("penerbitanBuktiId");

-- CreateIndex
CREATE UNIQUE INDEX "monitoringPenerbitanNota_penerbitanNotaId_key" ON "monitoringPenerbitanNota"("penerbitanNotaId");

-- CreateIndex
CREATE UNIQUE INDEX "monitoringPengembalianPnbp_pengembalianPnbpId_key" ON "monitoringPengembalianPnbp"("pengembalianPnbpId");

-- CreateIndex
CREATE UNIQUE INDEX "monitoringKoreksiPenerimaan_koreksiPenerimaanId_key" ON "monitoringKoreksiPenerimaan"("koreksiPenerimaanId");

-- CreateIndex
CREATE UNIQUE INDEX "monitoringPengajuanVoid_pengajuanVoidId_key" ON "monitoringPengajuanVoid"("pengajuanVoidId");

-- CreateIndex
CREATE UNIQUE INDEX "monitoringPembukaanRekening_pembukaanRekeningId_key" ON "monitoringPembukaanRekening"("pembukaanRekeningId");

-- CreateIndex
CREATE UNIQUE INDEX "monitoringLaporanRekening_laporanRekeningId_key" ON "monitoringLaporanRekening"("laporanRekeningId");

-- CreateIndex
CREATE UNIQUE INDEX "monitoringPengembalianPfk_pengembalianPfkId_key" ON "monitoringPengembalianPfk"("pengembalianPfkId");

-- AddForeignKey
ALTER TABLE "returSp2d" ADD CONSTRAINT "returSp2d_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "monitoringReturSp2d" ADD CONSTRAINT "monitoringReturSp2d_returSp2dId_fkey" FOREIGN KEY ("returSp2dId") REFERENCES "returSp2d"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "penerbitanBukti" ADD CONSTRAINT "penerbitanBukti_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "monitoringPenerbitanBukti" ADD CONSTRAINT "monitoringPenerbitanBukti_penerbitanBuktiId_fkey" FOREIGN KEY ("penerbitanBuktiId") REFERENCES "penerbitanBukti"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "penerbitanNota" ADD CONSTRAINT "penerbitanNota_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "monitoringPenerbitanNota" ADD CONSTRAINT "monitoringPenerbitanNota_penerbitanNotaId_fkey" FOREIGN KEY ("penerbitanNotaId") REFERENCES "penerbitanNota"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "pengembalianPnbp" ADD CONSTRAINT "pengembalianPnbp_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "monitoringPengembalianPnbp" ADD CONSTRAINT "monitoringPengembalianPnbp_pengembalianPnbpId_fkey" FOREIGN KEY ("pengembalianPnbpId") REFERENCES "pengembalianPnbp"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "koreksiPenerimaan" ADD CONSTRAINT "koreksiPenerimaan_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "monitoringKoreksiPenerimaan" ADD CONSTRAINT "monitoringKoreksiPenerimaan_koreksiPenerimaanId_fkey" FOREIGN KEY ("koreksiPenerimaanId") REFERENCES "koreksiPenerimaan"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "pengajuanVoid" ADD CONSTRAINT "pengajuanVoid_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "monitoringPengajuanVoid" ADD CONSTRAINT "monitoringPengajuanVoid_pengajuanVoidId_fkey" FOREIGN KEY ("pengajuanVoidId") REFERENCES "pengajuanVoid"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "pembukaanRekening" ADD CONSTRAINT "pembukaanRekening_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "monitoringPembukaanRekening" ADD CONSTRAINT "monitoringPembukaanRekening_pembukaanRekeningId_fkey" FOREIGN KEY ("pembukaanRekeningId") REFERENCES "pembukaanRekening"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "laporanRekening" ADD CONSTRAINT "laporanRekening_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "monitoringLaporanRekening" ADD CONSTRAINT "monitoringLaporanRekening_laporanRekeningId_fkey" FOREIGN KEY ("laporanRekeningId") REFERENCES "laporanRekening"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "pengembalianPfk" ADD CONSTRAINT "pengembalianPfk_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "monitoringPengembalianPfk" ADD CONSTRAINT "monitoringPengembalianPfk_pengembalianPfkId_fkey" FOREIGN KEY ("pengembalianPfkId") REFERENCES "pengembalianPfk"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
