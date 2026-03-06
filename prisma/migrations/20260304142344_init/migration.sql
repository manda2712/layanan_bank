-- AddForeignKey
ALTER TABLE "penerbitanBukti" ADD CONSTRAINT "penerbitanBukti_satkerId_fkey" FOREIGN KEY ("satkerId") REFERENCES "Satker"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
