-- DropForeignKey
ALTER TABLE "monitoringKoreksiPenerimaan" DROP CONSTRAINT "monitoringKoreksiPenerimaan_koreksiPenerimaanId_fkey";

-- DropForeignKey
ALTER TABLE "monitoringLaporanRekening" DROP CONSTRAINT "monitoringLaporanRekening_laporanRekeningId_fkey";

-- DropForeignKey
ALTER TABLE "monitoringPembukaanRekening" DROP CONSTRAINT "monitoringPembukaanRekening_pembukaanRekeningId_fkey";

-- DropForeignKey
ALTER TABLE "monitoringPenerbitanBukti" DROP CONSTRAINT "monitoringPenerbitanBukti_penerbitanBuktiId_fkey";

-- DropForeignKey
ALTER TABLE "monitoringPenerbitanNota" DROP CONSTRAINT "monitoringPenerbitanNota_penerbitanNotaId_fkey";

-- DropForeignKey
ALTER TABLE "monitoringPengajuanVoid" DROP CONSTRAINT "monitoringPengajuanVoid_pengajuanVoidId_fkey";

-- DropForeignKey
ALTER TABLE "monitoringPengembalianPfk" DROP CONSTRAINT "monitoringPengembalianPfk_pengembalianPfkId_fkey";

-- DropForeignKey
ALTER TABLE "monitoringPengembalianPnbp" DROP CONSTRAINT "monitoringPengembalianPnbp_pengembalianPnbpId_fkey";

-- DropForeignKey
ALTER TABLE "monitoringReturSp2d" DROP CONSTRAINT "monitoringReturSp2d_returSp2dId_fkey";

-- AddForeignKey
ALTER TABLE "monitoringReturSp2d" ADD CONSTRAINT "monitoringReturSp2d_returSp2dId_fkey" FOREIGN KEY ("returSp2dId") REFERENCES "returSp2d"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "monitoringPenerbitanBukti" ADD CONSTRAINT "monitoringPenerbitanBukti_penerbitanBuktiId_fkey" FOREIGN KEY ("penerbitanBuktiId") REFERENCES "penerbitanBukti"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "monitoringPenerbitanNota" ADD CONSTRAINT "monitoringPenerbitanNota_penerbitanNotaId_fkey" FOREIGN KEY ("penerbitanNotaId") REFERENCES "penerbitanNota"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "monitoringPengembalianPnbp" ADD CONSTRAINT "monitoringPengembalianPnbp_pengembalianPnbpId_fkey" FOREIGN KEY ("pengembalianPnbpId") REFERENCES "pengembalianPnbp"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "monitoringKoreksiPenerimaan" ADD CONSTRAINT "monitoringKoreksiPenerimaan_koreksiPenerimaanId_fkey" FOREIGN KEY ("koreksiPenerimaanId") REFERENCES "koreksiPenerimaan"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "monitoringPengajuanVoid" ADD CONSTRAINT "monitoringPengajuanVoid_pengajuanVoidId_fkey" FOREIGN KEY ("pengajuanVoidId") REFERENCES "pengajuanVoid"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "monitoringPembukaanRekening" ADD CONSTRAINT "monitoringPembukaanRekening_pembukaanRekeningId_fkey" FOREIGN KEY ("pembukaanRekeningId") REFERENCES "pembukaanRekening"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "monitoringLaporanRekening" ADD CONSTRAINT "monitoringLaporanRekening_laporanRekeningId_fkey" FOREIGN KEY ("laporanRekeningId") REFERENCES "laporanRekening"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "monitoringPengembalianPfk" ADD CONSTRAINT "monitoringPengembalianPfk_pengembalianPfkId_fkey" FOREIGN KEY ("pengembalianPfkId") REFERENCES "pengembalianPfk"("id") ON DELETE CASCADE ON UPDATE CASCADE;
