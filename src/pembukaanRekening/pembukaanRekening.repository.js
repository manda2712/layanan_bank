const prisma = require('../db')

async function insertPembukaanRekening (dataRekening, userId, satkerId) {
  if (!userId) throw new Error('User ID tidak ditemukan!')

  return await prisma.pembukaanRekening.create({
    data: {
      noTelpon: dataRekening.noTelpon,
      jenisRekening: dataRekening.jenisRekening,
      unggahDokumen: dataRekening.unggahDokumen,
      extractedText: dataRekening.extractedText,
      validationResult: dataRekening.validationResult,
      user: {
        connect: { id: userId }
      },

      satker: {
        connect: { id: satkerId }
      },
      monitoring: {
        create: {
          status: 'DIPROSES',
          hasilKmp: dataRekening.hasilAnalisis,
          catatan: null,
          user: { connect: { id: userId } },
          satker: { connect: { id: satkerId } }
        }
      }
    },
    include: { monitoring: true }
  })
}

async function findPembukaanRekening () {
  const pembukaanRekening = await prisma.pembukaanRekening.findMany({
    select: {
      id: true,
      noTelpon: true,
      jenisRekening: true,
      unggahDokumen: true,
      satker: {
        select: {
          kodeSatker: true,
          namaInstansi: true
        }
      }
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
  return pembukaanRekening
}

async function editPembukaanRekening (id, dataRekening) {
  const pembukaanRekening = await prisma.pembukaanRekening.findUnique({
    where: {
      id: parseInt(id)
    },
    include: { monitoring: true }
  })

  if (!pembukaanRekening) throw new Error('Pembukaan Rekening ditemukan')

  const updatePembukaanRekening = await prisma.pembukaanRekening.update({
    where: { id: parseInt(id) },
    data: {
      ...(dataRekening.noTelpon && { noTelpon: dataRekening.noTelpon }),
      ...(dataRekening.jenisRekening && {
        jenisRekening: dataRekening.jenisRekening
      }),
      ...(dataRekening.unggahDokumen && {
        unggahDokumen: dataRekening.unggahDokumen
      }),
      ...(dataRekening.extractedText && {
        extractedText: dataRekening.extractedText
      })
    }
  })

  if (pembukaanRekening.monitoring && pembukaanRekening.monitoring.length > 0) {
    const lastMonitoring = pembukaanRekening.monitoring.sort(
      (a, b) => b.id - a.id
    )[0]
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
