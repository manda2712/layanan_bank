-- AlterTable
ALTER TABLE "Notification" ADD COLUMN     "monitoringLaporanRekeningId" INTEGER,
ADD COLUMN     "monitoringPembukaanRekeningId" INTEGER,
ADD COLUMN     "monitoringPenerbitanBuktiId" INTEGER,
ADD COLUMN     "monitoringPenerbitanNotaId" INTEGER,
ADD COLUMN     "monitoringPengajuanVoidId" INTEGER,
ADD COLUMN     "monitoringPengembalianPfkId" INTEGER,
ADD COLUMN     "monitoringPengembalianPnbpId" INTEGER,
ADD COLUMN     "monitoringReturSp2dId" INTEGER;

-- AddForeignKey
ALTER TABLE "Notification" ADD CONSTRAINT "Notification_monitoringPenerbitanNotaId_fkey" FOREIGN KEY ("monitoringPenerbitanNotaId") REFERENCES "monitoringPenerbitanNota"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Notification" ADD CONSTRAINT "Notification_monitoringPengembalianPnbpId_fkey" FOREIGN KEY ("monitoringPengembalianPnbpId") REFERENCES "monitoringPengembalianPnbp"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Notification" ADD CONSTRAINT "Notification_monitoringReturSp2dId_fkey" FOREIGN KEY ("monitoringReturSp2dId") REFERENCES "monitoringReturSp2d"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Notification" ADD CONSTRAINT "Notification_monitoringPengajuanVoidId_fkey" FOREIGN KEY ("monitoringPengajuanVoidId") REFERENCES "monitoringPengajuanVoid"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Notification" ADD CONSTRAINT "Notification_monitoringPembukaanRekeningId_fkey" FOREIGN KEY ("monitoringPembukaanRekeningId") REFERENCES "monitoringPembukaanRekening"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Notification" ADD CONSTRAINT "Notification_monitoringLaporanRekeningId_fkey" FOREIGN KEY ("monitoringLaporanRekeningId") REFERENCES "monitoringLaporanRekening"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Notification" ADD CONSTRAINT "Notification_monitoringPengembalianPfkId_fkey" FOREIGN KEY ("monitoringPengembalianPfkId") REFERENCES "monitoringPengembalianPfk"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Notification" ADD CONSTRAINT "Notification_monitoringPenerbitanBuktiId_fkey" FOREIGN KEY ("monitoringPenerbitanBuktiId") REFERENCES "monitoringPenerbitanBukti"("id") ON DELETE SET NULL ON UPDATE CASCADE;
