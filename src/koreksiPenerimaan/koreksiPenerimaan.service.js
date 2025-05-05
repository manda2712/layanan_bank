const {
  InsertKoreksiPenerimaan,
  findKoreksiPenerimaan,
  findKoreksiPenerimaanById,
  editKoreksiPenerimaan,
  deleteKoreksiPenerimaan
} = require('./koreksiPenerimaan.repository')

const { getAllAdminUsers } = require('../user/user.services') // Import service user
const { createNotification } = require('../notifikasi/notifikasi.repository')

async function createKoreksiPenerimaan (dataKoreksi, userId) {
  try {
    if (!userId) {
      throw new Error('User ID Tidak Ditemukan')
    }

    // Validasi alasan lainnya jika enum-nya LAINNYA
    if (dataKoreksi.tahunSetoran === 'LAINNYA' && !dataKoreksi.tahunLainnya) {
      throw new Error('Alasan lainnya wajib diisi jika memilih LAINNYA.')
    }

    // Debugging log: Pastikan data yang diterima sudah benar
    console.log('Data yang akan disimpan:', dataKoreksi)

    // Coba untuk memasukkan data
    const newKoreksiPenerimaan = await InsertKoreksiPenerimaan(
      dataKoreksi,
      userId
    )

    // Pastikan data berhasil disimpan
    console.log('Koreksi Penerimaan berhasil dibuat:', newKoreksiPenerimaan)

    // 🔔 Kirim notifikasi ke semua admin
    const adminUsers = await getAllAdminUsers() // Menggunakan service untuk mengambil data admin
    const notifMessage = `Kode Satker ${newKoreksiPenerimaan.kodeSatker} telah mengajukan dokumen koreksi penerimaan.`

    for (const admin of adminUsers) {
      await createNotification(admin.id, notifMessage, newKoreksiPenerimaan.id)
    }

    return newKoreksiPenerimaan
  } catch (error) {
    console.error('Error pada saat membuat Koreksi Penerimaan:', error)
    throw new Error(`Gagal Membuat Koreksi Penerimaan: ${error.message}`)
  }
}

async function getAllKoreksiPenerimaan () {
  const koreksiPenerimaan = findKoreksiPenerimaan()
  return koreksiPenerimaan
}

async function getKoreksiPenerimaanById (id) {
  const koreksiPenerimaan = findKoreksiPenerimaanById(id)
  if (!koreksiPenerimaan) {
    throw new Error('Tidak Dapat Menemukan Koreksi Penerimaan ')
  }
  return koreksiPenerimaan
}

async function editKoreksiPenerimaanById (id, dataKoreksi) {
  const koreksiPenerimaan = await getKoreksiPenerimaanById(id)

  if (!koreksiPenerimaan) {
    throw new Error(`Koreksi Penerimaan ID ${id} tidak ditemukan`)
  }

  const isRejected = Array.isArray(koreksiPenerimaan.monitoring)
    ? koreksiPenerimaan.monitoring.some(m => m.status === 'DITOLAK')
    : false

  if (isRejected && !dataKoreksi.unggahDokumen) {
    throw new Error('Dokumen baru harus diunggah setelah penolakkan')
  }

  // ✅ Validasi alasan lainnya jika enum-nya LAINNYA
  if (dataKoreksi.tahunSetoran === 'LAINNYA' && !dataKoreksi.tahunLainnya) {
    throw new Error('Alasan lainnya wajib diisi jika memilih LAINNYA.')
  }

  try {
    const updateKoreksiPenerimaan = await editKoreksiPenerimaan(id, dataKoreksi)
    return updateKoreksiPenerimaan
  } catch (error) {
    console.error('Error saat update Koreksi Penerimaan:', error)
    throw error
  }
}

async function deleteKoreksiPenerimaanById (id) {
  await getKoreksiPenerimaanById(id)
  await deleteKoreksiPenerimaan(id)
}
module.exports = {
  createKoreksiPenerimaan,
  getAllKoreksiPenerimaan,
  getKoreksiPenerimaanById,
  editKoreksiPenerimaanById,
  deleteKoreksiPenerimaanById
}
