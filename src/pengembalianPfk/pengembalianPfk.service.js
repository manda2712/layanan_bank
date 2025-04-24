const {
  insertPengembalianPfk,
  findPengembalianPfk,
  findPengembalianPfkById,
  editPengembalianPfk
} = require('./pengembalianPfk.repository')

async function createPengembalianPfk (dataPfk, userId) {
  try {
    if (!userId) {
      throw new Error('User Id Tidak Ditemukan')
    }

    const newPengembalianPfk = await insertPengembalianPfk(dataPfk, userId)
    return newPengembalianPfk
  } catch (error) {
    throw new Error('Gagal Membuat Pengembalian PFK')
  }
}

async function getAllPengembalianPfk () {
  const pengembalianPfk = findPengembalianPfk()
  return pengembalianPfk
}

async function getPengembalianPfkById (id) {
  const pengembalianPfk = findPengembalianPfkById(id)
  if (!pengembalianPfk) {
    throw new Error('Tidak Dapat Menemukan Pengembalian PFK')
  }
  return pengembalianPfk
}

async function updatePengembalianPfkById (id, dataPfk) {
  const pengembalianPfk = await getPengembalianPfkById(id)

  if (!pengembalianPfk) {
    throw new Error(`Pengembalian PFK dengan ID ${id} tidak ditemukan`)
  }

  // Proses lanjut jika pengembalianPfk ada
  const isRejected = Array.isArray(pengembalianPfk.monitoring)
    ? pengembalianPfk.monitoring.some(m => m.status === 'DITOLAK')
    : false

  try {
    const updatePengembalianPfk = await editPengembalianPfk(id, dataPfk)
    return updatePengembalianPfk
  } catch (error) {
    console.error('Error saat update PFK:', error)
    throw error
  }
}

async function deletePengembalianPfkById (id) {
  await getPengembalianPfkById(id)
  deletePengembalianPfkById(id)
}

module.exports = {
  createPengembalianPfk,
  getAllPengembalianPfk,
  getPengembalianPfkById,
  updatePengembalianPfkById,
  deletePengembalianPfkById
}
