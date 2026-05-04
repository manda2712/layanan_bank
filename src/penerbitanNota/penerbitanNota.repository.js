const prisma = require('../db')

const enumTahunMap = {
  2024: 'T2024',
  2025: 'T2025',
  LAINNYA: 'LAINNYA'
}

async function InsertPenerbitanNota (dataNota, userId, satkerId) {
  const mappedTahun = enumTahunMap[dataNota.tahunSetoran]
  if (!mappedTahun) {
    throw new Error('Tahun Setoran tidak valid!')
  }

  return await prisma.penerbitanNota.create({
    data: {
      noTelpon: dataNota.noTelpon,
      tahunSetoran: mappedTahun,
      tahunLainnya: dataNota.tahunLainnya || null,
      unggahDokumen: dataNota.unggahDokumen,
      extractedText: dataNota.extractedText,
      validationResult: dataNota.validationResult,
      user: {
        connect: { id: userId }
      },
      satker: {
        connect: { id: satkerId }
      },
      monitoring: {
        create: {
          status: 'DIPROSES',
          hasilKmp: dataNota.hasilAnalisis,
          catatan: null,
          user: { connect: { id: userId } },
          satker: { connect: { id: satkerId } }
        }
      }
    },
    include: { monitoring: true }
  })
}

async function findPenerbitanNota (userId) {
  const newPenerbitanNota = await prisma.penerbitanNota.findMany({
    where: { userId: userId },
    select: {
      id: true,
      noTelpon: true,
      tahunSetoran: true,
      tahunLainnya: true,
      unggahDokumen: true,
      satker: {
        select: {
          kodeSatker: true,
          namaInstansi: true
        }
      }
    }
  })
  return newPenerbitanNota
}

async function findPenerbitanNotaById (id, userId) {
  const penerbitanNota = await prisma.penerbitanNota.findFirst({
    where: { id: Number(id), userId: userId },
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
  return penerbitanNota
}

async function editPenerbitanNota (id, userId, dataNota) {
  const penerbitanNota = await prisma.penerbitanNota.findUnique({
    where: {
      id: parseInt(id),
      userId: userId
    },
    include: {
      monitoring: true
    }
  })

  if (!penerbitanNota) throw new Error('Penerbitan Nota tidak ditemukan')
  const updatePenerbitanNota = await prisma.penerbitanNota.update({
    where: { id: Number(id) },
    data: {
      ...(dataNota.noTelpon && { noTelpon: dataNota.noTelpon }),
      ...(dataNota.tahunSetoran && { tahunSetoran: dataNota.tahunSetoran }),
      ...(dataNota.tahunLainnya !== undefined && {
        tahunLainnya: dataNota.tahunLainnya
      }),
      ...(dataNota.unggahDokumen && { unggahDokumen: dataNota.unggahDokumen }),
      ...(dataNota.extractedText && { extractedText: dataNota.extractedText })
    },
    include: { satker: true }
  })

  if (penerbitanNota.monitoring && penerbitanNota.monitoring.length > 0) {
    const lastMonitoring = penerbitanNota.monitoring.sort(
      (a, b) => b.id - a.id
    )[0]
    await prisma.monitoringPenerbitanNota.update({
      where: { id: lastMonitoring.id },
      data: {
        status: 'DIPROSES'
      }
    })
  }
  return updatePenerbitanNota
}

async function deletePenerbitanNota (id, userId) {
  await prisma.penerbitanNota.delete({
    where: {
      id: parseInt(id),
      userId: userId
    }
  })
}

module.exports = {
  InsertPenerbitanNota,
  findPenerbitanNota,
  findPenerbitanNotaById,
  editPenerbitanNota,
  deletePenerbitanNota
}
