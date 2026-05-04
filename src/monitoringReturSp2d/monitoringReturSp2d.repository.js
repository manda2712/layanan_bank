const prisma = require('../db')

async function findMonitoringReturSp2d () {
  return await prisma.monitoringReturSp2d.findMany({
    select: {
      id: true,
      returSp2dId: true,
      status: true,
      catatan: true,
      returSp2d: {
        select: {
          userId: true,
          noTelpon: true,
          alasanRetur: true,
          alasanLainnya: true,
          unggah_dokumen: true,
          user: { select: { namaLengkap: true } },
          satker: { select: { kodeSatker: true, namaInstansi: true } }
        }
      }
    }
  })
}

async function findMonitoringForAdmin () {
  return await prisma.monitoringReturSp2d.findMany({
    select: {
      id: true,
      returSp2dId: true,
      status: true,
      catatan: true,
      hasilKmp: true,
      createdAt: true,
      returSp2d: {
        select: {
          noTelpon: true,
          alasanRetur: true,
          alasanLainnya: true,
          extractedText: true,
          unggah_dokumen: true,
          user: { select: { namaLengkap: true } },
          satker: { select: { kodeSatker: true, namaInstansi: true } } // Perbaikan relasi satker
        }
      }
    }
  })
}

async function findMonitoringReturSp2dById (id) {
  return await prisma.monitoringReturSp2d.findUnique({
    where: { id: parseInt(id) },
    select: {
      id: true,
      returSp2dId: true,
      status: true,
      catatan: true,
      returSp2d: {
        select: {
          id: true,
          noTelpon: true,
          alasanRetur: true,
          alasanLainnya: true,
          unggah_dokumen: true,
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

async function updatedMonitoringReturSp2d (id, dataMonitoring) {
  const monitoringId = parseInt(id)
  if (isNaN(monitoringId)) throw new Error('ID Monitoring tidak valid')

  return await prisma.monitoringReturSp2d.update({
    where: { id: monitoringId },
    data: {
      ...(dataMonitoring.status && { status: dataMonitoring.status }),
      ...(dataMonitoring.hasOwnProperty('catatan') && {
        catatan: dataMonitoring.catatan
      })
    },
    include: {
      returSp2d: {
        include: {
          user: { select: { namaLengkap: true } },
          satker: { select: { kodeSatker: true, namaInstansi: true } }
        }
      }
    }
  })
}

async function deleteMonitoringReturSp2d (id) {
  return await prisma.$transaction(async tx => {
    const deletedMonitoring = await tx.monitoringReturSp2d.delete({
      where: { id: parseInt(id) }
    })

    await tx.returSp2d.delete({
      where: { id: deletedMonitoring.returSp2dId }
    })

    return deletedMonitoring
  })
}

module.exports = {
  findMonitoringReturSp2d,
  findMonitoringReturSp2dById,
  updatedMonitoringReturSp2d,
  findMonitoringForAdmin,
  deleteMonitoringReturSp2d
}
