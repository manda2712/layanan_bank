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
    await prisma.monitoringPengembalianPnbp.delete({
        where:{id: parseInt(id)}
    }) 
}

module.exports = {
    findMonitoringPengembalianPnbp,
    findMonitoringPengembalianPnbpById,
    updateMonitoringPengembalianPnbp,
    deleteMonitoringPengembalianPnbp
}