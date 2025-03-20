const {InsertPenerbitanBukti, findPenerbitan, findPenerbitanBuktiById, editPenerbitanBukti, deletePenerbitanBukti} = require("./penerbitanBukti.repository")

async function createPenerbitanBukti(dataBukti, userId) {
   try {
        if (!userId) {
            throw new Error("User Id Tidak Ditemukan");
        } 

        const newPenerbitan = await InsertPenerbitanBukti(dataBukti, userId)
        return newPenerbitan
    } catch (error) {
    throw new Error("Gagal Membuat Penerbitan Bukti");
   }
}

async function getAllPenerbitanBukti() {
    const penerbitanBukti = findPenerbitan()
    return penerbitanBukti  
}

async function getPenerbitanBuktiById(id) {
    const penerbitanBukti = await findPenerbitanBuktiById(id)
    if (!penerbitanBukti) {
        throw new Error("Tidak Dapat Menemukan Penerbitan Bukti Yang dicari");  
    }
    return penerbitanBukti
    
}

async function editPenerbitanBuktiById(id, dataBukti) {
    await getPenerbitanBuktiById(id)
    const updateBukti = await editPenerbitanBukti(id, dataBukti)
    return updateBukti   
}

async function deletePenerbitanBuktiById(id) {
    await getPenerbitanBuktiById(id)
    await deletePenerbitanBukti(id)
    
}

module.exports ={createPenerbitanBukti, 
    findPenerbitan, 
    getAllPenerbitanBukti, 
    getPenerbitanBuktiById, 
    editPenerbitanBuktiById,
    deletePenerbitanBuktiById
}