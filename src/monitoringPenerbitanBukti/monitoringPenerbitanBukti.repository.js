const prisma = require('../db')

async function findMonitoringPenerbitanBukti () {
  return await prisma.monitoringPenerbitanBukti.findMany({
    select: {
      id: true,
      status: true,
      catatan: true,
      penerbitanBuktiId: true,
      penerbitanBukti: {
        select: {
          userId: true,
          noTelpon: true,
          unggah_dokumen: true,
          user: { select: { namaLengkap: true } },
          satker: { select: { kodeSatker: true, namaInstansi: true } }
        }
      }
    },
    orderBy: { id: 'desc' }
  })
}

async function findMonitoringPenerbitanBuktiAdmin () {
  return await prisma.monitoringPenerbitanBukti.findMany({
    select: {
      id: true,
      status: true,
      catatan: true,
      hasilKmp: true,
      penerbitanBuktiId: true,
      penerbitanBukti: {
        select: {
          userId: true,
          noTelpon: true,
          unggah_dokumen: true,
          user: { select: { namaLengkap: true } },
          satker: { select: { kodeSatker: true, namaInstansi: true } }
        }
      }
    },
    orderBy: { id: 'desc' }
  })
}

async function findMonitoringPenerbitanBuktiById (id) {
  return await prisma.monitoringPenerbitanBukti.findUnique({
    where: { id: parseInt(id) },
    select: {
      id: true,
      penerbitanBuktiId: true,
      status: true,
      catatan: true,
      penerbitanBukti: {
        select: {
          noTelpon: true,
          unggah_dokumen: true,
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
}

async function updatedMonitoringPenerbitanBukti (id, dataMonitoring) {
  const monitoringId = parseInt(id)
  if (isNaN(monitoringId)) throw new Error('ID Monitoring tidak valid')

  return await prisma.monitoringPenerbitanBukti.update({
    where: { id: parseInt(id) },
    data: {
      ...(dataMonitoring.status && { status: dataMonitoring.status }),
      ...(dataMonitoring.hasOwnProperty('catatan') && {
        catatan: dataMonitoring.catatan
      })
    },
    include: {
      penerbitanBukti: {
        include: {
          user: { select: { namaLengkap: true } },
          satker: { select: { kodeSatker: true, namaInstansi: true } }
        }
      }
    }
  })
}

async function deleteMonitoringPenerbitanBukti (id) {
  return await prisma.$transaction(async prisma => {
    // Hapus monitoring dulu
    const deletedMonitoring = await prisma.monitoringPenerbitanBukti.delete({
      where: { id: parseInt(id) }
    })

    // Hapus returSp2d yang terkait
    await prisma.penerbitanBukti.delete({
      where: { id: deletedMonitoring.penerbitanBuktiId }
    })

    return deletedMonitoring
  })
}

module.exports = {
  findMonitoringPenerbitanBukti,
  findMonitoringPenerbitanBuktiById,
  updatedMonitoringPenerbitanBukti,
  findMonitoringPenerbitanBuktiAdmin,
  deleteMonitoringPenerbitanBukti
}
