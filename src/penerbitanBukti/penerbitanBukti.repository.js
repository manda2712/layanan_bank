const prisma = require('../db')

async function InsertPenerbitanBukti(dataBukti, userId) {
    const newPenerbitan = await prisma.penerbitanBukti.create({
        data: {
            kodeSatker : dataBukti.kodeSatker,
            noTelpon : dataBukti.noTelpon,
            alasanRetur : dataBukti.alasanRetur,
            unggah_dokumen :dataBukti.unggah_dokumen,
            userId : userId,
            monitoring:{
                create:{
                    status: "DIPROSES",
                    userId: userId
                }
            }
        },
        include: {monitoring:true}
    })
    return newPenerbitan 
}

async function findPenerbitan() {
    const penerbitanBukti = await prisma.penerbitanBukti.findMany({
        select:{
            id: true,
            kodeSatker : true,
            noTelpon : true,
            alasanRetur : true,
            unggah_dokumen :true
        }
    })
    return penerbitanBukti
    
}

async function findPenerbitanBuktiById(id) {
    const penerbitanBukti = await prisma.penerbitanBukti.findUnique({
        where:{
            id: parseInt(id)
        },
        select:{
            id : true,
            kodeSatker : true,
            noTelpon : true,
            alasanRetur : true,
            unggah_dokumen :true
        }
    })
    return penerbitanBukti 
}

async function editPenerbitanBukti(id, dataBukti) {
    const updateBukti = await prisma.penerbitanBukti.update({
        where:{
            id: parseInt(id)
        },
        data :{
            kodeSatker : dataBukti.kodeSatker,
            noTelpon : dataBukti.noTelpon,
            alasanRetur : dataBukti.alasanRetur, 
            unggah_dokumen : dataBukti.unggah_dokumen 
        }
    })
    return updateBukti
}

async function deletePenerbitanBukti(id) {
    await prisma.penerbitanBukti.delete({
        where:{
            id: parseInt(id)
        }
    }) 
}

module.exports = {
    InsertPenerbitanBukti, 
    findPenerbitan, 
    findPenerbitanBuktiById, 
    editPenerbitanBukti, 
    deletePenerbitanBukti
}