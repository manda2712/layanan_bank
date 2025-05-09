const {
  insertPengembalianPfk,
  findPengembalianPfk,
  findPengembalianPfkById,
  editPengembalianPfk
} = require('./pengembalianPfk.repository')

const { getAllAdminUsers } = require('../user/user.services') // Import service user
const { createNotification } = require('../notifikasi/notifikasi.repository')

async function createPengembalianPfk (dataPfk, userId) {
  try {
    if (!userId) {
      throw new Error('User Id Tidak Ditemukan')
    }

    const newPengembalianPfk = await insertPengembalianPfk(dataPfk, userId)
    const adminUsers = await getAllAdminUsers()
    const notifMessage = `Kode Satker ${newPengembalianPfk.kodeSatker} telah mengajukan dokumen Pengembalian PFK.`

    for (const admin of adminUsers) {
      await createNotification({
        userId: admin.id,
        message: notifMessage,
        monitoringId: newPengembalianPfk.monitoring?.id || null, // pastikan ini sesuai schema
        monitoringType: 'pengembalianPfk' // isi sesuai kebutuhan
      })
    }
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

  if (isRejected && !dataPfk.unggahDokumen) {
    throw new Error('Dokumen baru harus diunggah setelah penolakan.')
  }

  try {
    if (dataPfk.unggahDokumen && !dataPfk.unggahDokumen.startsWith('http')) {
      throw new Error('Unggah dokumen harus berupa URL yang valid.')
    }
    const updatePengembalianPfk = await editPengembalianPfk(id, dataPfk)
    const adminUsers = await getAllAdminUsers()
    const notifMessage = `Kode Satker ${updatePengembalianPfk.kodeSatker} telah mengupdate dokumen Pengembalian PFK.`

    for (const admin of adminUsers) {
      await createNotification({
        userId: admin.id,
        message: notifMessage,
        monitoringId: updatePengembalianPfk.monitoring?.id || null, // pastikan ini sesuai schema
        monitoringType: 'PengembalianPfk' // isi sesuai kebutuhan
      })
    }
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
