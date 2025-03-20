-- CreateEnum
CREATE TYPE "Retur" AS ENUM ('REKENING_TIDAK_AKTIF', 'REKENING_PASIF', 'NOMOR_REKENING_SALAH');

-- CreateEnum
CREATE TYPE "Pengajuan" AS ENUM ('REKENING_TIDAK_AKTIF', 'REKENING_PASIF', 'NOMOR_REKENING_SALAH');

-- CreateEnum
CREATE TYPE "Tahun" AS ENUM ('T2025', 'T2024');

-- CreateEnum
CREATE TYPE "Laporan" AS ENUM ('LAPORAN_PEMBUKAAN_REKENING', 'LAPORAN_PENTUPUAN_REKENING');

-- CreateEnum
CREATE TYPE "PihakPengajuan" AS ENUM ('satuan_kerja', 'pemerintah_daerah');

-- CreateEnum
CREATE TYPE "StatusMonitoring" AS ENUM ('DIPROSES', 'SELESAI', 'DITOLAK');

-- CreateTable
CREATE TABLE "returSp2d" (
    "id" SERIAL NOT NULL,
    "kodeSatker" INTEGER NOT NULL,
    "noTelpon" TEXT NOT NULL,
    "alasanRetur" "Retur" NOT NULL,
    "unggah_dokumen" TEXT NOT NULL,

    CONSTRAINT "returSp2d_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "penerbitanBukti" (
    "id" SERIAL NOT NULL,
    "kodeSatker" INTEGER NOT NULL,
    "noTelpon" TEXT NOT NULL,
    "alasanRetur" "Pengajuan" NOT NULL,
    "unggah_dokumen" TEXT NOT NULL,

    CONSTRAINT "penerbitanBukti_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "penerbitanNota" (
    "id" SERIAL NOT NULL,
    "kodeSatker" INTEGER NOT NULL,
    "noTelpon" TEXT NOT NULL,
    "tahunSteoran" "Tahun" NOT NULL,
    "unggahDokumen" TEXT NOT NULL,

    CONSTRAINT "penerbitanNota_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "pengajuanNota" (
    "id" SERIAL NOT NULL,
    "kodeSatker" INTEGER NOT NULL,
    "noTelpon" TEXT NOT NULL,
    "tahunSteoran" "Tahun" NOT NULL,
    "unggahDokumem" TEXT NOT NULL,

    CONSTRAINT "pengajuanNota_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "koreksiPenerimaan" (
    "id" SERIAL NOT NULL,
    "kodeSatker" INTEGER NOT NULL,
    "noTelpon" TEXT NOT NULL,
    "tahunSteoran" "Tahun" NOT NULL,
    "unggahDokumem" TEXT NOT NULL,

    CONSTRAINT "koreksiPenerimaan_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "pengajuanVoid" (
    "id" SERIAL NOT NULL,
    "kodeSatker" INTEGER NOT NULL,
    "noTelpon" TEXT NOT NULL,
    "alasanVoid" TEXT NOT NULL,
    "unggahDokumen" TEXT NOT NULL,

    CONSTRAINT "pengajuanVoid_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "pembukaanRekening" (
    "id" SERIAL NOT NULL,
    "kodeSatker" INTEGER NOT NULL,
    "noTelpon" TEXT NOT NULL,
    "jenisRekening" TEXT NOT NULL,
    "unggahDokumen" TEXT NOT NULL,

    CONSTRAINT "pembukaanRekening_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "laporanRekening" (
    "id" SERIAL NOT NULL,
    "kodeSatker" INTEGER NOT NULL,
    "noTelpon" TEXT NOT NULL,
    "jenisLaporan" "Laporan" NOT NULL,
    "unggahDokumen" TEXT NOT NULL,

    CONSTRAINT "laporanRekening_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "pengembalianPfk" (
    "id" SERIAL NOT NULL,
    "pihakMengajukan" "PihakPengajuan" NOT NULL,
    "kodeSatker" INTEGER NOT NULL,
    "noTelpon" TEXT NOT NULL,
    "unggahDokumen" TEXT NOT NULL,

    CONSTRAINT "pengembalianPfk_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Monitoring" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "returSp2dId" INTEGER NOT NULL,
    "penerbitanBuktiId" INTEGER NOT NULL,
    "penerbitanNotaId" INTEGER NOT NULL,
    "pengajuanNotaId" INTEGER NOT NULL,
    "koreksiPenerimaanId" INTEGER NOT NULL,
    "pengajuanVoidId" INTEGER NOT NULL,
    "pembukaanRekeningId" INTEGER NOT NULL,
    "laporanRekeningId" INTEGER NOT NULL,
    "pengembalianPfkId" INTEGER NOT NULL,
    "status" "StatusMonitoring" NOT NULL,

    CONSTRAINT "Monitoring_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Monitoring" ADD CONSTRAINT "Monitoring_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Monitoring" ADD CONSTRAINT "Monitoring_returSp2dId_fkey" FOREIGN KEY ("returSp2dId") REFERENCES "returSp2d"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Monitoring" ADD CONSTRAINT "Monitoring_penerbitanBuktiId_fkey" FOREIGN KEY ("penerbitanBuktiId") REFERENCES "penerbitanBukti"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Monitoring" ADD CONSTRAINT "Monitoring_penerbitanNotaId_fkey" FOREIGN KEY ("penerbitanNotaId") REFERENCES "penerbitanNota"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Monitoring" ADD CONSTRAINT "Monitoring_pengajuanNotaId_fkey" FOREIGN KEY ("pengajuanNotaId") REFERENCES "pengajuanNota"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Monitoring" ADD CONSTRAINT "Monitoring_koreksiPenerimaanId_fkey" FOREIGN KEY ("koreksiPenerimaanId") REFERENCES "koreksiPenerimaan"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Monitoring" ADD CONSTRAINT "Monitoring_pengajuanVoidId_fkey" FOREIGN KEY ("pengajuanVoidId") REFERENCES "pengajuanVoid"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Monitoring" ADD CONSTRAINT "Monitoring_pembukaanRekeningId_fkey" FOREIGN KEY ("pembukaanRekeningId") REFERENCES "pembukaanRekening"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Monitoring" ADD CONSTRAINT "Monitoring_laporanRekeningId_fkey" FOREIGN KEY ("laporanRekeningId") REFERENCES "laporanRekening"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Monitoring" ADD CONSTRAINT "Monitoring_pengembalianPfkId_fkey" FOREIGN KEY ("pengembalianPfkId") REFERENCES "pengembalianPfk"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
