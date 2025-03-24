const { insertLaporanRekening, findLaporanRekening, findLaporanRekeningById, editLaporanRekening, deleteLaporanRekening } = require("./laporanRekening.repository");

async function createLaporanRekening(dataLaporan, userId) {
    try {
        if (!userId) {
           throw new Error("User Id Tidak Ditemukan");
        }

        const newLaporanRekening = await insertLaporanRekening(dataLaporan, userId)
        return newLaporanRekening
    } catch (error) {
        console.error("Error saat membuat laporan rekening:", error)
        throw new Error("Gagal Membuat Laporan Rekening");  
    }  
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