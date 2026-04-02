const prisma = require('../db')

async function findMonitoringPembukaanRekening () {
  return await prisma.monitoringPembukaanRekening.findMany({
    select: {
      id: true,
      pembukaanRekeningId: true,
      status: true,
      catatan: true,
      pembukaanRekening: {
        select: {
          userId: true,
          noTelpon: true,
          jenisRekening: true,
          unggahDokumen: true,
          user: { select: { namaLengkap: true } },
          satker: { select: { kodeSatker: true, namaInstansi: true } }
        }
      }
    },
    orderBy: { id: 'desc' }
  })
}

async function findMonitoringPembukaanRekeningForAdmin () {
  return await prisma.monitoringPembukaanRekening.findMany({
    select: {
      id: true,
      pembukaanRekeningId: true,
      status: true,
      catatan: true,
      hasilKmp: true,
      pembukaanRekening: {
        select: {
          noTelpon: true,
          jenisRekening: true,
          unggahDokumen: true,
          extractedText: true,
          user: { select: { namaLengkap: true } },
          satker: { select: { kodeSatker: true, namaInstansi: true } }
        }
      }
    },
    orderBy: { id: 'desc' }
  })
}

async function findMonitoringPembukaanRekeningById (id) {
  return await prisma.monitoringPembukaanRekening.findUnique({
    where: { id: parseInt(id) },
    select: {
      id: true,
      pembukaanRekeningId: true,
      status: true,
      catatan: true,
      pembukaanRekening: {
        select: {
          noTelpon: true,
          jenisRekening: true,
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
}

async function updateMonitoringPembukaanRekening (id, dataMonitoring) {
  const monitoringId = parseInt(id)
  if (isNaN(monitoringId)) throw new Error('ID Monitoring tidak valid')

  return await prisma.monitoringPembukaanRekening.update({
    where: { id: monitoringId },
    data: {
      ...(dataMonitoring.status && { status: dataMonitoring.status }),
      ...(dataMonitoring.hasOwnProperty('catatan') && {
        catatan: dataMonitoring.catatan
      })
    },
    include: {
      pembukaanRekening: {
        include: {
          user: { select: { namaLengkap: true } },
          satker: { select: { kodeSatker: true, namaInstansi: true } }
        }
      }
    }
  })
}

async function deleteMonitoringPembukaanRekening (id) {
  return await prisma.$transaction(async prisma => {
    const deletedMonitoring = await prisma.monitoringPembukaanRekening.delete({
      where: { id: parseInt(id) }
    })
    await prisma.pembukaanRekening.delete({
      where: { id: deletedMonitoring.pembukaanRekeningId }
    })

    return deletedMonitoring
  })
}

module.exports = {
  findMonitoringPembukaanRekening,
  findMonitoringPembukaanRekeningById,
  findMonitoringPembukaanRekeningForAdmin,
  updateMonitoringPembukaanRekening,
  deleteMonitoringPembukaanRekening
}
