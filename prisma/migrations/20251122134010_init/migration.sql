-- CreateEnum
CREATE TYPE "Role" AS ENUM ('admin', 'user');

-- CreateEnum
CREATE TYPE "Retur" AS ENUM ('REKENING_TIDAK_AKTIF', 'REKENING_PASIF', 'NOMOR_REKENING_SALAH', 'LAINNYA');

-- CreateEnum
CREATE TYPE "Pengajuan" AS ENUM ('REKENING_TIDAK_AKTIF', 'REKENING_PASIF', 'NOMOR_REKENING_SALAH', 'LAINNYA');

-- CreateEnum
CREATE TYPE "Tahun" AS ENUM ('T2025', 'T2024', 'LAINNYA');

-- CreateEnum
CREATE TYPE "Laporan" AS ENUM ('LAPORAN_PEMBUKAAN_REKENING', 'LAPORAN_PENTUPUAN_REKENING');

-- CreateEnum
CREATE TYPE "PihakPengajuan" AS ENUM ('satuan_kerja', 'pemerintah_daerah');

-- CreateEnum
CREATE TYPE "StatusMonitoring" AS ENUM ('DIPROSES', 'SELESAI', 'DITOLAK', 'MENUNGGU_VALIDASI_ADMIN');

-- CreateTable
CREATE TABLE "user" (
    "id" SERIAL NOT NULL,
    "namaLengkap" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "noTelepon" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "role" "Role" NOT NULL,

    CONSTRAINT "user_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "returSp2d" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "satkerId" INTEGER NOT NULL,
    "noTelpon" TEXT NOT NULL,
    "alasanRetur" "Retur" NOT NULL,
    "alasanLainnya" TEXT,
    "unggah_dokumen" TEXT NOT NULL,
    "extractedText" TEXT,
    "rbsResult" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "returSp2d_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "monitoringReturSp2d" (
    "id" SERIAL NOT NULL,
    "returSp2dId" INTEGER NOT NULL,
    "userId" INTEGER NOT NULL,
    "satkerId" INTEGER NOT NULL,
    "catatan" TEXT,
    "status" "StatusMonitoring" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "rbsStatus" TEXT,

    CONSTRAINT "monitoringReturSp2d_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "penerbitanBukti" (
    "id" SERIAL NOT NULL,
    "noTelpon" TEXT NOT NULL,
    "alasanRetur" "Pengajuan" NOT NULL,
    "alasanLainnya" TEXT,
    "unggah_dokumen" TEXT NOT NULL,
    "userId" INTEGER NOT NULL,
    "satkerId" INTEGER NOT NULL,

    CONSTRAINT "penerbitanBukti_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "monitoringPenerbitanBukti" (
    "id" SERIAL NOT NULL,
    "penerbitanBuktiId" INTEGER NOT NULL,
    "userId" INTEGER NOT NULL,
    "satkerId" INTEGER NOT NULL,
    "status" "StatusMonitoring" NOT NULL,
    "catatan" TEXT,

    CONSTRAINT "monitoringPenerbitanBukti_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "penerbitanNota" (
    "id" SERIAL NOT NULL,
    "noTelpon" TEXT NOT NULL,
    "tahunSetoran" "Tahun" NOT NULL,
    "tahunLainnya" TEXT,
    "unggahDokumen" TEXT NOT NULL,
    "userId" INTEGER NOT NULL,
    "satkerId" INTEGER NOT NULL,

    CONSTRAINT "penerbitanNota_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "monitoringPenerbitanNota" (
    "id" SERIAL NOT NULL,
    "penerbitanNotaId" INTEGER NOT NULL,
    "status" "StatusMonitoring" NOT NULL,
    "catatan" TEXT,
    "userId" INTEGER NOT NULL,
    "satkerId" INTEGER NOT NULL,

    CONSTRAINT "monitoringPenerbitanNota_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "pengembalianPnbp" (
    "id" SERIAL NOT NULL,
    "pihakMengajukan" "PihakPengajuan" NOT NULL,
    "noTelpon" TEXT NOT NULL,
    "unggahDokumen" TEXT NOT NULL,
    "userId" INTEGER NOT NULL,
    "satkerId" INTEGER NOT NULL,

    CONSTRAINT "pengembalianPnbp_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "monitoringPengembalianPnbp" (
    "id" SERIAL NOT NULL,
    "pengembalianPnbpId" INTEGER NOT NULL,
    "status" "StatusMonitoring" NOT NULL,
    "catatan" TEXT,
    "userId" INTEGER NOT NULL,
    "satkerId" INTEGER NOT NULL,

    CONSTRAINT "monitoringPengembalianPnbp_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "koreksiPenerimaan" (
    "id" SERIAL NOT NULL,
    "noTelpon" TEXT NOT NULL,
    "tahunSetoran" "Tahun" NOT NULL,
    "tahunLainnya" TEXT,
    "unggahDokumen" TEXT NOT NULL,
    "userId" INTEGER NOT NULL,
    "satkerId" INTEGER NOT NULL,

    CONSTRAINT "koreksiPenerimaan_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "monitoringKoreksiPenerimaan" (
    "id" SERIAL NOT NULL,
    "koreksiPenerimaanId" INTEGER NOT NULL,
    "status" "StatusMonitoring" NOT NULL,
    "catatan" TEXT,
    "userId" INTEGER NOT NULL,
    "satkerId" INTEGER NOT NULL,

    CONSTRAINT "monitoringKoreksiPenerimaan_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Notification" (
    "id" SERIAL NOT NULL,
    "message" TEXT NOT NULL,
    "userId" INTEGER NOT NULL,
    "monitoringId" INTEGER,
    "monitoringType" TEXT,
    "status" TEXT NOT NULL DEFAULT 'unread',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "targetRole" TEXT,

    CONSTRAINT "Notification_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "pengajuanVoid" (
    "id" SERIAL NOT NULL,
    "noTelpon" TEXT NOT NULL,
    "alasanVoid" TEXT NOT NULL,
    "unggahDokumen" TEXT NOT NULL,
    "userId" INTEGER NOT NULL,
    "satkerId" INTEGER NOT NULL,

    CONSTRAINT "pengajuanVoid_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "monitoringPengajuanVoid" (
    "id" SERIAL NOT NULL,
    "pengajuanVoidId" INTEGER NOT NULL,
    "status" "StatusMonitoring" NOT NULL,
    "catatan" TEXT,
    "userId" INTEGER NOT NULL,
    "satkerId" INTEGER NOT NULL,

    CONSTRAINT "monitoringPengajuanVoid_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "pembukaanRekening" (
    "id" SERIAL NOT NULL,
    "noTelpon" TEXT NOT NULL,
    "jenisRekening" TEXT NOT NULL,
    "unggahDokumen" TEXT NOT NULL,
    "userId" INTEGER NOT NULL,
    "satkerId" INTEGER NOT NULL,

    CONSTRAINT "pembukaanRekening_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "monitoringPembukaanRekening" (
    "id" SERIAL NOT NULL,
    "pembukaanRekeningId" INTEGER NOT NULL,
    "status" "StatusMonitoring" NOT NULL,
    "catatan" TEXT,
    "userId" INTEGER NOT NULL,
    "satkerId" INTEGER NOT NULL,

    CONSTRAINT "monitoringPembukaanRekening_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "laporanRekening" (
    "id" SERIAL NOT NULL,
    "noTelpon" TEXT NOT NULL,
    "jenisLaporan" "Laporan" NOT NULL,
    "unggahDokumen" TEXT NOT NULL,
    "userId" INTEGER NOT NULL,
    "satkerId" INTEGER NOT NULL,

    CONSTRAINT "laporanRekening_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "monitoringLaporanRekening" (
    "id" SERIAL NOT NULL,
    "laporanRekeningId" INTEGER NOT NULL,
    "status" "StatusMonitoring" NOT NULL,
    "catatan" TEXT,
    "userId" INTEGER NOT NULL,
    "satkerId" INTEGER NOT NULL,

    CONSTRAINT "monitoringLaporanRekening_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "pengembalianPfk" (
    "id" SERIAL NOT NULL,
    "pihakMengajukan" "PihakPengajuan" NOT NULL,
    "kodeSatker" TEXT NOT NULL,
    "noTelpon" TEXT NOT NULL,
    "unggahDokumen" TEXT NOT NULL,
    "userId" INTEGER NOT NULL,
    "satkerId" INTEGER NOT NULL,

    CONSTRAINT "pengembalianPfk_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "monitoringPengembalianPfk" (
    "id" SERIAL NOT NULL,
    "pengembalianPfkId" INTEGER NOT NULL,
    "status" "StatusMonitoring" NOT NULL,
    "catatan" TEXT,
    "userId" INTEGER NOT NULL,
    "satkerId" INTEGER NOT NULL,

    CONSTRAINT "monitoringPengembalianPfk_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Satker" (
    "id" SERIAL NOT NULL,
    "namaInstansi" TEXT NOT NULL,
    "kodeSatker" TEXT NOT NULL,

    CONSTRAINT "Satker_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "user_email_key" ON "user"("email");

-- AddForeignKey
ALTER TABLE "returSp2d" ADD CONSTRAINT "returSp2d_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "returSp2d" ADD CONSTRAINT "returSp2d_satkerId_fkey" FOREIGN KEY ("satkerId") REFERENCES "Satker"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "monitoringReturSp2d" ADD CONSTRAINT "monitoringReturSp2d_returSp2dId_fkey" FOREIGN KEY ("returSp2dId") REFERENCES "returSp2d"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "monitoringReturSp2d" ADD CONSTRAINT "monitoringReturSp2d_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "monitoringReturSp2d" ADD CONSTRAINT "monitoringReturSp2d_satkerId_fkey" FOREIGN KEY ("satkerId") REFERENCES "Satker"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "penerbitanBukti" ADD CONSTRAINT "penerbitanBukti_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "monitoringPenerbitanBukti" ADD CONSTRAINT "monitoringPenerbitanBukti_penerbitanBuktiId_fkey" FOREIGN KEY ("penerbitanBuktiId") REFERENCES "penerbitanBukti"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "monitoringPenerbitanBukti" ADD CONSTRAINT "monitoringPenerbitanBukti_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "monitoringPenerbitanBukti" ADD CONSTRAINT "monitoringPenerbitanBukti_satkerId_fkey" FOREIGN KEY ("satkerId") REFERENCES "Satker"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "penerbitanNota" ADD CONSTRAINT "penerbitanNota_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "penerbitanNota" ADD CONSTRAINT "penerbitanNota_satkerId_fkey" FOREIGN KEY ("satkerId") REFERENCES "Satker"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "monitoringPenerbitanNota" ADD CONSTRAINT "monitoringPenerbitanNota_penerbitanNotaId_fkey" FOREIGN KEY ("penerbitanNotaId") REFERENCES "penerbitanNota"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "monitoringPenerbitanNota" ADD CONSTRAINT "monitoringPenerbitanNota_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "monitoringPenerbitanNota" ADD CONSTRAINT "monitoringPenerbitanNota_satkerId_fkey" FOREIGN KEY ("satkerId") REFERENCES "Satker"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "pengembalianPnbp" ADD CONSTRAINT "pengembalianPnbp_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "pengembalianPnbp" ADD CONSTRAINT "pengembalianPnbp_satkerId_fkey" FOREIGN KEY ("satkerId") REFERENCES "Satker"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "monitoringPengembalianPnbp" ADD CONSTRAINT "monitoringPengembalianPnbp_pengembalianPnbpId_fkey" FOREIGN KEY ("pengembalianPnbpId") REFERENCES "pengembalianPnbp"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "monitoringPengembalianPnbp" ADD CONSTRAINT "monitoringPengembalianPnbp_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "monitoringPengembalianPnbp" ADD CONSTRAINT "monitoringPengembalianPnbp_satkerId_fkey" FOREIGN KEY ("satkerId") REFERENCES "Satker"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "koreksiPenerimaan" ADD CONSTRAINT "koreksiPenerimaan_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "koreksiPenerimaan" ADD CONSTRAINT "koreksiPenerimaan_satkerId_fkey" FOREIGN KEY ("satkerId") REFERENCES "Satker"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "monitoringKoreksiPenerimaan" ADD CONSTRAINT "monitoringKoreksiPenerimaan_koreksiPenerimaanId_fkey" FOREIGN KEY ("koreksiPenerimaanId") REFERENCES "koreksiPenerimaan"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "monitoringKoreksiPenerimaan" ADD CONSTRAINT "monitoringKoreksiPenerimaan_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "monitoringKoreksiPenerimaan" ADD CONSTRAINT "monitoringKoreksiPenerimaan_satkerId_fkey" FOREIGN KEY ("satkerId") REFERENCES "Satker"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Notification" ADD CONSTRAINT "Notification_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "pengajuanVoid" ADD CONSTRAINT "pengajuanVoid_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "pengajuanVoid" ADD CONSTRAINT "pengajuanVoid_satkerId_fkey" FOREIGN KEY ("satkerId") REFERENCES "Satker"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "monitoringPengajuanVoid" ADD CONSTRAINT "monitoringPengajuanVoid_pengajuanVoidId_fkey" FOREIGN KEY ("pengajuanVoidId") REFERENCES "pengajuanVoid"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "monitoringPengajuanVoid" ADD CONSTRAINT "monitoringPengajuanVoid_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "monitoringPengajuanVoid" ADD CONSTRAINT "monitoringPengajuanVoid_satkerId_fkey" FOREIGN KEY ("satkerId") REFERENCES "Satker"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "pembukaanRekening" ADD CONSTRAINT "pembukaanRekening_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "pembukaanRekening" ADD CONSTRAINT "pembukaanRekening_satkerId_fkey" FOREIGN KEY ("satkerId") REFERENCES "Satker"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "monitoringPembukaanRekening" ADD CONSTRAINT "monitoringPembukaanRekening_pembukaanRekeningId_fkey" FOREIGN KEY ("pembukaanRekeningId") REFERENCES "pembukaanRekening"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "monitoringPembukaanRekening" ADD CONSTRAINT "monitoringPembukaanRekening_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "monitoringPembukaanRekening" ADD CONSTRAINT "monitoringPembukaanRekening_satkerId_fkey" FOREIGN KEY ("satkerId") REFERENCES "Satker"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "laporanRekening" ADD CONSTRAINT "laporanRekening_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "laporanRekening" ADD CONSTRAINT "laporanRekening_satkerId_fkey" FOREIGN KEY ("satkerId") REFERENCES "Satker"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "monitoringLaporanRekening" ADD CONSTRAINT "monitoringLaporanRekening_laporanRekeningId_fkey" FOREIGN KEY ("laporanRekeningId") REFERENCES "laporanRekening"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "monitoringLaporanRekening" ADD CONSTRAINT "monitoringLaporanRekening_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "monitoringLaporanRekening" ADD CONSTRAINT "monitoringLaporanRekening_satkerId_fkey" FOREIGN KEY ("satkerId") REFERENCES "Satker"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "pengembalianPfk" ADD CONSTRAINT "pengembalianPfk_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "pengembalianPfk" ADD CONSTRAINT "pengembalianPfk_satkerId_fkey" FOREIGN KEY ("satkerId") REFERENCES "Satker"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "monitoringPengembalianPfk" ADD CONSTRAINT "monitoringPengembalianPfk_pengembalianPfkId_fkey" FOREIGN KEY ("pengembalianPfkId") REFERENCES "pengembalianPfk"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "monitoringPengembalianPfk" ADD CONSTRAINT "monitoringPengembalianPfk_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "monitoringPengembalianPfk" ADD CONSTRAINT "monitoringPengembalianPfk_satkerId_fkey" FOREIGN KEY ("satkerId") REFERENCES "Satker"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
