const { returSp2d } = require('../db')
const {
  insertRetur,
  findRetur,
  findReturById,
  editRetur,
  deleteDataRetur
} = require('./returSp2d.repository')

async function createRetur (dataRetur, userId) {
  try {
    if (!userId) {
      throw new Error('UserId Tidak Ditemukan')
    }
    // ✅ Validasi alasan lainnya jika enum-nya LAINNYA
    if (dataRetur.alasanRetur === 'LAINNYA' && !dataRetur.alasanLainnya) {
      throw new Error('Alasan lainnya wajib diisi jika memilih LAINNYA.')
    }

    const newRetur = await insertRetur(dataRetur, userId)
    return newRetur
  } catch (error) {
    console.error('Error sata membuat data Retur SP2D', error)
    throw new Error('gagal membuat retur SP2D')
  }
}

async function getAllRetur () {
  const returSp2d = findRetur()
  return returSp2d
}

async function getAllReturById (id) {
  console.log('Cek ID di service:', id)
  const returSp2d = await findReturById(id)
  if (!returSp2d) {
    throw new Error('Tidak dapat menemukan data retur')
  }
  return returSp2d
}

async function editReturById (id, dataRetur) {
  const returSp2d = await getAllReturById(id)

  // Cek jika returSp2d tidak ditemukan
  if (!returSp2d) {
    throw new Error(`Retur dengan ID ${id} tidak ditemukan!`)
  }

  const isRejected = Array.isArray(returSp2d.monitoring)
    ? returSp2d.monitoring.some(m => m.status === 'DITOLAK')
    : false

  // Kalau dokumen ditolak, wajib unggah ulang
  if (isRejected && !dataRetur.unggah_dokumen) {
    throw new Error('Dokumen baru harus diunggah setelah penolakan.')
  }

  if (dataRetur.alasanRetur === 'LAINNYA' && !dataRetur.alasanLainnya) {
    throw new Error('Alasan lainnya wajib diisi jika memilih LAINNYA.')
  }

  try {
    // Panggil fungsi editRetur untuk update
    const updateRetur = await editRetur(id, dataRetur)
    return updateRetur
  } catch (error) {
    console.error('Error saat update retur:', error)
    throw error
  }
}

async function deleteReturById (id) {
  await getAllReturById(id)
  await deleteDataRetur(id)
}

module.exports = {
  createRetur,
  getAllRetur,
  getAllReturById,
  editReturById,
  deleteReturById
}
