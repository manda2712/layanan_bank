const { returSp2d } = require("../db")
const {insertRetur, findRetur, findReturById, editRetur, deleteDataRetur} = require("./returSp2d.repository")


async function createRetur(dataRetur, userId) {
    try {
        if (!userId) {
           throw new Error("UserId Tidak Ditemukan");   
        }
        // ✅ Validasi alasan lainnya jika enum-nya LAINNYA
        if (dataRetur.alasanRetur === "LAINNYA" && !dataRetur.alasanLainnya) {
            throw new Error("Alasan lainnya wajib diisi jika memilih LAINNYA.");
        }

        const newRetur = await insertRetur(dataRetur, userId)
        return newRetur
    } catch (error) {
        console.error("Error sata membuat data Retur SP2D", error)
        throw new Error("gagal membuat retur SP2D");  
    }
     
}

async function getAllRetur() {
    const returSp2d = findRetur()
    return returSp2d  
}

async function getAllReturById(id) {
    const returSp2d = await findReturById(id)
    if(!returSp2d){
        throw new Error("Tidak dapat menemukan data retur");
    }
    return returSp2d  
}

async function editReturById(id, dataRetur) {
    await getAllReturById(id)

    // ✅ Validasi juga di bagian edit
    if (dataRetur.alasanRetur === "LAINNYA" && !dataRetur.alasanLainnya) {
        throw new Error("Alasan lainnya wajib diisi jika memilih LAINNYA.");
    }
    
    const updateRetur = await editRetur(id, dataRetur)
    return updateRetur  
}

async function deleteReturById(id) {
    await getAllReturById(id);
    await deleteDataRetur(id);    
}


module.exports= {createRetur, getAllRetur, getAllReturById, editReturById, deleteReturById}