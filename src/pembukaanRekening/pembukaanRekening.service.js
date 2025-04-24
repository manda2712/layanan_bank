const prisma = require('../db')
const { pembukaanRekening } = require('../db')
const {
  insertPembukaanRekening,
  findPembukaanRekening,
  findPembukaanRekeningById,
  editPembukaanRekening,
  deletePembukaanRekening
} = require('./pembukaanRekening.repository')

async function createPembukaanRekening (dataRekening, userId) {
  try {
    if (!userId) {
      throw new Error('User ID tidak ditemukan!')
    }

    const newRekening = await insertPembukaanRekening(dataRekening, userId)
    return newRekening
  } catch (error) {
    console.error('Error saat membuat pembukaan rekening:', error)
    throw new Error('Gagal membuat pembukaan rekening!')
  }
}

async function getAllPembukaanRekening () {
  const pembukaanRekening = findPembukaanRekening()
  return pembukaanRekening
}

async function getPembukaanRekeningById (id) {
  const pembukaanRekening = findPembukaanRekeningById(id)
  if (!pembukaanRekening) {
    throw new Error('Tidak Dapat Menemukan Pembukaan Rekening')
  }
  return pembukaanRekening
}

async function editPembukaanRekeningById (id, dataRekening) {
  const pembukaanRekening = await getPembukaanRekeningById(id)

  if (!pembukaanRekening) {
    throw new Error(`Pembukaan Rekening pada ID ${id} tidak ditemukan`)
  }

  const isRejected = Array.isArray(pembukaanRekening.monitoring)
    ? pembukaanRekening.monitoring.some(m => m.status === 'DITOLAK')
    : false

  if (isRejected && !dataRekening.unggahDokumen) {
    throw new Error('Dokumen baru harus diunggah setelah penolakan')
  }

  try {
    const updatePembukaanRekening = await editPembukaanRekening(
      id,
      dataRekening
    )
    return updatePembukaanRekening
  } catch (error) {
    console.error('Error saat update Pembukaan Rekening:', error)
    throw error
  }
}

async function deletePembukaanRekeningById (id) {
  await getPembukaanRekeningById(id)
  await deletePembukaanRekening(id)
}

module.exports = {
  createPembukaanRekening,
  getAllPembukaanRekening,
  getPembukaanRekeningById,
  editPembukaanRekeningById,
  deletePembukaanRekeningById
}
