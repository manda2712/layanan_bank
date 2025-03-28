const {InsertKoreksiPenerimaan, findKoreksiPenerimaan, findKoreksiPenerimaanById, editKoreksiPenerimaan, deleteKoreksiPenerimaan} = require("./koreksiPenerimaan.repository")

async function createKoreksiPenerimaan(koreksiPenerimaan, userId) {
    try {
        if (!userId) {
            throw new Error("User ID Tidak Ditemukan");
        }
        const newKoreksiPenerimaan = await InsertKoreksiPenerimaan(koreksiPenerimaan, userId)
        return newKoreksiPenerimaan
    } catch (error) {
        throw new Error("Gagal Membuat Koreksi Penerimaan ");  
    } 
}

async function getAllKoreksiPenerimaan() {
    const koreksiPenerimaan = findKoreksiPenerimaan()
    return koreksiPenerimaan  
}

async function getKoreksiPenerimaanById(id) {
    const koreksiPenerimaan = findKoreksiPenerimaanById(id)
    if (!koreksiPenerimaan) {
        throw new Error("Tidak Dapat Menemukan Koreksi Penerimaan ");   
    }
    return koreksiPenerimaan   
}

async function editKoreksiPenerimaanById(id, dataKoreksi) {
    await getKoreksiPenerimaanById(id)
    const updateKoreksiPenerimaan = await editKoreksiPenerimaan(id, dataKoreksi)
    return updateKoreksiPenerimaan
}

async function deleteKoreksiPenerimaanById(id) {
    await getKoreksiPenerimaanById(id)
    await deleteKoreksiPenerimaan(id)
    
}
module.exports = {
    createKoreksiPenerimaan,
    getAllKoreksiPenerimaan,
    getKoreksiPenerimaanById,
    editKoreksiPenerimaanById,
    deleteKoreksiPenerimaanById
}