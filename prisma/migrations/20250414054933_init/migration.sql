/*
  Warnings:

  - You are about to drop the column `tahunSteoran` on the `koreksiPenerimaan` table. All the data in the column will be lost.
  - You are about to drop the column `unggahDokumem` on the `koreksiPenerimaan` table. All the data in the column will be lost.
  - You are about to drop the column `tahunSteoran` on the `penerbitanNota` table. All the data in the column will be lost.
  - Added the required column `tahunSetoran` to the `koreksiPenerimaan` table without a default value. This is not possible if the table is not empty.
  - Added the required column `unggahDokumen` to the `koreksiPenerimaan` table without a default value. This is not possible if the table is not empty.
  - Added the required column `tahunSetoran` to the `penerbitanNota` table without a default value. This is not possible if the table is not empty.

*/
-- AlterEnum
ALTER TYPE "Tahun" ADD VALUE 'LAINNYA';

-- AlterTable
ALTER TABLE "koreksiPenerimaan" DROP COLUMN "tahunSteoran",
DROP COLUMN "unggahDokumem",
ADD COLUMN     "tahunLainnya" TEXT,
ADD COLUMN     "tahunSetoran" "Tahun" NOT NULL,
ADD COLUMN     "unggahDokumen" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "penerbitanNota" DROP COLUMN "tahunSteoran",
ADD COLUMN     "tahunLainnya" TEXT,
ADD COLUMN     "tahunSetoran" "Tahun" NOT NULL;
