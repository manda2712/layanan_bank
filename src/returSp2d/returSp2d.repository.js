const prisma = require('../db')

async function insertRetur (dataRetur, userId) {
  if (!userId) throw new Error('User ID tidak ditemukan!')
  const newRetur = await prisma.returSp2d.create({
    data: {
      kodeSatker: dataRetur.kodeSatker,
      noTelpon: dataRetur.noTelpon,
      alasanRetur: dataRetur.alasanRetur,
      alasanLainnya: dataRetur.alasanLainnya || null,
      unggah_dokumen: dataRetur.unggah_dokumen,
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
  return newRetur
}

async function findRetur () {
  const returSp2d = await prisma.returSp2d.findMany({
    select: {
      id: true,
      kodeSatker: true,
      noTelpon: true,
      alasanRetur: true,
      alasanLainnya: true,
      unggah_dokumen: true
    }
  })
  return returSp2d
}

async function findReturById (id) {
  const returSp2d = await prisma.returSp2d.findFirst({
    where: { id: Number(id) },
    include: {
      monitoring: {
        select: {
          status: true // ambil hanya field tertentu dari relasi monitoring
        }
      }
    }
  })
  return returSp2d
}

async function editRetur (id, dataRetur) {
  const returSp2d = await prisma.returSp2d.findUnique({
    where: { id: parseInt(id) },
    include: { monitoring: true } // Memastikan monitoring ikut di-fetch
  })

  if (!returSp2d) {
    throw new Error('Retur tidak ditemukan!')
  }

  // Pastikan dokumen baru diunggah
  if (!dataRetur.unggah_dokumen) {
    throw new Error('Dokumen baru harus diunggah setelah penolakan')
  }

  // Update dokumen di returSp2d
  const updatedRetur = await prisma.returSp2d.update({
    where: { id: parseInt(id) },
    data: {
      unggah_dokumen: dataRetur.unggah_dokumen
    }
  })

  // Update monitoring yang terakhir untuk status "DIPROSES"
  if (returSp2d.monitoring && returSp2d.monitoring.length > 0) {
    // Update monitoring terakhir yang ada
    const lastMonitoring = returSp2d.monitoring[returSp2d.monitoring.length - 1]
    await prisma.monitoringReturSp2d.update({
      where: { id: lastMonitoring.id }, // Menemukan monitoring terakhir
      data: {
        status: 'DIPROSES' // Menandakan status terbaru
      }
    })
  }
  return updatedRetur
}

async function deleteDataRetur (id) {
  await prisma.returSp2d.delete({
    where: {
      id: parseInt(id)
    }
  })
}

module.exports = {
  insertRetur,
  findRetur,
  findReturById,
  editRetur,
  deleteDataRetur
}
