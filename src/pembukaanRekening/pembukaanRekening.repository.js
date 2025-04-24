const prisma = require('../db')

async function insertPembukaanRekening (dataRekening, userId) {
  if (!userId) throw new Error('User ID tidak ditemukan!')

  const newPembukaanRekening = await prisma.pembukaanRekening.create({
    data: {
      kodeSatker: dataRekening.kodeSatker,
      noTelpon: dataRekening.noTelpon,
      jenisRekening: dataRekening.jenisRekening,
      unggahDokumen: dataRekening.unggahDokumen,
      userId: userId, // Ambil dari token JWT,
      monitoring: {
        create: {
          status: 'DIPROSES', // Sesuaikan dengan enum StatusMonitoring
          userId: userId
        }
      }
    },
    include: { monitoring: true } // Ambil data user untuk validasi
  })

  return newPembukaanRekening
}

async function findPembukaanRekening () {
  const pembukaanRekening = await prisma.pembukaanRekening.findMany({
    select: {
      id: true,
      kodeSatker: true,
      noTelpon: true,
      jenisRekening: true,
      unggahDokumen: true
    }
  })
  return pembukaanRekening
}

async function findPembukaanRekeningById (id) {
  const pembukaanRekening = await prisma.pembukaanRekening.findFirst({
    where: { id: Number(id) },
    include: {
      monitoring: {
        select: {
          status: true
        }
      }
    }
  })
  return pembukaanRekening
}

async function editPembukaanRekening (id, dataRekening) {
  const pembukaanRekening = await prisma.pembukaanRekening.findUnique({
    where: {
      id: parseInt(id)
    },
    include: { monitoring: true }
  })

  if (!pembukaanRekening) {
    throw new Error('Pembukaan Rekening ditemukan')
  }

  if (!dataRekening.unggahDokumen) {
    throw new Error('Dokumen baru harus diunggah setelah penolakan')
  }

  const updatePembukaanRekening = await prisma.pembukaanRekening.update({
    where: { id: parseInt(id) },
    data: { unggahDokumen: dataRekening.unggahDokumen }
  })

  if (pembukaanRekening.monitoring && pembukaanRekening.monitoring.length > 0) {
    const lastMonitoring =
      pembukaanRekening.monitoring[pembukaanRekening.monitoring.length - 1]
    await prisma.monitoringPembukaanRekening.update({
      where: { id: lastMonitoring.id },
      data: {
        status: 'DIPROSES'
      }
    })
  }
  return updatePembukaanRekening
}

async function deletePembukaanRekening (id) {
  await prisma.pembukaanRekening.delete({
    where: {
      id: parseInt(id)
    }
  })
}

module.exports = {
  insertPembukaanRekening,
  findPembukaanRekening,
  findPembukaanRekeningById,
  editPembukaanRekening,
  deletePembukaanRekening
}
