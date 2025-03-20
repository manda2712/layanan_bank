const prisma = require("../db")

async function InsertPenerbitanNota(dataNota) {
    const newPenerbitanNota = await prisma.penerbitanNota.create({
        data:{
            kodeSatker: dataNota.kodeSatker,
            noTelpon : dataNota.noTelpon,
            tahunSteoran :dataNota.tahunSteoran,
            unggahDokumen : dataNota.unggahDokumen
        }
    })
    return newPenerbitanNota  
}

async function findPenerbitanNota() {
    const newPenerbitanNota = await prisma.penerbitanNota.findMany({
        select:{
            id: true,
            kodeSatker: true,
            noTelpon : true,
            tahunSteoran :true,
            unggahDokumen : true
        }
    })
    return newPenerbitanNota  
}

async function findPenerbitanNotaById(id) {
    const penerbitanNota = await prisma.penerbitanNota.findUnique({
        where:{
            id : parseInt(id)
        },
        select:{
            id: true,
            kodeSatker: true,
            noTelpon : true,
            tahunSteoran :true,
            unggahDokumen : true  
        }
    })
    return penerbitanNota  
}

async function editPenerbitanNota(id, dataNota) {
    const updatePenerbitanNota = await prisma.penerbitanNota.update({
        where:{
            id: parseInt(id)
        },
        data:{
            kodeSatker: dataNota.kodeSatker,
            noTelpon : dataNota.noTelpon,
            tahunSteoran :dataNota.tahunSteoran,
            unggahDokumen : dataNota.unggahDokumen
        }
    })
    return updatePenerbitanNota 
}

async function deletePenerbitanNota(id) {
    await prisma.penerbitanNota.delete({
        where:{
            id: parseInt(id)
        }
    })
    
}

module.exports = {InsertPenerbitanNota, findPenerbitanNota, findPenerbitanNotaById, editPenerbitanNota, deletePenerbitanNota}