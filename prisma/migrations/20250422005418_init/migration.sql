/*
  Warnings:

  - Added the required column `updatedAt` to the `monitoringReturSp2d` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `returSp2d` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "monitoringReturSp2d" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "returSp2d" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;
