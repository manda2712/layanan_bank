const prisma = require("../db");


async function findMonitoringPembukaanRekening() {
    const monitoring = await prisma.monitoringPembukaanRekening.findMany({
        select: {
            id: true,
            pembukaanRekeningId: true,
            status: true,
            pembukaanRekening: {
                select: {
                    kodeSatker: true,
                    noTelpon: true,
                    jenisRekening: true,
                    unggahDokumen: true,
                    user:{
                        select:{
                            namaLengkap:true
                        }
                    }
                }
            }
        }
    });
    return monitoring;
}

async function findMonitoringPembukaanRekeningById(id) {
    const monitoring = await prisma.monitoringPembukaanRekening.findUnique({
        where: { id: parseInt(id) },
        select: {
            id: true,
            pembukaanRekeningId: true,
            status: true,
            pembukaanRekening: {
                select: {
                    kodeSatker: true,
                    noTelpon: true,
                    jenisRekening: true,
                    unggahDokumen: true,
                    user:{
                        select:{
                            namaLengkap:true
                        }
                    }
                }
            }
        }
    });
    return monitoring;
}

async function updateMonitoringPembukaanRekening(id, dataMonitoring) {
    const updatedMonitoring = await prisma.monitoringPembukaanRekening.update({
        where: { id: parseInt(id) },
        data: {
            status: dataMonitoring.status,
        },
        include: {
            pembukaanRekening: {
                include: {
                    user: { // ✅ Ambil data user
                        select: {
                            namaLengkap: true // Pastikan ada field 'nama' dalam tabel user
                        }
                    }
                }
            }
        }
    });
    return updatedMonitoring;
}

async function deleteMonitoringPembukaanRekening(id) {
    return await prisma.$transaction(async (prisma) => {
        // Hapus monitoring dulu
        const deletedMonitoring = await prisma.monitoringPembukaanRekening.delete({
            where: { id: parseInt(id) }
        });

        // Hapus returSp2d yang terkait
        await prisma.pembukaanRekening.delete({
            where: { id: deletedMonitoring.pembukaanRekeningId }
        });

        return deletedMonitoring;
    });
}

module.exports = {
    findMonitoringPembukaanRekening,
    findMonitoringPembukaanRekeningById,
    updateMonitoringPembukaanRekening,
    deleteMonitoringPembukaanRekening
};
