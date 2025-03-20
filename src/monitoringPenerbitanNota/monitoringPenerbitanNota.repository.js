const prisma = require("../db")

async function findMonitoringPenerbitanNota() {
    const monitoring = await prisma.monitoringPenerbitanNota.findMany({
        select:{
            id: true,
            status: true,
            penerbitanNotaId: true,
            penerbitanNota:{
                select:{
                    kodeSatker    :true,
                    noTelpon      :true,
                    tahunSteoran  :true,
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

async function findMonitoringPenerbitanNotaById(id) {
    const monitoring = await prisma.monitoringPenerbitanNota.findUnique({
        where:{id: parseInt(id)},
        select:{
            id:true,
            penerbitanNotaId:true,
            status: true,
            penerbitanNota:{
                select:{
                    kodeSatker    :true,
                    noTelpon      :true,
                    tahunSteoran  :true,
                    unggahDokumen :true,
                    user:{
                        select:{
                            namaLengkap: true,
                        }
                    }  
                }
            }
        }
    })
    return monitoring
}

async function updatedMonitoringPenerbitanNota(id, dataMonitoring) {
    const updatedMonitoring = await prisma.monitoringPenerbitanNota.update({
        where:{id: parseInt(id)},
        data:{
            status: dataMonitoring.status
        },
        include:{
            penerbitanNota:{
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

async function deleteMonitoringPenerbitanNota(id) {
    await prisma.monitoringPenerbitanNota.delete({
        where:{id: parseInt(id)}
    })
}

module.exports = {
    findMonitoringPenerbitanNota,
    findMonitoringPenerbitanNotaById,
    updatedMonitoringPenerbitanNota,
    deleteMonitoringPenerbitanNota
}