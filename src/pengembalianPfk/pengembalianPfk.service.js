const { insertPengembalianPfk, findPengembalianPfk, findPengembalianPfkById, editPengembalianPfk } = require("./pengembalianPfk.repository");

async function createPengembalianPfk(dataPfk, userId) {
    try {
        if (!userId) {
           throw new Error("User Id Tidak Ditemukan");
        }

        const newPengembalianPfk = await insertPengembalianPfk(dataPfk, userId)
        return newPengembalianPfk
    } catch (error) {
        throw new Error("Gagal Membuat Pengembalian PFK");  
    }  
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