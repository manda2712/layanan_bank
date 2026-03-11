const prisma = require('../db')

async function insertPengembalianPfk (dataPfk, userId, satkerId) {
  if (!userId) throw new Error('User ID tidak ditemukan!')

  return await prisma.pengembalianPfk.create({
    data: {
      pihakMengajukan: dataPfk.pihakMengajukan,
      noTelpon: dataPfk.noTelpon,
      unggahDokumen: dataPfk.unggahDokumen,
      extractedText: dataPfk.extractedText,
      validationResult: dataPfk.validationResult,
      user: {
        connect: {
          id: userId
        }
      },

      satker: {
        connect: {
          id: satkerId
        }
      },

      monitoring: {
        create: {
          status: 'DIPROSES',
          hasilKmp: dataPfk.hasilAnalisis,
          user: { connect: { id: userId } },
          satker: { connect: { id: satkerId } }
        }
      }
    },
    include: { monitoring: true }
  })
}

async function findPengembalianPfk () {
  const pengembalianPfk = await prisma.pengembalianPfk.findMany({
    select: {
      id: true,
      pihakMengajukan: true,
      noTelpon: true,
      unggahDokumen: true,
      satker: {
        select: {
          kodeSatker: true,
          namaInstansi: true
        }
      }
    }
  })
  return pengembalianPfk
}

async function findPengembalianPfkById (id) {
  const pengembalianPfk = await prisma.pengembalianPfk.findFirst({
    where: { id: Number(id) },
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
      }
    }
  })
  return pengembalianPfk
}

async function editPengembalianPfk (id, dataPfk) {
  const pengembalianPfk = await prisma.pengembalianPfk.findUnique({
    where: { id: parseInt(id) },
    include: { monitoring: true }
  })

  if (!pengembalianPfk) throw new Error('Pengembalian PFK tidak ditemukan')
  const updatedPfk = await prisma.pengembalianPfk.update({
    where: { id: Number(id) },
    data: {
      ...(dataPfk.noTelpon && { noTelpon: dataPfk.noTelpon }),
      ...(dataPfk.pihakMengajukan && {
        pihakMengajukan: dataPfk.pihakMengajukan
      }),
      ...(dataPfk.unggahDokumen && {
        unggahDokumen: dataPfk.unggahDokumen
      }),
      ...(dataPfk.extractedText && { extractedText: dataPfk.extractedText })
    },
    include: { satker: true }
  })

  if (pengembalianPfk.monitoring && pengembalianPfk.monitoring.length > 0) {
    const lastMonitoring = pengembalianPfk.monitoring.sort(
      (a, b) => b.id - a.id
    )[0]
    await prisma.monitoringPengembalianPfk.update({
      where: { id: lastMonitoring.id },
      data: { status: 'DIPROSES' }
    })
  }
  return updatedPfk
}

async function deletePengembalianPfk (id) {
  await prisma.pengembalianPfk.delete({
    where: {
      id: parseInt(id)
    }
  })
}

module.exports = {
  insertPengembalianPfk,
  findPengembalianPfk,
  findPengembalianPfkById,
  editPengembalianPfk,
  deletePengembalianPfk
}
