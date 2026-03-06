/*
  Warnings:

  - You are about to drop the column `alasanLainnya` on the `penerbitanBukti` table. All the data in the column will be lost.
  - You are about to drop the column `alasanRetur` on the `penerbitanBukti` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "penerbitanBukti" DROP COLUMN "alasanLainnya",
DROP COLUMN "alasanRetur";
