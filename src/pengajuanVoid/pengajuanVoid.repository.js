const prisma = require("../db")

async function insertPengajuanVoid(dataVoid, userId) {
    if (!userId) throw new Error("User ID tidak ditemukan!");
    const newPengajuanVoid = await prisma.pengajuanVoid.create({
        data:{
            kodeSatker : dataVoid.kodeSatker,
            noTelpon : dataVoid.noTelpon,
            alasanVoid : dataVoid.alasanVoid,
            unggahDokumen :dataVoid.unggahDokumen,
            userId: userId,
            monitoring:{
                create:{
                    status: "DIPROSES",
                    userId: userId
                }
            }
        },
        include:{ monitoring: true}
    })
    return newPengajuanVoid
}

async function findPengajuanVoid() {
    const pengajuanVoid = await prisma.pengajuanVoid.findMany({
        select:{
            id: true,
            kodeSatker : true,
            noTelpon : true,
            alasanVoid : true,
            unggahDokumen :true,
        }
    })
    return pengajuanVoid 
}

async function findPengajuanVoidById(id) {
    const pengajuanVoid = await prisma.pengajuanVoid.findUnique({
        where:{
            id: parseInt(id)
        },
        select:{
            id: true,
            kodeSatker : true,
            noTelpon : true,
            alasanVoid : true,
            unggahDokumen :true,
        }
    })
    return pengajuanVoid
}

async function editPengajuanVoid(id, dataVoid) {
    const updatePengajuanVoid = await prisma.pengajuanVoid.update({
        where:{
            id: parseInt(id)
        },
        data:{
            kodeSatker : dataVoid.kodeSatker,
            noTelpon : dataVoid.noTelpon,
            alasanVoid : dataVoid.alasanVoid,
            unggahDokumen :dataVoid.unggahDokumen
        }
    })
    return updatePengajuanVoid  
}

async function deletePengajuanVoid(id) {
    await prisma.pengajuanVoid.delete({
        where:{
            id: parseInt(id)
        }
    })
    
}
module.exports = {
    insertPengajuanVoid,
    findPengajuanVoid,
    findPengajuanVoidById,
    editPengajuanVoid,
    deletePengajuanVoid
}