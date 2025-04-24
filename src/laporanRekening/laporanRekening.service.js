const {
  insertLaporanRekening,
  findLaporanRekening,
  findLaporanRekeningById,
  editLaporanRekening,
  deleteLaporanRekening
} = require('./laporanRekening.repository')

async function createLaporanRekening (dataLaporan, userId) {
  try {
    if (!userId) {
      throw new Error('User Id Tidak Ditemukan')
    }

    const newLaporanRekening = await insertLaporanRekening(dataLaporan, userId)
    return newLaporanRekening
  } catch (error) {
    console.error('Error saat membuat laporan rekening:', error)
    throw new Error('Gagal Membuat Laporan Rekening')
  }
}

async function getAllLaporanRekening () {
  const laporanRekening = findLaporanRekening()
  return laporanRekening
}

async function getLaporanRekeningById (id) {
  const laporanRekening = findLaporanRekeningById(id)
  if (!laporanRekening) {
    throw new Error('Tidak Dapat Menemukan')
  }
  return laporanRekening
}

async function updateLaporanRekeningById (id, dataLaporan) {
  const laporanRekening = await getLaporanRekeningById(id)

  if (!laporanRekening) {
    throw new Error(`Laporan Rekening dengan ID ${id} tidak ditemukan`)
  }

  const isRejected = Array.isArray(laporanRekening.monitoring)
    ? laporanRekening.monitoring.some(m => m.status === 'DITOLAK')
    : false

  if (isRejected && !dataLaporan.unggahDokumen) {
    throw new Error('Dokumen baru harus diunggah setelah penolakan')
  }

  try {
    const updateLaporanRekening = await editLaporanRekening(id, dataLaporan)
    return updateLaporanRekening
  } catch (error) {
    console.error('Error saat update Laporan Rekening:', error)
    throw error
  }
}

async function deleteLaporanRekeningById (id) {
  await getLaporanRekeningById(id)
  await deleteLaporanRekening(id)
}

module.exports = {
  createLaporanRekening,
  getAllLaporanRekening,
  getLaporanRekeningById,
  updateLaporanRekeningById,
  deleteLaporanRekeningById
}
