const prisma = require('../db')

async function insertPengembalianPnbp (dataPnbp, userId) {
  const newPengembalianPnbp = await prisma.pengembalianPnbp.create({
    data: {
      pihakMengajukan: dataPnbp.pihakMengajukan,
      kodeSatker: dataPnbp.kodeSatker,
      noTelpon: dataPnbp.noTelpon,
      unggahDokumen: dataPnbp.unggahDokumen,
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
  return newPengembalianPnbp
}

async function findPengembalianPnbp () {
  const pengembalianPnbp = await prisma.pengembalianPnbp.findMany({
    select: {
      id: true,
      pihakMengajukan: true,
      kodeSatker: true,
      noTelpon: true,
      unggahDokumen: true
    }
  })
  return pengembalianPnbp
}

async function findPengembalianPnbpById (id) {
  const pengembalianPnbp = await prisma.pengembalianPnbp.findFirst({
    where: { id: Number(id) },
    include: {
      monitoring: {
        select: {
          status: true // ambil hanya field tertentu dari relasi monitoring
        }
      }
    }
  })
  return pengembalianPnbp
}

async function editPengembalianPnbp (id, dataPnbp) {
  const pengembalianPnbp = await prisma.pengembalianPnbp.findUnique({
    where: { id: parseInt(id) },
    include: { monitoring: true }
  })

  if (!pengembalianPnbp) {
    throw new Error('Pengembalian PNBP Tidak Ditemukan')
  }

  if (!dataPnbp.unggahDokumen) {
    throw new Error('Dokumen baru harus diunggah setelah penolakan')
  }

  const updatePengembalianPnbp = await prisma.pengembalianPnbp.update({
    where: { id: parseInt(id) },
    data: {
      unggahDokumen: dataPnbp.unggahDokumen
    }
  })

  if (pengembalianPnbp.monitoring && pengembalianPnbp.monitoring.length > 0) {
    const lastMonitoring =
      pengembalianPnbp.monitoring[pengembalianPnbp.monitoring.length - 1]
    await prisma.monitoringPengembalianPnbp.update({
      where: { id: lastMonitoring.id },
      data: {
        status: 'DIPROSES'
      }
    })
  }
  return updatePengembalianPnbp
}

async function deletePengembalianPnbp (id) {
  await prisma.pengembalianPnbp.delete({
    where: {
      id: parseInt(id)
    }
  })
}

module.exports = {
  insertPengembalianPnbp,
  findPengembalianPnbp,
  findPengembalianPnbpById,
  editPengembalianPnbp,
  deletePengembalianPnbp
}
