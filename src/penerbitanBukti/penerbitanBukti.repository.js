const prisma = require('../db')

async function InsertPenerbitanBukti (dataBukti, userId) {
  const newPenerbitan = await prisma.penerbitanBukti.create({
    data: {
      kodeSatker: dataBukti.kodeSatker,
      noTelpon: dataBukti.noTelpon,
      alasanRetur: dataBukti.alasanRetur,
      alasanLainnya: dataBukti.alasanLainnya || null,
      unggah_dokumen: dataBukti.unggah_dokumen,
      userId: userId,
      monitoring: {
        create: {
          status: 'DIPROSES',
          userId: userId
        }
      }
    },
    include: { monitoring: true }
  })
  return newPenerbitan
}

async function findPenerbitan () {
  const penerbitanBukti = await prisma.penerbitanBukti.findMany({
    select: {
      id: true,
      kodeSatker: true,
      noTelpon: true,
      alasanRetur: true,
      alasanLainnya: true,
      unggah_dokumen: true
    }
  })
  return penerbitanBukti
}

async function findPenerbitanBuktiById (id) {
  const penerbitanBukti = await prisma.penerbitanBukti.findFirst({
    where: {
      id: parseInt(id)
    },
    include: {
      monitoring: {
        select: {
          status: true
        }
      }
    }
  })
  return penerbitanBukti
}

async function editPenerbitanBukti (id, dataBukti) {
  const penerbitanBukti = await prisma.penerbitanBukti.findUnique({
    where: {
      id: parseInt(id)
    },
    include: {
      monitoring: true
    }
  })

  if (!penerbitanBukti) {
    throw new Error(`Penerbitan Bukti tidak ditemukan`)
  }

  if (!dataBukti.unggah_dokumen) {
    throw new Error('Dokumen Baru harus diubah setelah penolakan')
  }

  const updateBukti = await prisma.penerbitanBukti.update({
    where: { id: parseInt(id) },
    data: {
      unggah_dokumen: dataBukti.unggah_dokumen
    }
  })

  if (penerbitanBukti.monitoring && penerbitanBukti.monitoring.length > 0) {
    const lastMonitoring =
      penerbitanBukti.monitoring[penerbitanBukti.monitoring.length - 1]
    await prisma.monitoringPenerbitanBukti.update({
      where: { id: lastMonitoring.id },
      data: {
        status: 'DIPROSES'
      }
    })
  }
  return updateBukti
}

async function deletePenerbitanBukti (id) {
  await prisma.penerbitanBukti.delete({
    where: {
      id: parseInt(id)
    }
  })
}

module.exports = {
  InsertPenerbitanBukti,
  findPenerbitan,
  findPenerbitanBuktiById,
  editPenerbitanBukti,
  deletePenerbitanBukti
}
