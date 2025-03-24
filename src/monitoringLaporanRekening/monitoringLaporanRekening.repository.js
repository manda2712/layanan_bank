const prisma = require("../db")

async function findMonitoringLaporanRekening() {
    const monitoring = await prisma.monitoringLaporanRekening.findMany({
        select:{
            id:true,
            laporanRekeningId: true,
            status: true,
            laporanRekening:{
                select:{
                    kodeSatker: true, 
                    noTelpon :true, 
                    jenisLaporan : true, 
                    unggahDokumen :true,
                    user:{
                        select:{
                            namaLengkap: true
                        }
                    }

                }
            }
        }
    })
    return monitoring
}

async function findMonitoringLaporanRekeningById(id) {
    const monitoring = await prisma.monitoringLaporanRekening.findUnique({
        where: {id: parseInt(id)},
        select:{
            id:true,
            laporanRekeningId: true,
            status: true,
            laporanRekening:{
                select:{
                    kodeSatker: true, 
                    noTelpon :true, 
                    jenisLaporan : true, 
                    unggahDokumen :true,
                    user:{
                        select:{
                            namaLengkap: true
                        }
                    }

                }
            }
        }
    })
    return monitoring
}

async function updateMonitoringLaporanRekening(id, dataMonitoring) {
    const updatedMonitoring = await prisma.monitoringLaporanRekening.update({
        where: { id: parseInt(id) },
        data: {
            status: dataMonitoring.status,
        },
        include: {
            laporanRekening: {
                include: {
                    user: { // ✅ Ambil data user
                        select: {
                            namaLengkap: true // Pastikan ada field 'nama' dalam tabel user
                        }
                    }
                }
            }
        }
    })
    return updatedMonitoring
}

async function deletedMonitoringLaporanRekening(id) {
    return await prisma.$transaction(async (prisma) => {
        const deletedMonitoring = await prisma.monitoringLaporanRekening.delete({
            where: {id: parseInt(id)}
        });

        await prisma.laporanRekening.delete({
            where: {id: deletedMonitoring.laporanRekeningId}
        })
        return deletedMonitoring
    })  
}


module.exports = {
    findMonitoringLaporanRekening,
    findMonitoringLaporanRekeningById,
    updateMonitoringLaporanRekening,
    deletedMonitoringLaporanRekening
}