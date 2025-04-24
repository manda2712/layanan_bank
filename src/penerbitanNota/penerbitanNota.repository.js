const prisma = require('../db')

const enumTahunMap = {
  2024: 'T2024',
  2025: 'T2025',
  LAINNYA: 'LAINNYA'
}

async function InsertPenerbitanNota (dataNota, userId) {
  const mappedTahun = enumTahunMap[dataNota.tahunSetoran]
  if (!mappedTahun) {
    throw new Error('Tahun Setoran tidak valid!')
  }

  const newPenerbitanNota = await prisma.penerbitanNota.create({
    data: {
      kodeSatker: dataNota.kodeSatker,
      noTelpon: dataNota.noTelpon,
      tahunSetoran: mappedTahun, // mapping dipakai di sini
      tahunLainnya: dataNota.tahunLainnya || null,
      unggahDokumen: dataNota.unggahDokumen,
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

  return newPenerbitanNota
}

async function findPenerbitanNota () {
  const newPenerbitanNota = await prisma.penerbitanNota.findMany({
    select: {
      id: true,
      kodeSatker: true,
      noTelpon: true,
      tahunSetoran: true,
      tahunLainnya: true,
      unggahDokumen: true
    }
  })
  return newPenerbitanNota
}

async function findPenerbitanNotaById (id) {
  const penerbitanNota = await prisma.penerbitanNota.findFirst({
    where: { id: Number(id) },
    include: {
      monitoring: {
        select: {
          status: true // ambil hanya field tertentu dari relasi monitoring
        }
      }
    }
  })
  return penerbitanNota
}

async function editPenerbitanNota (id, dataNota) {
  const penerbitanNota = await prisma.penerbitanNota.findUnique({
    where: {
      id: parseInt(id)
    },
    include: {
      monitoring: true
    }
  })

  if (!penerbitanNota) {
    throw new Error('Penerbitan Nota tidak ditemukan')
  }

  if (!dataNota.unggahDokumen) {
    throw new Error('Dokumen baru harus diubah setelah penolakan')
  }

  const updatePenerbitanNota = await prisma.penerbitanNota.update({
    where: { id: parseInt(id) },
    data: {
      unggahDokumen: dataNota.unggahDokumen
    }
  })

  if (penerbitanNota.monitoring && penerbitanNota.monitoring.length > 0) {
    const lastMonitoring =
      penerbitanNota.monitoring[penerbitanNota.monitoring.length - 1]
    await prisma.monitoringPenerbitanNota.update({
      where: { id: lastMonitoring.id },
      data: {
        status: 'DIPROSES'
      }
    })
  }
  return updatePenerbitanNota
}

async function deletePenerbitanNota (id) {
  await prisma.penerbitanNota.delete({
    where: {
      id: parseInt(id)
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
