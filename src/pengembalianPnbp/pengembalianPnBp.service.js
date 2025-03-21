const { insertPengembalianPnbp, findPengembalianPnbp, findPengembalianPnbpById, editPengembalianPnbp, deletePengembalianPnbp } = require("./pengembalianPnBp.repository")


async function createPengembalianPnbp(dataPnbp, userId) {
    try {
        if (!userId) {
            throw new Error("User Id Tidak Ditemukan");
        } 
 
        const newPengembalianPnbp = await insertPengembalianPnbp(dataPnbp, userId)
        return newPengembalianPnbp
    } catch (error) {
     throw new Error("Gagal Membuat Pengembalian PNBP");
    }
}
async function getAllPengembalianPnbp() {
    const pengembalianPnBp = findPengembalianPnbp()
    return pengembalianPnBp 
}

async function getPengembalianPnbpById(id) {
    const pengembalianPnBp = findPengembalianPnbpById(id)
    if(!pengembalianPnBp){
        throw new Error("Tidak dapat menemukan");
    }
    return pengembalianPnBp
}

async function editPengembalianPnbpById(id, dataPnbp) {
    await getPengembalianPnbpById(id)
    const updatePengembalianPnbp = await editPengembalianPnbp(id, dataPnbp)
    return updatePengembalianPnbp  
}

async function deletePengembalianPnbpById(id) {
    await getPengembalianPnbpById(id)
    await deletePengembalianPnbp(id)  
}

module.exports={
    createPengembalianPnbp,
    getAllPengembalianPnbp,
    getPengembalianPnbpById,
    editPengembalianPnbpById,
    deletePengembalianPnbpById
}