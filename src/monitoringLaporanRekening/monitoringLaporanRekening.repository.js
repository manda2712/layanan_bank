const prisma = require('../db')

async function findMonitoringLaporanRekening () {
  return await prisma.monitoringLaporanRekening.findMany({
    select: {
      id: true,
      laporanRekeningId: true,
      status: true,
      catatan: true,
      laporanRekening: {
        select: {
          userId: true,
          noTelpon: true,
          jenisLaporan: true,
          unggahDokumen: true,
          user: { select: { namaLengkap: true } },
          satker: { select: { kodeSatker: true, namaInstansi: true } }
        }
      }
    }
  })
}

async function findMonitoringLaporanRekeningForAdmin () {
  return await prisma.monitoringLaporanRekening.findMany({
    select: {
      id: true,
      laporanRekeningId: true,
      status: true,
      catatan: true,
      hasilKmp: true,
      laporanRekening: {
        select: {
          noTelpon: true,
          jenisLaporan: true,
          unggahDokumen: true,
          extractedText: true,
          user: { select: { namaLengkap: true } },
          satker: { select: { kodeSatker: true, namaInstansi: true } }
        }
      }
    }
  })
}

async function findMonitoringLaporanRekeningById (id) {
  return await prisma.monitoringLaporanRekening.findUnique({
    where: { id: parseInt(id) },
    select: {
      id: true,
      laporanRekeningId: true,
      status: true,
      catatan: true,
      laporanRekening: {
        select: {
          noTelpon: true,
          jenisLaporan: true,
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

async function updateMonitoringLaporanRekening (id, dataMonitoring) {
  const monitoringId = parseInt(id)
  return await prisma.monitoringLaporanRekening.update({
    where: { id: monitoringId },
    data: {
      ...(dataMonitoring.status && { status: dataMonitoring.status }),
      ...(dataMonitoring.hasOwnProperty('catatan') && {
        catatan: dataMonitoring.catatan
      })
    },
    include: {
      laporanRekening: {
        include: {
          user: { select: { namaLengkap: true } },
          satker: { select: { kodeSatker: true, namaInstansi: true } }
        }
      }
    }
  })
}

async function deletedMonitoringLaporanRekening (id) {
  return await prisma.$transaction(async prisma => {
    const deletedMonitoring = await prisma.monitoringLaporanRekening.delete({
      where: { id: parseInt(id) }
    })

    await prisma.laporanRekening.delete({
      where: { id: deletedMonitoring.laporanRekeningId }
    })
    return deletedMonitoring
  })
}

module.exports = {
  findMonitoringLaporanRekening,
  findMonitoringLaporanRekeningById,
  findMonitoringLaporanRekeningForAdmin,
  updateMonitoringLaporanRekening,
  deletedMonitoringLaporanRekening
}
