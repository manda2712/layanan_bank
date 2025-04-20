const prisma = require('../db')

async function findMonitoringPengajuanVoid () {
  const monitoring = await prisma.monitoringPengajuanVoid.findMany({
    select: {
      id: true,
      status: true,
      catatan: true,
      pengajuanVoidId: true,
      pengajuanVoid: {
        select: {
          kodeSatker: true,
          noTelpon: true,
          alasanVoid: true,
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
          kodeSatker: true,
          noTelpon: true,
          alasanVoid: true,
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

async function updateMonitoringPengajuanVoid (id, dataMonitoring) {
  const updatedMonitoring = await prisma.monitoringPengajuanVoid.update({
    where: { id: parseInt(id) },
    data: {
      status: dataMonitoring.status,
      catatan: dataMonitoring.catatan ?? null
    },
    include: {
      pengajuanVoid: {
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

async function deleteMonitoringPengajuanVoid (id) {
  return await prisma.$transaction(async prisma => {
    // Hapus monitoring dulu
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
  updateMonitoringPengajuanVoid,
  deleteMonitoringPengajuanVoid
}
