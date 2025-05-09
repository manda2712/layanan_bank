const {
  insertLaporanRekening,
  findLaporanRekening,
  findLaporanRekeningById,
  editLaporanRekening,
  deleteLaporanRekening
} = require('./laporanRekening.repository')

const { getAllAdminUsers } = require('../user/user.services') // Import service user
const { createNotification } = require('../notifikasi/notifikasi.repository')

async function createLaporanRekening (dataLaporan, userId) {
  try {
    if (!userId) {
      throw new Error('User Id Tidak Ditemukan')
    }

    const newLaporanRekening = await insertLaporanRekening(dataLaporan, userId)
    const adminUsers = await getAllAdminUsers()
    const notifMessage = `Kode Satker ${newLaporanRekening.kodeSatker} telah mengajukan dokumen Permohonan Persetujuan Pembukaan Rekening Satker.`

    for (const admin of adminUsers) {
      await createNotification({
        userId: admin.id,
        message: notifMessage,
        monitoringId: newLaporanRekening.monitoring?.id || null, // pastikan ini sesuai schema
        monitoringType: 'laporanRekening' // isi sesuai kebutuhan
      })
    }
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
    if (
      dataLaporan.unggahDokumen &&
      !dataLaporan.unggahDokumen.startWith('http')
    ) {
      throw new Error('Unggah dokumen harus berupa URL yang valid')
    }
    const updateLaporanRekening = await editLaporanRekening(id, dataLaporan)
    const adminUsers = await getAllAdminUsers()
    const notifMessage = `Kode Satker ${updateLaporanRekening.kodeSatker} telah mengupdate dokumen Permohonan Persetujuan Pembukaan Rekening Satker`

    for (const admin of adminUsers) {
      await createNotification({
        userId: admin.id,
        message: notifMessage,
        monitoringId: updateLaporanRekening.monitoring?.id || null, // pastikan ini sesuai schema
        monitoringType: 'laporanRekening' // isi sesuai kebutuhan
      })
    }
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
