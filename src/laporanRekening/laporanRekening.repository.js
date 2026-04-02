const prisma = require('../db')

async function insertLaporanRekening (dataLaporan, userId, satkerId) {
  if (!userId) throw new Error('User Id Tidak Ditemukan')

  return await prisma.laporanRekening.create({
    data: {
      noTelpon: dataLaporan.noTelpon,
      jenisLaporan: dataLaporan.jenisLaporan,
      unggahDokumen: dataLaporan.unggahDokumen,
      extractedText: dataLaporan.extractedText,
      validationResult: dataLaporan.validationResult,
      user: {
        connect: { id: userId }
      },

      satker: {
        connect: { id: satkerId }
      },
      monitoring: {
        create: {
          status: 'DIPROSES',
          hasilKmp: dataLaporan.hasilAnalisis,
          catatan: null,
          user: { connect: { id: userId } },
          satker: { connect: { id: satkerId } }
        }
      }
    },
    include: { monitoring: true }
  })
}

async function findLaporanRekening () {
  const laporanRekening = await prisma.laporanRekening.findMany({
    select: {
      id: true,
      noTelpon: true,
      jenisLaporan: true,
      unggahDokumen: true,
      satker: {
        select: {
          kodeSatker: true,
          namaInstansi: true
        }
      }
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

  const updateLaporanRekening = await prisma.laporanRekening.update({
    where: { id: parseInt(id) },
    data: {
      ...(dataLaporan.noTelpon && { noTelpon: dataLaporan.noTelpon }),
      ...(dataLaporan.jenisLaporan && {
        jenisLaporan: dataLaporan.jenisLaporan
      }),
      ...(dataLaporan.unggahDokumen && {
        unggahDokumen: dataLaporan.unggahDokumen
      }),
      ...(dataLaporan.extractedText && {
        extractedText: dataLaporan.extractedText
      })
    }
  })

  if (laporanRekening.monitoring && laporanRekening.monitoring.length > 0) {
    const lastMonitoring = laporanRekening.monitoring.sort(
      (a, b) => b.id - a.id
    )[0]
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
