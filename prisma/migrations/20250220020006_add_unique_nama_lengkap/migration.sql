/*
  Warnings:

  - A unique constraint covering the columns `[namaLengkap]` on the table `user` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "user_namaLengkap_key" ON "user"("namaLengkap");
