const prisma = require('../db')

async function insertPengajuanVoid (dataVoid, userId, satkerId) {
  if (!userId) throw new Error('User ID tidak ditemukan!')

  return await prisma.pengajuanVoid.create({
    data: {
      noTelpon: dataVoid.noTelpon,
      alasanVoid: dataVoid.alasanVoid,
      unggahDokumen: dataVoid.unggahDokumen,
      extractedText: dataVoid.extractedText,
      validationResult: dataVoid.validationResult,
      user: {
        connect: { id: userId }
      },

      satker: {
        connect: { id: satkerId }
      },
      monitoring: {
        create: {
          status: 'DIPROSES',
          hasilKmp: dataVoid.hasilAnalisis,
          catatan: null,
          user: { connect: { id: userId } },
          satker: { connect: { id: satkerId } }
        }
      }
    },
    include: { monitoring: true }
  })
}

async function findPengajuanVoid () {
  const pengajuanVoid = await prisma.pengajuanVoid.findMany({
    select: {
      id: true,
      noTelpon: true,
      alasanVoid: true,
      unggahDokumen: true,
      satker: {
        select: {
          kodeSatker: true,
          namaInstansi: true
        }
      }
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
          status: true,
          catatan: true
        }
      },
      satker: {
        select: {
          kodeSatker: true,
          namaInstansi: true
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

  if (!pengajuanVoid) throw new Error('Pengajuan Void tidak ditemukan')
  const updatePengajuanVoid = await prisma.pengajuanVoid.update({
    where: { id: Number(id) },
    data: {
      ...(dataVoid.noTelpon && { noTelpon: dataVoid.noTelpon }),
      ...(dataVoid.alasanVoid && { alasanVoid: dataVoid.alasanVoid }),
      ...(dataVoid.unggahDokumen && { unggahDokumen: dataVoid.unggahDokumen }),
      ...(dataVoid.extractedText && { extractedText: dataVoid.extractedText })
    }
  })

  if (pengajuanVoid.monitoring && pengajuanVoid.monitoring.length > 0) {
    const lastMonitoring = pengajuanVoid.monitoring.sort(
      (a, b) => b.id - a.id
    )[0]
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
