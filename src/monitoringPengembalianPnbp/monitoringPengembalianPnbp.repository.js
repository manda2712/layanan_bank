const prisma = require("../db")

async function findMonitoringPengembalianPnbp() {
    const monitoring = await prisma.monitoringPengembalianPnbp.findMany({
        select:{
            id:true,
            status: true,
            pengembalianPnbpId : true,
            pengembalianPnbp:{
                select:{
                    pihakMengajukan :true,
                    kodeSatker      :true,
                    noTelpon        :true,
                    unggahDokumen   :true,
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

async function findMonitoringPengembalianPnbpById(id) {
    const monitoring = await prisma.monitoringPengembalianPnbp.findUnique({
        where:{id : parseInt(id)},
        select:{
            id:true,
            status: true,
            pengembalianPnbpId : true,
            pengembalianPnbp:{
                select:{
                    pihakMengajukan :true,
                    kodeSatker      :true,
                    noTelpon        :true,
                    unggahDokumen   :true,
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

async function updateMonitoringPengembalianPnbp(id, dataMonitoring) {
    const updatedMonitoring = await prisma.monitoringPengembalianPnbp.update({
        where:{id: parseInt(id)},
        data:{
            status: dataMonitoring.status
        },
        include:{
            pengembalianPnbp:{
                include:{
                    user:{
                        select:{
                            namaLengkap : true
                        }
                    }
                }
            }
        }
    })
    return updatedMonitoring
}

async function deleteMonitoringPengembalianPnbp(id) {
    return await prisma.$transaction(async (prisma) => {
        // Hapus monitoring dulu
        const deletedMonitoring = await prisma.monitoringPengembalianPnbp.delete({
            where: { id: parseInt(id) }
        });

        // Hapus returSp2d yang terkait
        await prisma.pengembalianPnbp.delete({
            where: { id: deletedMonitoring.pengembalianPnbpId }
        });

        return deletedMonitoring;
    });
}

module.exports = {
    findMonitoringPengembalianPnbp,
    findMonitoringPengembalianPnbpById,
    updateMonitoringPengembalianPnbp,
    deleteMonitoringPengembalianPnbp
}