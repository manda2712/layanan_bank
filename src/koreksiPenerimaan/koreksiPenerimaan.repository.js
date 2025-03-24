const prisma = require("../db")

async function InsertKoreksiPenerimaan(dataKoreksi, userId) {
    if (!userId) throw new Error("User Id Tidak Ditemukan");
    const newKoreksiPenerimaan = await prisma.koreksiPenerimaan.create({
        data:{
            kodeSatker : dataKoreksi.kodeSatker,
            noTelpon : dataKoreksi.noTelpon,
            tahunSteoran : dataKoreksi.tahunSteoran,
            unggahDokumem : dataKoreksi.unggahDokumem,
            userId: userId,
            monitoring:{
                create:{
                    status: "DIPROSES",
                    userId:userId
                }
            }
        },
        include: {monitoring:true}
    })
    return newKoreksiPenerimaan  
}

async function findKoreksiPenerimaan() {
    const koreksiPenerimaan = await prisma.koreksiPenerimaan.findMany({
        select:{
            id: true,
            kodeSatker : true,
            noTelpon : true,
            tahunSteoran : true,
            unggahDokumem : true,
        }
    })
    return koreksiPenerimaan  
}

async function findKoreksiPenerimaanById(id) {
    const koreksiPenerimaan = await prisma.koreksiPenerimaan.findUnique({
        where:{
            id: parseInt(id)
        },
        select:{
            id: true,
            kodeSatker : true,
            noTelpon : true,
            tahunSteoran : true,
            unggahDokumem : true,
        }
    })
    return koreksiPenerimaan  
}

async function editKoreksiPenerimaan(id, dataKoreksi) {
    const updateKoreksiPenerimaan = await prisma.koreksiPenerimaan.update({
        where:{
            id: parseInt(id)
        },
        data:{
            kodeSatker : dataKoreksi.kodeSatker,
            noTelpon : dataKoreksi.noTelpon,
            tahunSteoran : dataKoreksi.tahunSteoran,
            unggahDokumem : dataKoreksi.unggahDokumem,
        }
    })
    return updateKoreksiPenerimaan 
}

async function deleteKoreksiPenerimaan(id) {
    await prisma.koreksiPenerimaan.delete({
        where:{
            id: parseInt(id)
        }
    })
    
}

module.exports = {
    InsertKoreksiPenerimaan,
    findKoreksiPenerimaan,
    findKoreksiPenerimaanById,
    editKoreksiPenerimaan,
    deleteKoreksiPenerimaan
}