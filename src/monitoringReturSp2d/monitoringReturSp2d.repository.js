const prisma = require('../db')

async function findMonitoringReturSp2d () {
  const monitoring = await prisma.monitoringReturSp2d.findMany({
    select: {
      id: true,
      returSp2dId: true,
      status: true,
      catatan: true,
      returSp2d: {
        select: {
          kodeSatker: true,
          noTelpon: true,
          alasanRetur: true,
          alasanLainnya:true,
          unggah_dokumen: true,
          user: {
            select: {
              namaLengkap: true
            }
          }
        }
      }
    },
    orderBy: {
      id: 'asc' // atau 'desc' kalau ingin terbaru di atas
    }
  })
  return monitoring
}

async function findMonitoringReturSp2dById (id) {
  const monitoring = await prisma.monitoringReturSp2d.findUnique({
    where: { id: parseInt(id) },
    select: {
      id: true,
      returSp2dId: true,
      status: true,
      catatan: true,
      returSp2d: {
        select: {
          kodeSatker: true,
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
  return monitoring
}

async function updatedMonitoringReturSp2d (id, dataMonitoring) {
  console.log('DATA MASUK PATCH:', dataMonitoring) // ⬅️ Tambahkan ini
  const updatedMonitoring = await prisma.monitoringReturSp2d.update({
    where: { id: parseInt(id) },
    data: {
      status: dataMonitoring.status,
      catatan: dataMonitoring.catatan ?? null
    },
    include: {
      returSp2d: {
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

async function deleteMonitoringReturSp2d (id) {
  return await prisma.$transaction(async prisma => {
    // Hapus monitoring dulu
    const deletedMonitoring = await prisma.monitoringReturSp2d.delete({
      where: { id: parseInt(id) }
    })

    // Hapus returSp2d yang terkait
    await prisma.returSp2d.delete({
      where: { id: deletedMonitoring.returSp2dId }
    })

    return deletedMonitoring
  })
}

module.exports = {
  findMonitoringReturSp2d,
  findMonitoringReturSp2dById,
  updatedMonitoringReturSp2d,
  deleteMonitoringReturSp2d
}
