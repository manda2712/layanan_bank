const { pengajuanNota } = require('../db')
const {
  InsertPenerbitanNota,
  findPenerbitanNota,
  findPenerbitanNotaById,
  editPenerbitanNota,
  deletePenerbitanNota
} = require('./penerbitanNota.repository')

const { getAllAdminUsers } = require('../user/user.services') // Import service user
const { createNotification } = require('../notifikasi/notifikasi.repository')

async function createPenerbitanNota (dataNota, userId) {
  try {
    if (!userId) {
      throw new Error('User Id Tidak Ditemukan')
    }

    console.log('Data yang diterima untuk pembuatan nota:', dataNota)

    if (dataNota.tahunSetoran === 'LAINNYA' && !dataNota.tahunLainnya) {
      throw new Error('Alasan lainnya wajib diisi jika memilih LAINNYA.')
    }

    const newPenerbitanNota = await InsertPenerbitanNota(dataNota, userId)
    const adminUsers = await getAllAdminUsers()
    const notifMessage = `Kode Satker ${newPenerbitanNota.kodeSatker} telah mengajukan dokumen Pengajuan Penerbitan Nota Konfirmasi atas Penerimaan Negara.`

    for (const admin of adminUsers) {
      await createNotification({
        userId: admin.id,
        message: notifMessage,
        monitoringId: newPenerbitanNota.monitoring?.id || null, // pastikan ini sesuai schema
        monitoringType: 'penerbitanNota' // isi sesuai kebutuhan
      })
    }
    return newPenerbitanNota
  } catch (error) {
    console.error('Error di Service:', error)
    throw new Error(error.message || 'Gagal Membuat Penerbitan Nota')
  }
}

async function getAllPenerbitanNota () {
  const penerbitanNota = findPenerbitanNota()
  return penerbitanNota
}

async function getPenerbitanNotaById (id) {
  const penerbitanNota = findPenerbitanNotaById(id)
  if (!penerbitanNota) {
    throw new Error('Tidak Dapat Menemukan Penerbitan Nota')
  }
  return penerbitanNota
}

async function editPenerbitanNotaById (id, dataNota) {
  const penerbitanNota = await getPenerbitanNotaById(id)

  if (!penerbitanNota) {
    throw new Error(`Penerbitan Nota dengan ID ${id} tidak ditemukan`)
  }

  const isRejected = Array.isArray(penerbitanNota.monitoring)
    ? penerbitanNota.monitoring.some(m => m.status === 'DITOLAK')
    : false

  if (isRejected && !dataNota.unggahDokumen) {
    throw new Error('Dokumen baru harus diunggah setelah penolakan')
  }
  // ✅ Validasi alasan lainnya jika enum-nya LAINNYA
  if (dataNota.tahunSetoran === 'LAINNYA' && !dataNota.tahunLainnya) {
    throw new Error('Alasan lainnya wajib diisi jika memilih LAINNYA.')
  }
  try {
    const updatePenerbitanNota = await editPenerbitanNota(id, dataNota)
    return updatePenerbitanNota
  } catch (error) {
    console.error('Error saat update Penerbitan Nota:', error)
    throw error
  }
}

async function deletePenerbitanNotaById (id) {
  await getPenerbitanNotaById(id)
  await deletePenerbitanNota(id)
}

module.exports = {
  createPenerbitanNota,
  getAllPenerbitanNota,
  getPenerbitanNotaById,
  editPenerbitanNotaById,
  deletePenerbitanNotaById
}
