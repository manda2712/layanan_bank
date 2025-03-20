const { pengajuanNota } = require("../db")
const {InsertPenerbitanNota, findPenerbitanNota, findPenerbitanNotaById, editPenerbitanNota, deletePenerbitanNota} = require("./penerbitanNota.repository")

async function createPenerbitanNota(dataBukti, userId) {
    try {
        if (!userId) {
            throw new Error("User Id Tidak Ditemukan");
        } 
        
        const newPenerbitanNota = await InsertPenerbitanNota(dataBukti, userId)
        return newPenerbitanNota
    } catch (error) {
        throw new Error("Gagal Membuat Penerbitan Nota"); 
    }
}

async function getAllPenerbitanNota() {
    const penerbitanNota = findPenerbitanNota()
    return penerbitanNota   
}

async function getPenerbitanNotaById(id) {
    const penerbitanNota = findPenerbitanNotaById(id)
    if (!penerbitanNota) {
        throw new Error("Tidak Dapat Menemukan Penerbitan Nota"); 
    }
    return penerbitanNota 
}

async function editPenerbitanNotaById(id, dataNota) {
    await getPenerbitanNotaById(id)
    const updatePenerbitanNota = await editPenerbitanNota(id, dataNota)
    return updatePenerbitanNota 
}

async function deletePenerbitanNotaById(id) {
    await getPenerbitanNotaById(id)
    await deletePenerbitanNota(id)
    
}

module.exports = {
    createPenerbitanNota,
    getAllPenerbitanNota,
    getPenerbitanNotaById,
    editPenerbitanNotaById,
    deletePenerbitanNotaById
}