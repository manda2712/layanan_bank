const prisma = require('../db')

const enumTahunMap = {
  2024: 'T2024',
  2025: 'T2025',
  LAINNYA: 'LAINNYA'
}

async function InsertKoreksiPenerimaan (dataKoreksi, userId, satkerId) {
  const mappedTahun = enumTahunMap[dataKoreksi.tahunSetoran]
  if (!mappedTahun) {
    throw new Error('Tahun Setoran tidak valid!')
  }
  return await prisma.koreksiPenerimaan.create({
    data: {
      noTelpon: dataKoreksi.noTelpon,
      tahunSetoran: mappedTahun,
      tahunLainnya: dataKoreksi.tahunLainnya || null,
      unggahDokumen: dataKoreksi.unggahDokumen,
      extractedText: dataKoreksi.extractedText,
      user: {
        connect: { id: userId }
      },
      satker: {
        connect: { id: satkerId }
      },
      monitoring: {
        create: {
          status: 'DIPROSES',
          hasilKmp: dataKoreksi.hasilAnalisis,
          user: { connect: { id: userId } },
          satker: { connect: { id: satkerId } }
        }
      }
    },
    include: { monitoring: true }
  })
}

async function findKoreksiPenerimaan () {
  const koreksiPenerimaan = await prisma.koreksiPenerimaan.findMany({
    select: {
      id: true,
      noTelpon: true,
      tahunSetoran: true,
      tahunLainnya: true,
      unggahDokumen: true,
      satker: {
        select: {
          kodeSatker: true,
          namaInstansi: true
        }
      }
    }
  })
  return koreksiPenerimaan
}

async function findKoreksiPenerimaanById (id) {
  const koreksiPenerimaan = await prisma.koreksiPenerimaan.findFirst({
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
  return koreksiPenerimaan
}

async function editKoreksiPenerimaan (id, dataKoreksi) {
  const koreksiPenerimaan = await prisma.koreksiPenerimaan.findUnique({
    where: { id: parseInt(id) },
    include: { monitoring: true }
  })

  if (!koreksiPenerimaan) throw new Error('Koreksi Penerimaan tidak ditemukan')

  if (!koreksiPenerimaan.unggahDokumen) {
    throw new Error('Dokumen baru harus diunggah setelah penolakan')
  }
  const updateKoreksiPenerimaan = await prisma.koreksiPenerimaan.update({
    where: { id: parseInt(id) },
    data: {
      ...(dataKoreksi.noTelpon && { noTelpon: dataKoreksi.noTelpon }),
      ...(dataKoreksi.tahunSetoran && {
        tahunSetoran: dataKoreksi.tahunSetoran
      }),
      ...(dataKoreksi.tahunLainnya !== undefined && {
        tahunLainnya: dataKoreksi.tahunLainnya
      }),
      ...(dataKoreksi.unggahDokumen && {
        unggahDokumen: dataKoreksi.unggahDokumen
      }),
      ...(dataKoreksi.extractedText && {
        extractedText: dataKoreksi.extractedText
      })
    },
    include: { satker: true }
  })

  if (koreksiPenerimaan.monitoring && koreksiPenerimaan.monitoring.length > 0) {
    const lastMonitoring = koreksiPenerimaan.monitoring.sort(
      (a, b) => b.id - a.id
    )[0]
    await prisma.monitoringKoreksiPenerimaan.update({
      where: { id: lastMonitoring.id },
      data: {
        status: 'DIPROSES'
      }
    })
  }
  return updateKoreksiPenerimaan
}

async function deleteKoreksiPenerimaan (id) {
  await prisma.koreksiPenerimaan.delete({
    where: {
      id: parseInt(id)
    }
  })
}

module.exports = {
  InsertKoreksiPenerimaan,
  findKoreksiPenerimaan,
  findKoreksiPenerimaanById,
  editKoreksiPenerimaan,
  deleteKoreksiPenerimaan
}
