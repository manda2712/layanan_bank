-- CreateEnum
CREATE TYPE "JK" AS ENUM ('perempuan', 'lakiLaki');

-- CreateEnum
CREATE TYPE "Role" AS ENUM ('admin', 'user');

-- CreateTable
CREATE TABLE "user" (
    "id" SERIAL NOT NULL,
    "namaLengkap" INTEGER NOT NULL,
    "email" TEXT NOT NULL,
    "noTelepon" TEXT NOT NULL,
    "jenisKelamin" "JK" NOT NULL,
    "password" TEXT NOT NULL,
    "role" "Role" NOT NULL,

    CONSTRAINT "user_pkey" PRIMARY KEY ("id")
);
