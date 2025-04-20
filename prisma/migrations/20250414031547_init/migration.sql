-- AlterEnum
ALTER TYPE "Pengajuan" ADD VALUE 'LAINNYA';

-- AlterTable
ALTER TABLE "penerbitanBukti" ADD COLUMN     "alasanLainnya" TEXT;
