const prisma = require('../db')

async function findMonitoringKoreksiPenerimaan () {
  return await prisma.monitoringKoreksiPenerimaan.findMany({
    select: {
      id: true,
      koreksiPenerimaanId: true,
      status: true,
      catatan: true,
      koreksiPenerimaan: {
        select: {
          userId: true,
          noTelpon: true,
          tahunSetoran: true,
          tahunLainnya: true,
          unggahDokumen: true,
          user: { select: { namaLengkap: true } },
          satker: { select: { kodeSatker: true, namaInstansi: true } }
        }
      }
    },
    orderBy: {
      id: 'asc' // atau 'desc' kalau ingin terbaru di atas
    }
  })
}

async function findMonitoringKoreksiPenerimaanAdmin () {
  return await prisma.monitoringKoreksiPenerimaan.findMany({
    select: {
      id: true,
      koreksiPenerimaanId: true,
      status: true,
      catatan: true,
      hasilKmp: true,
      koreksiPenerimaan: {
        select: {
          noTelpon: true,
          tahunSetoran: true,
          tahunLainnya: true,
          unggahDokumen: true,
          user: { select: { namaLengkap: true } },
          satker: { select: { kodeSatker: true, namaInstansi: true } }
        }
      }
    },
    orderBy: {
      id: 'asc' // atau 'desc' kalau ingin terbaru di atas
    }
  })
}

async function findMonitoringKoreksiPenerimaanById (id) {
  const monitoring = await prisma.monitoringKoreksiPenerimaan.findUnique({
    where: { id: parseInt(id) },
    select: {
      id: true,
      koreksiPenerimaanId: true,
      status: true,
      catatan: true,
      hasilKmp: true,
      koreksiPenerimaan: {
        select: {
          id: true,
          noTelpon: true,
          tahunSetoran: true,
          tahunLainnya: true,
          unggahDokumen: true,
          user: {
            select: {
              kodeSatker: true,
              namaInstansi: true
            }
          },
          user: { select: { namaLengkap: true } }
        }
      }
    }
  })
  return monitoring
}

async function updateMonitoringKoreksiPenerimaan (id, dataMonitoring) {
  const monitoringId = parseInt(id)
  if (isNaN(monitoringId)) throw new Error('ID Monitoring tidak valid')

  return await prisma.monitoringKoreksiPenerimaan.update({
    where: { id: monitoringId },
    data: {
      ...(dataMonitoring.status && { status: dataMonitoring.status }),
      ...(dataMonitoring.hasOwnProperty('catatan') && {
        catatan: dataMonitoring.catatan
      })
    },
    include: {
      koreksiPenerimaan: {
        include: {
          user: { select: { namaLengkap: true } },
          satker: { select: { kodeSatker: true, namaInstansi: true } }
        }
      }
    }
  })
}

async function deletedMonitoringKoreksiPenerimaan (id) {
  return await prisma.$transaction(async prisma => {
    const deletedMonitoring = await prisma.monitoringKoreksiPenerimaan.delete({
      where: { id: parseInt(id) }
    })

    await prisma.koreksiPenerimaan.delete({
      where: { id: deletedMonitoring.koreksiPenerimaanId }
    })

    return deletedMonitoring
  })
}

module.exports = {
  findMonitoringKoreksiPenerimaan,
  findMonitoringKoreksiPenerimaanAdmin,
  findMonitoringKoreksiPenerimaanById,
  updateMonitoringKoreksiPenerimaan,
  deletedMonitoringKoreksiPenerimaan
}
