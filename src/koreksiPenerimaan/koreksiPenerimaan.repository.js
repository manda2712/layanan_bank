const prisma = require('../db')

const enumTahunMap = {
  2024: 'T2024',
  2025: 'T2025',
  LAINNYA: 'LAINNYA'
}

async function InsertKoreksiPenerimaan (dataKoreksi, userId) {
  if (!userId) throw new Error('User Id Tidak Ditemukan')
  const mappedTahun = enumTahunMap[dataKoreksi.tahunSetoran]
  if (!mappedTahun) {
    throw new Error('Tahun Setoran tidak valid!')
  }
  const newKoreksiPenerimaan = await prisma.koreksiPenerimaan.create({
    data: {
      kodeSatker: dataKoreksi.kodeSatker,
      noTelpon: dataKoreksi.noTelpon,
      tahunSetoran: mappedTahun,
      tahunLainnya: dataKoreksi.tahunLainnya || null,
      unggahDokumen: dataKoreksi.unggahDokumen,
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
  return newKoreksiPenerimaan
}

async function findKoreksiPenerimaan () {
  const koreksiPenerimaan = await prisma.koreksiPenerimaan.findMany({
    select: {
      id: true,
      kodeSatker: true,
      noTelpon: true,
      tahunSetoran: true,
      tahunLainnya: true,
      unggahDokumen: true
    }
  })
  return koreksiPenerimaan
}

async function findKoreksiPenerimaanById (id) {
  const koreksiPenerimaan = await prisma.koreksiPenerimaan.findFirst({
    where: {
      id: parseInt(id)
    },
    include: {
      monitoring: {
        select: {
          status: true
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

  if (!koreksiPenerimaan) {
    throw new Error('Koreksi Penerimaan tidak ditemukan')
  }

  if (!koreksiPenerimaan.unggahDokumen) {
    throw new Error('Dokumen baru harus diunggah setelah penolakan')
  }

  const updateKoreksiPenerimaan = await prisma.koreksiPenerimaan.update({
    where: { id: parseInt(id) },
    data: {
      unggahDokumen: dataKoreksi.unggahDokumen
    }
  })

  if (koreksiPenerimaan.monitoring && koreksiPenerimaan.monitoring.length > 0) {
    const lastMonitoring =
      koreksiPenerimaan.monitoring[koreksiPenerimaan.monitoring.length - 1]
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
