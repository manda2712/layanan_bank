const prisma = require('../db')
// const {
//   editKoreksiPenerimaan
// } = require('../koreksiPenerimaan/koreksiPenerimaan.repository')

async function findMonitoringPengembalianPfk () {
  const monitoring = await prisma.monitoringPengembalianPfk.findMany({
    select: {
      id: true,
      status: true,
      catatan : true,
      pengembalianPfkId: true,
      pengembalianPfk: {
        select: {
          pihakMengajukan: true,
          kodeSatker: true,
          noTelpon: true,
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

async function findMonitoringPengembalianPfkById (id) {
  const monitoring = await prisma.monitoringPengembalianPfk.findUnique({
    where: { id: parseInt(id) },
    select: {
      id: true,
      pengembalianPfkId: true,
      status: true,
      catatan: true,
      pengembalianPfk: {
        select: {
          pihakMengajukan: true,
          kodeSatker: true,
          noTelpon: true,
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

async function updateMonitoringPengembalianPfk (id, dataMonitoring) {
  const updatedMonitoring = await prisma.monitoringPengembalianPfk.update({
    where: { id: parseInt(id) },
    data: {
      status: dataMonitoring.status,
      catatan: dataMonitoring.catatan ?? null
    },
    include: {
      pengembalianPfk: {
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

async function deleteMonitoringPengembalianPfk (id) {
  return await prisma.$transaction(async prisma => {
    // Hapus monitoring dulu
    const deletedMonitoring = await prisma.monitoringPengembalianPfk.delete({
      where: { id: parseInt(id) }
    })

    // Hapus returSp2d yang terkait
    await prisma.pengembalianPfk.delete({
      where: { id: deletedMonitoring.pengembalianPfkId }
    })

    return deletedMonitoring
  })
}

module.exports = {
  findMonitoringPengembalianPfk,
  findMonitoringPengembalianPfkById,
  updateMonitoringPengembalianPfk,
  deleteMonitoringPengembalianPfk
}
