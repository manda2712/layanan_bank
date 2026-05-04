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

async function findKoreksiPenerimaan (userId) {
  const koreksiPenerimaan = await prisma.koreksiPenerimaan.findMany({
    where: { userId: userId },
    select: {
      id: true,
      noTelpon: true,
      tahunSetoran: true,
      tahunLainnya: true,
      unggahDokumen: true,
      user: {
        select: {
          namaLengkap: true
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

async function findKoreksiPenerimaanById (id, userId) {
  const koreksiPenerimaan = await prisma.koreksiPenerimaan.findFirst({
    where: {
      id: Number(id),
      userId: userId
    },
    include: {
      user: {
        select: {
          namaLengkap: true
        }
      },
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

async function editKoreksiPenerimaan (id, userId, dataKoreksi) {
  const koreksiPenerimaan = await prisma.koreksiPenerimaan.findUnique({
    where: { id: parseInt(id), userId: userId },
    include: { monitoring: true }
  })

  if (!koreksiPenerimaan) throw new Error('Koreksi Penerimaan tidak ditemukan')

  // Logika Pemetaan Tahun (Sama seperti di fungsi Insert)
  let mappedTahun
  if (dataKoreksi.tahunSetoran) {
    mappedTahun = enumTahunMap[dataKoreksi.tahunSetoran]

    // Jika user mengirim 'T2025' langsung dari frontend, pastikan tidak error
    if (!mappedTahun && dataKoreksi.tahunSetoran.startsWith('T')) {
      mappedTahun = dataKoreksi.tahunSetoran
    }

    if (!mappedTahun) throw new Error('Tahun Setoran tidak valid!')
  }

  const updateKoreksiPenerimaan = await prisma.koreksiPenerimaan.update({
    where: { id: parseInt(id) },
    data: {
      ...(dataKoreksi.noTelpon && { noTelpon: dataKoreksi.noTelpon }),
      // GUNAKAN mappedTahun DISINI
      ...(mappedTahun && { tahunSetoran: mappedTahun }),
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

  // ... (sisa kode monitoring tetap sama)
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

async function deleteKoreksiPenerimaan (id, userId) {
  await prisma.koreksiPenerimaan.delete({
    where: {
      id: parseInt(id),
      userId: userId
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
