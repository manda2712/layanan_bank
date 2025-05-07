const prisma = require('../db')

async function findMonitoringPenerbitanNota () {
  const monitoring = await prisma.monitoringPenerbitanNota.findMany({
    select: {
      id: true,
      status: true,
      catatan: true,
      penerbitanNotaId: true,
      penerbitanNota: {
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

async function findMonitoringPenerbitanNotaById (id) {
  const monitoring = await prisma.monitoringPenerbitanNota.findUnique({
    where: { id: parseInt(id) },
    select: {
      id: true,
      penerbitanNotaId: true,
      status: true,
      catatan: true,
      penerbitanNota: {
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

async function updatedMonitoringPenerbitanNota (id, dataMonitoring) {
  const updatedMonitoring = await prisma.monitoringPenerbitanNota.update({
    where: { id: parseInt(id) },
    data: {
      status: dataMonitoring.status,
      catatan: dataMonitoring.catatan ?? null
    },
    include: {
      penerbitanNota: {
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

async function deleteMonitoringPenerbitanNota (id) {
  return await prisma.$transaction(async prisma => {
    // Hapus monitoring dulu
    const deletedMonitoring = await prisma.monitoringPenerbitanNota.delete({
      where: { id: parseInt(id) }
    })

    // Hapus returSp2d yang terkait
    await prisma.penerbitanNota.delete({
      where: { id: deletedMonitoring.penerbitanNotaId }
    })

    return deletedMonitoring
  })
}

module.exports = {
  findMonitoringPenerbitanNota,
  findMonitoringPenerbitanNotaById,
  updatedMonitoringPenerbitanNota,
  deleteMonitoringPenerbitanNota
}
