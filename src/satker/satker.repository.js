const prisma = require('../db')

async function insertSatker (satker) {
  const newSatker = await prisma.satker.create({
    data: {
      namaInstansi: satker.namaInstansi,
      kodeSatker: satker.kodeSatker,
      tipe: satker.tipe
    }
  })
  return newSatker
}

async function findSatker () {
  const satker = await prisma.satker.findMany({
    select: {
      id: true,
      namaInstansi: true,
      kodeSatker: true,
      tipe: true
    }
  })
  return satker
}

async function findSatkerById (id) {
  const satker = await prisma.satker.findUnique({
    where: {
      id: parseInt(id)
    }
  })
  return satker
}

async function editSatker (id, satker) {
  const result = await prisma.satker.update({
    // Gunakan nama variabel 'result' agar tidak tabrakan
    where: { id: parseInt(id) }, // Perbaikan: ganti 'parseId' jadi 'parseInt(id)'
    data: {
      namaInstansi: satker.namaInstansi,
      kodeSatker: satker.kodeSatker,
      tipe: satker.tipe
    }
  })
  return result // Kembalikan hasil update
}

async function deleteSatker (id) {
  await prisma.satker.delete({
    where: {
      id: parseInt(id)
    }
  })
}

module.exports = {
  insertSatker,
  findSatker,
  findSatkerById,
  editSatker,
  deleteSatker
}
