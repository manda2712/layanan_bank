const prisma = require('../db')

async function findMonitoringPenerbitanNota () {
  return await prisma.monitoringPenerbitanNota.findMany({
    select: {
      id: true,
      status: true,
      catatan: true,
      penerbitanNotaId: true,
      penerbitanNota: {
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
    orderBy: { id: 'desc' }
  })
}

async function findMonitoringPenerbitanNotaAdmin () {
  return await prisma.monitoringPenerbitanNota.findMany({
    select: {
      id: true,
      penerbitanNotaId: true,
      status: true,
      catatan: true,
      hasilKmp: true,
      penerbitanNota: {
        select: {
          userId: true,
          noTelpon: true,
          tahunSetoran: true,
          tahunLainnya: true,
          extractedText: true,
          unggahDokumen: true,
          user: { select: { namaLengkap: true } },
          satker: { select: { kodeSatker: true, namaInstansi: true } }
        }
      }
    },
    orderBy: { id: 'desc' }
  })
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
          noTelpon: true,
          tahunSetoran: true,
          tahunLainnya: true,
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

async function updatedMonitoringPenerbitanNota (id, dataMonitoring) {
  const monitoringId = parseInt(id)
  if (isNaN(monitoringId)) throw new Error('ID Monitoring tidak valid')
  return await prisma.monitoringPenerbitanNota.update({
    where: { id: monitoringId },
    data: {
      ...(dataMonitoring.status && { status: dataMonitoring.status }),
      ...(dataMonitoring.hasOwnProperty('catatan') && {
        catatan: dataMonitoring.catatan
      })
    },
    include: {
      penerbitanNota: {
        include: {
          user: { select: { namaLengkap: true } },
          satker: { select: { kodeSatker: true, namaInstansi: true } }
        }
      }
    }
  })
}

async function deleteMonitoringPenerbitanNota (id) {
  return await prisma.$transaction(async prisma => {
    const deletedMonitoring = await prisma.monitoringPenerbitanNota.delete({
      where: { id: parseInt(id) }
    })

    await prisma.penerbitanNota.delete({
      where: { id: deletedMonitoring.penerbitanNotaId }
    })

    return deletedMonitoring
  })
}

module.exports = {
  findMonitoringPenerbitanNota,
  findMonitoringPenerbitanNotaAdmin,
  findMonitoringPenerbitanNotaById,
  updatedMonitoringPenerbitanNota,
  deleteMonitoringPenerbitanNota
}
