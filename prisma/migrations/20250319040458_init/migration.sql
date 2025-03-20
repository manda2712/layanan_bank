/*
  Warnings:

  - Added the required column `userId` to the `koreksiPenerimaan` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userId` to the `laporanRekening` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userId` to the `penerbitanBukti` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userId` to the `penerbitanNota` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userId` to the `pengajuanVoid` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userId` to the `pengembalianPfk` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userId` to the `pengembalianPnbp` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userId` to the `returSp2d` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "koreksiPenerimaan" ADD COLUMN     "userId" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "laporanRekening" ADD COLUMN     "userId" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "penerbitanBukti" ADD COLUMN     "userId" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "penerbitanNota" ADD COLUMN     "userId" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "pengajuanVoid" ADD COLUMN     "userId" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "pengembalianPfk" ADD COLUMN     "userId" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "pengembalianPnbp" ADD COLUMN     "userId" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "returSp2d" ADD COLUMN     "userId" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "returSp2d" ADD CONSTRAINT "returSp2d_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "penerbitanBukti" ADD CONSTRAINT "penerbitanBukti_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "penerbitanNota" ADD CONSTRAINT "penerbitanNota_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "pengembalianPnbp" ADD CONSTRAINT "pengembalianPnbp_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "koreksiPenerimaan" ADD CONSTRAINT "koreksiPenerimaan_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "pengajuanVoid" ADD CONSTRAINT "pengajuanVoid_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "laporanRekening" ADD CONSTRAINT "laporanRekening_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "pengembalianPfk" ADD CONSTRAINT "pengembalianPfk_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
