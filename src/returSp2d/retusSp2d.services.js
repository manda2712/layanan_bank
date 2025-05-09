const {
  insertRetur,
  findRetur,
  findReturById,
  editRetur,
  deleteDataRetur
} = require('./returSp2d.repository')

const { getAllAdminUsers } = require('../user/user.services') // Import service user
const { createNotification } = require('../notifikasi/notifikasi.repository')

async function createRetur (dataRetur, userId) {
  try {
    if (!userId) {
      throw new Error('UserId Tidak Ditemukan')
    }
    // ✅ Validasi alasan lainnya jika enum-nya LAINNYA
    if (dataRetur.alasanRetur === 'LAINNYA' && !dataRetur.alasanLainnya) {
      throw new Error('Alasan lainnya wajib diisi jika memilih LAINNYA.')
    }

    console.log('Data yang akan disimpan:', dataRetur)

    const newRetur = await insertRetur(dataRetur, userId)

    console.log('Koreksi Penerimaan berhasil dibuat:', newRetur)

    // 🔔 Kirim notifikasi ke semua admin
    const adminUsers = await getAllAdminUsers()
    const notifMessage = `Kode Satker ${newRetur.kodeSatker} telah mengajukan dokumen Penyelesaian Retur.`

    for (const admin of adminUsers) {
      await createNotification({
        userId: admin.id,
        message: notifMessage,
        monitoringId: newRetur.monitoring?.id || null, // pastikan ini sesuai schema
        monitoringType: 'returSp2d' // isi sesuai kebutuhan
      })
    }
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

  const isRejected = Array.isArray(returSp2d.monitoring)
    ? returSp2d.monitoring.some(m => m.status === 'DITOLAK')
    : false

  if (isRejected && !dataRetur.unggah_dokumen) {
    throw new Error('Dokumen baru harus diunggah setelah penolakan.')
  }

  if (dataRetur.alasanRetur === 'LAINNYA' && !dataRetur.alasanLainnya) {
    throw new Error('Alasan lainnya wajib diisi jika memilih LAINNYA.')
  }
  try {
    // Periksa jika unggah_dokumen bukan URL (misalnya filename saja)
    if (
      dataRetur.unggah_dokumen &&
      !dataRetur.unggah_dokumen.startsWith('http')
    ) {
      throw new Error('Unggah dokumen harus berupa URL yang valid.')
    }
    const updatedRetur = await editRetur(id, dataRetur)
    // 🔔 Kirim notifikasi ke semua admin setelah edit berhasil
    const adminUsers = await getAllAdminUsers()
    const notifMessage = `Kode Satker ${updatedRetur.kodeSatker} telah mengupdate dokumen Penyelesaian Retur.`

    for (const admin of adminUsers) {
      await createNotification({
        userId: admin.id,
        message: notifMessage,
        monitoringId: updatedRetur.monitoring?.id || null, // pastikan ini sesuai schema
        monitoringType: 'returSp2d' // isi sesuai kebutuhan
      })
    }
    return updatedRetur
  } catch (error) {
    console.error('Error saat update retur:', error)
    throw new Error('Gagal mengupdate retur SP2D: ' + error.message)
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
