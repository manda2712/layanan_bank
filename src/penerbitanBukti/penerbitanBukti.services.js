const prisma = require('../db')
const {
  InsertPenerbitanBukti,
  findPenerbitan,
  findPenerbitanBuktiById,
  editPenerbitanBukti,
  deletePenerbitanBukti
} = require('./penerbitanBukti.repository')

const { getAllAdminUsers } = require('../user/user.services') // Import service user
const { createNotification } = require('../notifikasi/notifikasi.repository')

async function createPenerbitanBukti (dataBukti, userId) {
  try {
    if (!userId) {
      throw new Error('User Id Tidak Ditemukan')
    }

    // ✅ Validasi alasan lainnya jika enum-nya LAINNYA
    if (dataBukti.alasanRetur === 'LAINNYA' && !dataBukti.alasanLainnya) {
      throw new Error('Alasan lainnya wajib diisi jika memilih LAINNYA.')
    }

    const newPenerbitan = await InsertPenerbitanBukti(dataBukti, userId)
    const adminUsers = await getAllAdminUsers()
    const notifMessage = `Kode Satker ${newPenerbitan.kodeSatker} telah mengajukan dokumen Penerimaan Bukti Penerimaan Negara.`

    for (const admin of adminUsers) {
      await createNotification({
        userId: admin.id,
        message: notifMessage,
        monitoringId: newPenerbitan.monitoring?.id || null, // pastikan ini sesuai schema
        monitoringType: 'penerbitanBukti' // isi sesuai kebutuhan
      })
    }
    return newPenerbitan
  } catch (error) {
    throw new Error('Gagal Membuat Penerbitan Bukti')
  }
}

async function getAllPenerbitanBukti () {
  const penerbitanBukti = findPenerbitan()
  return penerbitanBukti
}

async function getPenerbitanBuktiById (id) {
  const penerbitanBukti = await findPenerbitanBuktiById(id)
  if (!penerbitanBukti) {
    throw new Error('Tidak Dapat Menemukan Penerbitan Bukti Yang dicari')
  }
  return penerbitanBukti
}

async function editPenerbitanBuktiById (id, dataBukti) {
  const penerbitanBukti = await getPenerbitanBuktiById(id)

  if (!penerbitanBukti) {
    throw new Error(`Penerbitan Bukti dengan ID ${id} tidak dapat ditemukan`)
  }

  const isRejected = Array.isArray(penerbitanBukti.monitoring)
    ? penerbitanBukti.monitoring.some(m => m.status === 'DITOLAK')
    : false

  if (isRejected && !dataBukti.unggah_dokumen) {
    throw new Error('Dokumen baru harus diunggah setelah penolakan')
  }

  // ✅ Validasi alasan lainnya jika enum-nya LAINNYA
  if (dataBukti.alasanRetur === 'LAINNYA' && !dataBukti.alasanLainnya) {
    throw new Error('Alasan lainnya wajib diisi jika memilih LAINNYA.')
  }

  try {
    if (
      dataBukti.unggah_dokumen &&
      !dataBukti.unggah_dokumen.startsWith('http')
    ) {
      throw new Error('Unggah dokumen harus berupa URL yang valid.')
    }
    const updateBukti = await editPenerbitanBukti(id, dataBukti)
    const adminUsers = await getAllAdminUsers()
    const notifMessage = `Kode Satker ${updateBukti.kodeSatker} telah mengupdate dokumen Penerbitan Bukti Penerimaan Negara.`

    for (const admin of adminUsers) {
      await createNotification({
        userId: admin.id,
        message: notifMessage,
        monitoringId: updateBukti.monitoring?.id || null, // pastikan ini sesuai schema
        monitoringType: 'penerbitanBukti' // isi sesuai kebutuhan
      })
    }
    return updateBukti
  } catch (error) {
    console.error('Error saat update retur:', error)
    throw error
  }
}

async function deletePenerbitanBuktiById (id) {
  await getPenerbitanBuktiById(id)
  await deletePenerbitanBukti(id)
}

module.exports = {
  createPenerbitanBukti,
  findPenerbitan,
  getAllPenerbitanBukti,
  getPenerbitanBuktiById,
  editPenerbitanBuktiById,
  deletePenerbitanBuktiById
}
