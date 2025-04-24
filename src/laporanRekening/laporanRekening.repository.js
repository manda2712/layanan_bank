const prisma = require('../db')

async function insertLaporanRekening (dataLaporan, userId) {
  if (!userId) throw new Error('User Id Tidak Ditemukan')

  const newLaporanRekening = await prisma.laporanRekening.create({
    data: {
      kodeSatker: dataLaporan.kodeSatker,
      noTelpon: dataLaporan.noTelpon,
      jenisLaporan: dataLaporan.jenisLaporan,
      unggahDokumen: dataLaporan.unggahDokumen,
      userId: userId,
      monitoring: {
        create: {
          status: 'DIPROSES',
          userId: userId
        }
      }
    },
    include: { monitoring: true }
  })
  return newLaporanRekening
}

async function findLaporanRekening () {
  const laporanRekening = await prisma.laporanRekening.findMany({
    select: {
      id: true,
      kodeSatker: true,
      noTelpon: true,
      jenisLaporan: true,
      unggahDokumen: true
    }
  })
  return laporanRekening
}

async function findLaporanRekeningById (id) {
  const laporanRekening = await prisma.laporanRekening.findFirst({
    where: {
      id: Number(id)
    },
    include: {
      monitoring: {
        select: {
          status: true
        }
      }
    }
  })
  return laporanRekening
}

async function editLaporanRekening (id, dataLaporan) {
  const laporanRekening = await prisma.laporanRekening.findUnique({
    where: { id: parseInt(id) },
    include: { monitoring: true }
  })

  if (!laporanRekening) {
    throw new Error('Laporan Rekening tidak ditemukan!')
  }

  if (!dataLaporan.unggahDokumen) {
    throw new Error('Dokumen baru harus diunggah setelah penolakan')
  }

  const updateLaporanRekening = await prisma.laporanRekening.update({
    where: { id: parseInt(id) },
    data: {
      unggahDokumen: dataLaporan.unggahDokumen
    }
  })

  if (laporanRekening.monitoring && laporanRekening.monitoring.length > 0) {
    const lastMonitoring =
      laporanRekening.monitoring[laporanRekening.monitoring.length - 1]
    await prisma.monitoringLaporanRekening.update({
      where: { id: lastMonitoring.id },
      data: {
        status: 'DIPROSES'
      }
    })
  }
  return updateLaporanRekening
}

async function deleteLaporanRekening (id) {
  await prisma.laporanRekening.delete({
    where: {
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
