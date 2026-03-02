/*
  Warnings:

  - You are about to drop the column `rbsStatus` on the `monitoringReturSp2d` table. All the data in the column will be lost.
  - You are about to drop the column `rbsResult` on the `returSp2d` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "monitoringReturSp2d" DROP COLUMN "rbsStatus";

-- AlterTable
ALTER TABLE "returSp2d" DROP COLUMN "rbsResult";
