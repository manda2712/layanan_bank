const prisma = require("../db")

async function findMonitoringPengajuanVoid() {
    const monitoring = await prisma.monitoringPengajuanVoid.findMany({
        select:{
            id: true,
            status: true,
            pengajuanVoidId: true,
            pengajuanVoid:{
                select:{
                    kodeSatker    :true,
                    noTelpon      :true,
                    alasanVoid    :true,
                    unggahDokumen :true,
                    user:{
                        select:{
                            namaLengkap:true
                        }
                    }
                }
            }
        }
    })
    return monitoring 
}

async function findMonitoringPengujuanVoidById(id) {
    const monitoring = await prisma.monitoringPengajuanVoid.findUnique({
        where:{id: parseInt(id)},
        select:{
            id: true,
            pengajuanVoidId: true,
            status: true,
            pengajuanVoid:{
                select:{
                    kodeSatker    :true,
                    noTelpon      :true,
                    alasanVoid    :true,
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

async function updateMonitoringPengajuanVoid(id, dataMonitoring) {
    const updatedMonitoring = await prisma.monitoringPengajuanVoid.update({
        where:{id: parseInt(id)},
        data:{
            status: dataMonitoring.status
        },
        include:{
            pengajuanVoid:{
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

async function deleteMonitoringPengajuanVoid(id) {
    await prisma.monitoringPengajuanVoid.delete({
        where:{id : parseInt(id)}
    })   
}

module.exports = {
    findMonitoringPengajuanVoid,
    findMonitoringPengujuanVoidById,
    updateMonitoringPengajuanVoid,
    deleteMonitoringPengajuanVoid
}