const prisma = require("../db")

async function findMonitoringReturSp2d() {
    const monitoring = await prisma.monitoringReturSp2d.findMany({
        select: {
            id: true,
            returSp2dId: true,
            status: true,
            returSp2d: {
                select: {
                    kodeSatker: true,
                    noTelpon: true,
                    alasanRetur: true,
                    unggah_dokumen: true,
                    user: { // ✅ Pastikan ini sesuai dengan relasi di schema
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

async function findMonitoringReturSp2dById(id) {
    const monitoring = await prisma.monitoringReturSp2d.findUnique({
        where: {id: parseInt(id)},
        select:{
            id: true,
            returSp2dId: true,
            status: true,
            returSp2d:{
                select:{
                    kodeSatker: true,
                    noTelpon: true,
                    alasanRetur: true,
                    unggah_dokumen : true,
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

async function updatedMonitoringReturSp2d(id, dataMonitoring) {
    const updatedMonitoring = await prisma.monitoringReturSp2d.update({
        where:{id: parseInt(id)},
        data:{
            status: dataMonitoring.status
        },
        include:{
            returSp2d:{
                include:{
                    user:{
                        select:{
                            namaLengkap:true
                        }
                    }
                }
            }
        }
    })
    return updatedMonitoring
}

async function deleteMonitoringReturSp2d(id) {
    await prisma.monitoringReturSp2d.delete({
        where:{id: parseInt(id)}
    })
    
}

module.exports = {
    findMonitoringReturSp2d,
    findMonitoringReturSp2dById,
    updatedMonitoringReturSp2d,
    deleteMonitoringReturSp2d
}