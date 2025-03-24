const prisma = require("../db")

async function insertLaporanRekening(dataLaporan, userId) {
    if (!userId) throw new Error("User Id Tidak Ditemukan");
    
    const newLaporanRekening = await prisma.laporanRekening.create({
        data:{
            kodeSatker    : dataLaporan.kodeSatker,
            noTelpon      : dataLaporan.noTelpon,
            jenisLaporan  : dataLaporan.jenisLaporan,
            unggahDokumen : dataLaporan.unggahDokumen,
            userId : userId,
            monitoring:{
                create:{
                    status : "DIPROSES",
                    userId: userId
                }
            }
        },
        include: {monitoring: true}
    })
    return newLaporanRekening  
}

async function findLaporanRekening() {
    const laporanRekening = await prisma.laporanRekening.findMany({
        select:{
            id            : true,
            kodeSatker    :true,
            noTelpon      :true,
            jenisLaporan  :true,
            unggahDokumen :true
        }
    })
    return laporanRekening   
}

async function findLaporanRekeningById(id) {
    const laporanRekening = await prisma.laporanRekening.findUnique({
        where:{
            id: parseInt(id)
        },
        select:{
            id            :true,
            kodeSatker    :true,
            noTelpon      :true,
            jenisLaporan  :true,
            unggahDokumen :true
        }
    })
    return laporanRekening
}

async function editLaporanRekening(id, dataRekening) {
    const updateLaporanRekening = await prisma.laporanRekening.update({
        where:{
            id: parseInt(id)
        },
        data:{
            kodeSatker    : dataRekening.kodeSatker,
            noTelpon      : dataRekening.noTelpon,
            jenisLaporan  : dataRekening.jenisLaporan,
            unggahDokumen : dataRekening.unggahDokumen
        }
    })
    return updateLaporanRekening
}

async function deleteLaporanRekening(id) {
    await prisma.laporanRekening.delete({
        where:{
            id: parseInt(id)
        }
    })
}

module.exports = {
    insertLaporanRekening,
    findLaporanRekening,
    findLaporanRekeningById,
    editLaporanRekening,
    deleteLaporanRekening 
}