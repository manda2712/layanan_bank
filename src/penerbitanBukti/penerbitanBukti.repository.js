const prisma = require('../db')

async function InsertPenerbitanBukti (dataBukti, userId, satkerId) {
  if (!userId) throw new Error('User ID tidak ditemukan')
  if (!satkerId) throw new Error('Satker ID tidak ditemukan')
  return prisma.penerbitanBukti.create({
    data: {
      noTelpon: dataBukti.noTelpon,
      unggah_dokumen: dataBukti.unggah_dokumen,
      extractedText: dataBukti.extractedText,
      validationResult: dataBukti.validationResult,
      satkerId: parseInt(satkerId),
      userId: parseInt(userId),
      monitoring: {
        create: {
          status: 'DIPROSES',
          hasilKmp: dataBukti.hasilAnalisis,
          catatan: null,
          dokumenAdmin: dataBukti.dokumenAdmin,
          user: { connect: { id: userId } },
          satker: { connect: { id: satkerId } }
        }
      }
    },
    include: { monitoring: true }
  })
}

async function findPenerbitan (userId) {
  const penerbitanBukti = await prisma.penerbitanBukti.findMany({
    where: { userId: userId },
    select: {
      id: true,
      noTelpon: true,
      unggah_dokumen: true,
      satker: {
        select: {
          kodeSatker: true,
          namaInstansi: true
        },
        monitoring: {
          select: {
            dokumenAdmin: true
          }
        }
      }
    }
  })
  return penerbitanBukti
}

async function findPenerbitanBuktiById (id) {
  const penerbitanBukti = await prisma.penerbitanBukti.findFirst({
    where: {
      id: Number(id)
    },
    include: {
      monitoring: {
        select: {
          status: true,
          catatan: true
        }
      },
      satker: {
        select: {
          kodeSatker: true,
          namaInstansi: true
        }
      },
      monitoring: {
        select: {
          dokumenAdmin: true
        }
      }
    }
  })
  return penerbitanBukti
}

async function editPenerbitanBukti (id, dataBukti) {
  const penerbitanBukti = await prisma.penerbitanBukti.findUnique({
    where: {
      id: Number(id)
    },
    include: {
      monitoring: true
    }
  })

  if (!penerbitanBukti)
    throw new Error('Penerbitan Bukti Negara  Tidak Ditemukan')
  const updatePenerbitanBukti = await prisma.penerbitanBukti.update({
    where: { id: Number(id) },
    data: {
      ...(dataBukti.noTelpon && { noTelpon: dataBukti.noTelpon }),
      ...(dataBukti.unggah_dokumen && {
        unggah_dokumen: dataBukti.unggah_dokumen
      }),
      ...(dataBukti.extractedText && { extractedText: dataBukti.extractedText })
    },
    include: { satker: true }
  })

  if (!dataBukti.unggah_dokumen && dataBukti.monitoring.length > 0) {
    const lastMonitoring = penerbitanBukti.monitoring.sort(
      (a, b) => b.id - a.id
    )[0]
    await prisma.monitoringPenerbitanBukti.update({
      where: { id: lastMonitoring.id },
      data: { status: 'DIPROSES' }
    })
  }
  return updatePenerbitanBukti
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
