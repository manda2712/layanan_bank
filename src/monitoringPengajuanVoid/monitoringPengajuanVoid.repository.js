const prisma = require('../db')

async function findMonitoringPengajuanVoid () {
  return await prisma.monitoringPengajuanVoid.findMany({
    select: {
      id: true,
      status: true,
      catatan: true,
      pengajuanVoidId: true,
      pengajuanVoid: {
        select: {
          userId: true,
          noTelpon: true,
          alasanVoid: true,
          unggahDokumen: true,
          user: { select: { namaLengkap: true } },
          satker: { select: { kodeSatker: true, namaInstansi: true } }
        }
      }
    }
  })
}

async function findMonitoringPengajuanVoidAdmin () {
  return await prisma.monitoringPengajuanVoid.findMany({
    select: {
      id: true,
      status: true,
      catatan: true,
      hasilKmp: true,
      pengajuanVoidId: true,
      pengajuanVoid: {
        select: {
          noTelpon: true,
          alasanVoid: true,
          extractedText: true,
          unggahDokumen: true,
          user: { select: { namaLengkap: true } },
          satker: { select: { kodeSatker: true, namaInstansi: true } }
        }
      }
    }
  })
}

async function findMonitoringPengujuanVoidById (id) {
  const monitoring = await prisma.monitoringPengajuanVoid.findUnique({
    where: { id: parseInt(id) },
    select: {
      id: true,
      pengajuanVoidId: true,
      status: true,
      catatan: true,
      pengajuanVoid: {
        select: {
          noTelpon: true,
          alasanVoid: true,
          unggahDokumen: true,
          userId: true,
          satker: {
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

async function updateMonitoringPengajuanVoid (id, dataMonitoring) {
  const monitoringId = parseInt(id)
  if (isNaN(monitoringId)) throw new Error('ID Monitoring tidak valid')
  return await prisma.monitoringPengajuanVoid.update({
    where: { id: parseInt(id) },
    data: {
      ...(dataMonitoring.status && { status: dataMonitoring.status }),
      ...(dataMonitoring.hasOwnProperty('catatan') && {
        catatan: dataMonitoring.catatan
      })
    },
    include: {
      pengajuanVoid: {
        include: {
          user: { select: { namaLengkap: true } },
          satker: { select: { kodeSatker: true, namaInstansi: true } }
        }
      }
    }
  })
}

async function deleteMonitoringPengajuanVoid (id) {
  return await prisma.$transaction(async prisma => {
    const deletedMonitoring = await prisma.monitoringPengajuanVoid.delete({
      where: { id: parseInt(id) }
    })

    // Hapus returSp2d yang terkait
    await prisma.pengajuanVoid.delete({
      where: { id: deletedMonitoring.pengajuanVoidId }
    })

    return deletedMonitoring
  })
}

module.exports = {
  findMonitoringPengajuanVoid,
  findMonitoringPengujuanVoidById,
  findMonitoringPengajuanVoidAdmin,
  updateMonitoringPengajuanVoid,
  deleteMonitoringPengajuanVoid
}
