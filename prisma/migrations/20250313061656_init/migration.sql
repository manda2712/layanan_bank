/*
  Warnings:

  - You are about to drop the column `pengajuanNotaId` on the `Monitoring` table. All the data in the column will be lost.
  - You are about to drop the `pengajuanNota` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `pengembalianPnbpId` to the `Monitoring` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Monitoring" DROP CONSTRAINT "Monitoring_pengajuanNotaId_fkey";

-- AlterTable
ALTER TABLE "Monitoring" DROP COLUMN "pengajuanNotaId",
ADD COLUMN     "pengembalianPnbpId" INTEGER NOT NULL;

-- DropTable
DROP TABLE "pengajuanNota";

-- CreateTable
CREATE TABLE "pengembalianPnbp" (
    "id" SERIAL NOT NULL,
    "pihakMengajukan" "PihakPengajuan" NOT NULL,
    "kodeSatker" INTEGER NOT NULL,
    "noTelpon" TEXT NOT NULL,
    "unggahDokumen" TEXT NOT NULL,

    CONSTRAINT "pengembalianPnbp_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Monitoring" ADD CONSTRAINT "Monitoring_pengembalianPnbpId_fkey" FOREIGN KEY ("pengembalianPnbpId") REFERENCES "pengembalianPnbp"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
