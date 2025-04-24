const prisma = require('../db')

async function insertPengembalianPfk (dataPfk, userId) {
  const newPengembalianPfk = await prisma.pengembalianPfk.create({
    data: {
      pihakMengajukan: dataPfk.pihakMengajukan,
      kodeSatker: dataPfk.kodeSatker,
      noTelpon: dataPfk.noTelpon,
      unggahDokumen: dataPfk.unggahDokumen,
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
  return newPengembalianPfk
}

async function findPengembalianPfk () {
  const pengembalianPfk = await prisma.pengembalianPfk.findMany({
    select: {
      id: true,
      pihakMengajukan: true,
      kodeSatker: true,
      noTelpon: true,
      unggahDokumen: true
    }
  })
  return pengembalianPfk
}

async function findPengembalianPfkById (id) {
  const pengembalianPfk = await prisma.pengembalianPfk.findFirst({
    where: { id: Number(id) },
    include: {
      monitoring: {
        select: {
          status: true // ambil hanya field tertentu dari relasi monitoring
        }
      }
    }
  })
  return pengembalianPfk
}

async function editPengembalianPfk (id, dataPfk) {
  const pengembalianPfk = await prisma.pengembalianPfk.findUnique({
    where: { id: parseInt(id) },
    include: { monitoring: true }
  })

  if (!pengembalianPfk) {
    throw new Error('Pengembalian PFK tidak ditemukan')
  }

  if (!dataPfk.unggahDokumen) {
    throw new Error('Dokumen Baru harus diunggah setelah penolakan')
  }

  const updatePengembalianPfk = await prisma.pengembalianPfk.update({
    where: { id: parseInt(id) },
    data: {
      unggahDokumen: dataPfk.unggahDokumen
    }
  })

  if (pengembalianPfk.monitoring && pengembalianPfk.monitoring.length > 0) {
    const lastMonitoring =
      pengembalianPfk.monitoring[pengembalianPfk.monitoring.length - 1]
    await prisma.monitoringPengembalianPfk.update({
      where: { id: lastMonitoring.id },
      data: {
        status: 'DIPROSES'
      }
    })
  }
  return updatePengembalianPfk
}

async function deletePengembalianPfk (id) {
  await prisma.pengembalianPfk.delete({
    where: {
      id: parseInt(id)
    }
  })
}

module.exports = {
  insertPengembalianPfk,
  findPengembalianPfk,
  findPengembalianPfkById,
  editPengembalianPfk,
  deletePengembalianPfk
}
