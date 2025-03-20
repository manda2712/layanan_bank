const { insertPengembalianPfk, findPengembalianPfk, findPengembalianPfkById, editPengembalianPfk } = require("./pengembalianPfk.repository");

async function createPengembalianPfk(pengembalianPfk) {
    const newPfk = await insertPengembalianPfk(pengembalianPfk)
    return newPfk  
}

async function getAllPengembalianPfk() {
    const pengembalianPfk = findPengembalianPfk()
    return pengembalianPfk  
}

async function getPengembalianPfkById(id) {
    const pengembalianPfk = findPengembalianPfkById(id)
    if(!pengembalianPfk) {
        throw new Error("Tidak Dapat Menemukan Pengembalian PFK"); 
    }
    return pengembalianPfk 
}

async function updatePengembalianPfkById(id, dataPfk) {
    await getPengembalianPfkById(id)
    const updatePengembalianPfk = await editPengembalianPfk(id, dataPfk)
    return updatePengembalianPfk 
}

async function deletePengembalianPfkById(id) {
    await getPengembalianPfkById(id)
    deletePengembalianPfkById(id)
}

module.exports = {
    createPengembalianPfk,
    getAllPengembalianPfk,
    getPengembalianPfkById,
    updatePengembalianPfkById,
    deletePengembalianPfkById
}