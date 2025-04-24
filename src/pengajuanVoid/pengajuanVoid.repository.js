const prisma = require('../db')

async function insertPengajuanVoid (dataVoid, userId) {
  if (!userId) throw new Error('User ID tidak ditemukan!')
  const newPengajuanVoid = await prisma.pengajuanVoid.create({
    data: {
      kodeSatker: dataVoid.kodeSatker,
      noTelpon: dataVoid.noTelpon,
      alasanVoid: dataVoid.alasanVoid,
      unggahDokumen: dataVoid.unggahDokumen,
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
  return newPengajuanVoid
}

async function findPengajuanVoid () {
  const pengajuanVoid = await prisma.pengajuanVoid.findMany({
    select: {
      id: true,
      kodeSatker: true,
      noTelpon: true,
      alasanVoid: true,
      unggahDokumen: true
    }
  })
  return pengajuanVoid
}

async function findPengajuanVoidById (id) {
  const pengajuanVoid = await prisma.pengajuanVoid.findFirst({
    where: { id: Number(id) },
    include: {
      monitoring: {
        select: {
          status: true // ambil hanya field tertentu dari relasi monitoring
        }
      }
    }
  })
  return pengajuanVoid
}

async function editPengajuanVoid (id, dataVoid) {
  const pengajuanVoid = await prisma.pengajuanVoid.findUnique({
    where: {
      id: parseInt(id)
    },
    include: { monitoring: true }
  })

  if (!pengajuanVoid) {
    throw new Error('Pengajuan Void tidak ditemukan')
  }

  if (!dataVoid.unggahDokumen) {
    throw new Error('Dokumen baru harus diubah setelah penolakan')
  }

  const updatePengajuanVoid = await prisma.pengajuanVoid.update({
    where: { id: parseInt(id) },
    data: {
      unggahDokumen: dataVoid.unggahDokumen
    }
  })

  if (pengajuanVoid.monitoring && pengajuanVoid.monitoring.length > 0) {
    const lastMonitoring =
      pengajuanVoid.monitoring[pengajuanVoid.monitoring.length - 1]
    await prisma.monitoringPengajuanVoid.update({
      where: { id: lastMonitoring.id },
      data: {
        status: 'DIPROSES'
      }
    })
  }
  return updatePengajuanVoid
}

async function deletePengajuanVoid (id) {
  await prisma.pengajuanVoid.delete({
    where: {
      id: parseInt(id)
    }
  })
}
module.exports = {
  insertPengajuanVoid,
  findPengajuanVoid,
  findPengajuanVoidById,
  editPengajuanVoid,
  deletePengajuanVoid
}
