const prisma = require("../db")

async function insertPengembalianPnbp(dataPnbp, userId) {
    const newPengembalianPnbp = await prisma.pengembalianPnbp.create({
        data:{
            pihakMengajukan : dataPnbp.pihakMengajukan,
            kodeSatker      : dataPnbp.kodeSatker,
            noTelpon        : dataPnbp.noTelpon,
            unggahDokumen   : dataPnbp.unggahDokumen,
            userId : userId,
            monitoring:{
                create:{
                    status: "DIPROSES",
                    userId: userId
                }
            }
        },
        include: {monitoring: true}
    }) 
    return newPengembalianPnbp   
}

async function findPengembalianPnbp() {
    const pengembalianPnbp = await prisma.pengembalianPnbp.findMany({
        select:{
            id: true,
            pihakMengajukan : true,
            kodeSatker      : true,
            noTelpon        : true,
            unggahDokumen   : true
            
        }
    })
    return pengembalianPnbp
}

async function findPengembalianPnbpById(id) {
    const pengembalianPnbp = await prisma.pengembalianPnbp.findUnique({
        where:{
            id : parseInt(id)
        },
        select:{
            id: true,
            pihakMengajukan : true,
            kodeSatker      : true,
            noTelpon        : true,
            unggahDokumen   : true
        }
    })
    return pengembalianPnbp
}

async function editPengembalianPnbp(id, dataPnbp) {
    const updatePengembalianPnbp = await prisma.pengembalianPnbp.update({
        where:{
            id: parseInt(id)
        },
        data:{
            pihakMengajukan : dataPnbp.pihakMengajukan,
            kodeSatker      : dataPnbp.kodeSatker,
            noTelpon        : dataPnbp.noTelpon,
            unggahDokumen   : dataPnbp.unggahDokumen
        }
    })
    return updatePengembalianPnbp
}

async function deletePengembalianPnbp(id) {
    await prisma.pengembalianPnbp.delete({
        where:{
            id: parseInt(id)
        }
    })
    
}

module.exports = {
    insertPengembalianPnbp,
    findPengembalianPnbp,
    findPengembalianPnbpById,
    editPengembalianPnbp,
    deletePengembalianPnbp
}