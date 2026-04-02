-- CreateEnum
CREATE TYPE "TipeSatker" AS ENUM ('SATKER', 'PEMDA');

-- AlterTable
ALTER TABLE "Satker" ADD COLUMN     "tipe" "TipeSatker" NOT NULL DEFAULT 'SATKER';
