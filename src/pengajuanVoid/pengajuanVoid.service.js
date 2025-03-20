const prisma = require("../db")
const { insertPengajuanVoid, findPengajuanVoid, findPengajuanVoidById, deletePengajuanVoid, editPengajuanVoid } = require("./pengajuanVoid.repository")

async function creatPengajuanVoid(pengajuanVoid) {
    const newVoid = await insertPengajuanVoid(pengajuanVoid)
    return newVoid 
}

async function getAllPengajuanVoid() {
    const pengajuanVoid = findPengajuanVoid()
    return pengajuanVoid  
}

async function getPengajuanVoidById(id) {
    const pengajuanVoid = findPengajuanVoidById(id)
    if (!pengajuanVoid) {
        throw new Error("tidak dapat menemukan pengajuan void");  
    }
    return pengajuanVoid  
}

async function editPengajuanVoidById(id, dataVoid) {
    await getPengajuanVoidById(id)
    const updatePengajuanVoid = await editPengajuanVoid(id, dataVoid)  
    return updatePengajuanVoid 
}

async function deletePengajuanVoidById(id) {
    await getPengajuanVoidById(id);
    await deletePengajuanVoid(id)
    
}

module.exports = {
    creatPengajuanVoid,
    getAllPengajuanVoid,
    getPengajuanVoidById,
    editPengajuanVoidById,
    deletePengajuanVoidById
}