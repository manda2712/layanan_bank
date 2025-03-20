const { insertPengembalianPnbp, findPengembalianPnbp, findPengembalianPnbpById, editPengembalianPnbp, deletePengembalianPnbp } = require("./pengembalianPnBp.repository")


async function createPengembalianPnbp(pengembalianPnbp) {
    const newPnpb = await insertPengembalianPnbp(pengembalianPnbp)
    return newPnpb  
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