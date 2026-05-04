const prisma = require('../db')

async function insertRetur (dataRetur, userId, satkerId) {
  if (!userId) throw new Error('User ID tidak ditemukan!')

  return await prisma.returSp2d.create({
    data: {
      noTelpon: dataRetur.noTelpon,
      alasanRetur: dataRetur.alasanRetur,
      alasanLainnya: dataRetur.alasanLainnya || null,
      unggah_dokumen: dataRetur.unggah_dokumen,
      extractedText: dataRetur.extractedText,
      validationResult: dataRetur.validationResult,

      user: {
        connect: { id: userId }
      },

      satker: {
        connect: { id: satkerId }
      },

      monitoring: {
        create: {
          status: 'DIPROSES',
          hasilKmp: dataRetur.hasilAnalisis,
          catatan: null,
          user: { connect: { id: userId } },
          satker: { connect: { id: satkerId } }
        }
      }
    },
    include: { monitoring: true }
  })
}

async function findRetur (userId) {
  const returSp2d = await prisma.returSp2d.findMany({
    where: { userId: userId },
    select: {
      id: true,
      noTelpon: true,
      alasanRetur: true,
      alasanLainnya: true,
      unggah_dokumen: true,
      satker: {
        select: {
          kodeSatker: true,
          namaInstansi: true
        }
      }
    }
  })
  return returSp2d
}

async function findReturById (id, userId) {
  const returSp2d = await prisma.returSp2d.findFirst({
    where: { id: Number(id), userId: userId },
    include: {
      monitoring: {
        orderBy: { createdAt: 'desc' },
        take: 1,
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
  return returSp2d
}

async function editRetur (id, userId, dataRetur) {
  const oldData = await prisma.returSp2d.findUnique({
    where: { id: Number(id), userId: userId },
    include: { monitoring: true }
  })
  if (!oldData) throw new Error('Retur tidak ditemukan!')
  const updatedRetur = await prisma.returSp2d.update({
    where: { id: Number(id) },
    data: {
      ...(dataRetur.noTelpon && { noTelpon: dataRetur.noTelpon }),
      ...(dataRetur.alasanRetur && { alasanRetur: dataRetur.alasanRetur }),
      ...(dataRetur.alasanLainnya !== undefined && {
        alasanLainnya: dataRetur.alasanLainnya
      }),
      ...(dataRetur.unggah_dokumen && {
        unggah_dokumen: dataRetur.unggah_dokumen
      }),
      ...(dataRetur.extractedText && { extractedText: dataRetur.extractedText })
    },
    include: { satker: true }
  })
  if (oldData.monitoring && oldData.monitoring.length > 0) {
    const lastMonitoring = oldData.monitoring.sort((a, b) => b.id - a.id)[0]
    await prisma.monitoringReturSp2d.update({
      where: { id: lastMonitoring.id },
      data: { status: 'DIPROSES' }
    })
  }

  return updatedRetur
}
async function deleteDataRetur (id, userId) {
  await prisma.returSp2d.delete({
    where: {
      id: parseInt(id),
      userId: userId
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
