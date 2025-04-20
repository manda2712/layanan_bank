const prisma = require('../db')

async function findMonitoringKoreksiPenerimaan () {
  const monitoring = await prisma.monitoringKoreksiPenerimaan.findMany({
    select: {
      id: true,
      koreksiPenerimaanId: true,
      status: true,
      catatan: true,
      koreksiPenerimaan: {
        select: {
          kodeSatker: true,
          noTelpon: true,
          tahunSetoran: true,
          tahunLainnya: true,
          unggahDokumen: true,
          user: {
            select: {
              namaLengkap: true
            }
          }
        }
      }
    }
  })
  return monitoring
}

async function findMonitoringKoreksiPenerimaanById (id) {
  const monitoring = await prisma.monitoringKoreksiPenerimaan.findUnique({
    where: { id: parseInt(id) },
    select: {
      id: true,
      koreksiPenerimaanId: true,
      status: true,
      catatan: true,
      koreksiPenerimaan: {
        select: {
          kodeSatker: true,
          noTelpon: true,
          tahunSetoran: true,
          tahunLainnya: true,
          unggahDokumen: true,
          user: {
            select: {
              namaLengkap: true
            }
          }
        }
      }
    }
  })
  return monitoring
}

async function updateMonitoringKoreksiPenerimaan (id, dataMonitoring) {
  const updatedMonitoring = await prisma.monitoringKoreksiPenerimaan.update({
    where: { id: parseInt(id) },
    data: {
      status: dataMonitoring.status,
      catatan: dataMonitoring.catatan ?? null
    },
    include: {
      koreksiPenerimaan: {
        include: {
          user: {
            select: {
              namaLengkap: true
            }
          }
        }
      }
    }
  })
  return updatedMonitoring
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
  findMonitoringKoreksiPenerimaanById,
  updateMonitoringKoreksiPenerimaan,
  deletedMonitoringKoreksiPenerimaan
}
