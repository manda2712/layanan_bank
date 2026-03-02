-- AlterTable
ALTER TABLE "user" ADD COLUMN     "satkerId" INTEGER;

-- AddForeignKey
ALTER TABLE "user" ADD CONSTRAINT "user_satkerId_fkey" FOREIGN KEY ("satkerId") REFERENCES "Satker"("id") ON DELETE SET NULL ON UPDATE CASCADE;
