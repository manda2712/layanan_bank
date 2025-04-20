-- AlterTable
ALTER TABLE "monitoringKoreksiPenerimaan" ADD COLUMN     "catatan" TEXT;

-- AlterTable
ALTER TABLE "monitoringLaporanRekening" ADD COLUMN     "catatan" TEXT;

-- AlterTable
ALTER TABLE "monitoringPembukaanRekening" ADD COLUMN     "catatan" TEXT;

-- AlterTable
ALTER TABLE "monitoringPenerbitanBukti" ADD COLUMN     "catatan" TEXT;

-- AlterTable
ALTER TABLE "monitoringPenerbitanNota" ADD COLUMN     "catatan" TEXT;

-- AlterTable
ALTER TABLE "monitoringPengajuanVoid" ADD COLUMN     "catatan" TEXT;

-- AlterTable
ALTER TABLE "monitoringPengembalianPfk" ADD COLUMN     "catatan" TEXT;

-- AlterTable
ALTER TABLE "monitoringPengembalianPnbp" ADD COLUMN     "catatan" TEXT;
