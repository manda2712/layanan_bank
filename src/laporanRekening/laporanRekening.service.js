const { insertLaporanRekening, findLaporanRekening, findLaporanRekeningById, editLaporanRekening, deleteLaporanRekening } = require("./laporanRekening.repository");

async function createLaporanRekening(laporanRekening) {
    const newLaporan = await insertLaporanRekening(laporanRekening)
    return newLaporan  
}

async function getAllLaporanRekening() {
    const laporanRekening = findLaporanRekening()
    return laporanRekening
}

async function getLaporanRekeningById(id) {
    const laporanRekening = findLaporanRekeningById(id)
    if (!laporanRekening) {
        throw new Error("Tidak Dapat Menemukan");   
    }
    return laporanRekening
}

async function updateLaporanRekeningById(id, dataRekening) {
    await getLaporanRekeningById(id)
    const updateLaporanRekening = await editLaporanRekening(id, dataRekening)
    return updateLaporanRekening   
}

async function deleteLaporanRekeningById(id) {
    await getLaporanRekeningById(id)
    await deleteLaporanRekening(id)  
}

module.exports ={
    createLaporanRekening,
    getAllLaporanRekening,
    getLaporanRekeningById,
    updateLaporanRekeningById,
    deleteLaporanRekeningById
}