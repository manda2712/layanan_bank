const prisma = require("../db")

async function findMonitoringPenerbitanBukti() {
    const monitoring = await prisma.monitoringPenerbitanBukti.findMany({
        select: {
            id: true,
            status: true,
            penerbitanBuktiId: true, // ID tetap diambil sebagai referensi
            penerbitanBukti: { // Perbaikan: Mengakses relasi `penerbitanBukti`, bukan `penerbitanBuktiId`
                select: {
                    kodeSatker: true,
                    noTelpon: true,
                    alasanRetur: true,
                    unggah_dokumen: true,
                    user: { // Pastikan ada relasi ke `user`
                        select: {
                            namaLengkap: true
                        }
                    }
                }
            }
        }
    });
    return monitoring;
}


async function findMonitoringPenerbitanBuktiById(id) {
    const monitoring = await prisma.monitoringPenerbitanBukti.findUnique({
        where:{id: parseInt(id)},
        select:{
            id: true,
            penerbitanBuktiId: true,
            status: true,
            penerbitanBukti:{
                select:{
                    kodeSatker: true,
                    noTelpon: true,
                    alasanRetur: true,
                    unggah_dokumen: true,
                    user: { // Pastikan ada relasi ke `user`
                        select: {
                            namaLengkap: true
                        }
                    }
                }
            }
        }
    })
    return monitoring  
}

async function updatedMonitoringPenerbitanBukti(id, dataMonitoring) {
    const updatedMonitoring = await prisma.monitoringPenerbitanBukti.update({
        where:{id: parseInt(id)},
        data:{
            status: dataMonitoring.status
        },
        include:{
            penerbitanBukti:{
                include:{
                    user:{
                        select:{
                            namaLengkap: true
                        }
                    }
                }
            }
        }
    })
    return updatedMonitoring
}

async function deleteMonitoringPenerbitanBukti(id) {
    await prisma.monitoringPenerbitanBukti.delete({
        where:{id: parseInt(id)}
    })
}

module.exports = {
    findMonitoringPenerbitanBukti,
    findMonitoringPenerbitanBuktiById,
    updatedMonitoringPenerbitanBukti,
    deleteMonitoringPenerbitanBukti
}