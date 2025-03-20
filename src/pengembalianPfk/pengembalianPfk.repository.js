const prisma = require("../db")

async function insertPengembalianPfk(dataPfk) {
    const newPengembalianPfk = await prisma.pengembalianPfk.create({
        data:{
            pihakMengajukan :dataPfk.pihakMengajukan,
            kodeSatker      :dataPfk.kodeSatker,
            noTelpon        :dataPfk.noTelpon,
            unggahDokumen   :dataPfk.unggahDokumen
        }
    })
    return newPengembalianPfk
}

async function findPengembalianPfk() {
    const pengembalianPfk = await prisma.pengembalianPfk.findMany({
        select:{
            id              :true,
            pihakMengajukan :true,
            kodeSatker      :true,
            noTelpon        :true,
            unggahDokumen   :true
        }
    })
    return pengembalianPfk 
}

async function findPengembalianPfkById(id) {
    const pengembalianPfk = await prisma.pengembalianPfk.findUnique({
        where:{
            id: parseInt(id),
        },
        select:{
            id              :true,
            pihakMengajukan :true,
            kodeSatker      :true,
            noTelpon        :true,
            unggahDokumen   :true
        }
    })
    return pengembalianPfk
}

async function editPengembalianPfk(id, dataPfk) {
    const updatePengembalianPfk = await prisma.pengembalianPfk.update({
        where:{
            id:parseInt(id)
        },
        data:{
            pihakMengajukan :dataPfk.pihakMengajukan,
            kodeSatker      :dataPfk.kodeSatker,
            noTelpon        :dataPfk.noTelpon,
            unggahDokumen   :dataPfk.unggahDokumen
        }
    })
    return updatePengembalianPfk 
}

async function deletePengembalianPfk(id) {
    await prisma.pengembalianPfk.delete({
        where:{
            id: parseInt(id)
        }
    }) 
}


module.exports={
    insertPengembalianPfk,
    findPengembalianPfk,
    findPengembalianPfkById,
    editPengembalianPfk,
    deletePengembalianPfk
}