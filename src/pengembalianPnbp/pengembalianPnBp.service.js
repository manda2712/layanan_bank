const {
  insertPengembalianPnbp,
  findPengembalianPnbp,
  findPengembalianPnbpById,
  editPengembalianPnbp,
  deletePengembalianPnbp
} = require('./pengembalianPnBp.repository')

const { getAllAdminUsers } = require('../user/user.services') // Import service user
const { createNotification } = require('../notifikasi/notifikasi.repository')

async function createPengembalianPnbp (dataPnbp, userId) {
  try {
    if (!userId) {
      throw new Error('User Id Tidak Ditemukan')
    }

    const newPengembalianPnbp = await insertPengembalianPnbp(dataPnbp, userId)
    const adminUsers = await getAllAdminUsers()
    const notifMessage = `Kode Satker ${newPengembalianPnbp.kodeSatker} telah mengajukan dokumen Pengembalian PNBP.`

    for (const admin of adminUsers) {
      await createNotification({
        userId: admin.id,
        message: notifMessage,
        monitoringId: newPengembalianPnbp.monitoring?.id || null, // pastikan ini sesuai schema
        monitoringType: 'pengembalianPnbp' // isi sesuai kebutuhan
      })
    }
    return newPengembalianPnbp
  } catch (error) {
    console.error('Error sata membuat Pengembalian PNBP', error)
    throw new Error('Gagal Membuat Pengembalian PNBP')
  }
}
async function getAllPengembalianPnbp () {
  const pengembalianPnBp = findPengembalianPnbp()
  return pengembalianPnBp
}

async function getPengembalianPnbpById (id) {
  const pengembalianPnBp = findPengembalianPnbpById(id)
  if (!pengembalianPnBp) {
    throw new Error('Tidak dapat menemukan')
  }
  return pengembalianPnBp
}

async function editPengembalianPnbpById (id, dataPnbp) {
  const pengembalianPnBp = await getPengembalianPnbpById(id)

  if (!pengembalianPnBp) {
    throw new Error(`Pengembalian PNBP dengan ID ${id} tidak ditemukan!`)
  }

  const isRejected = Array.isArray(pengembalianPnBp.monitoring)
    ? pengembalianPnBp.monitoring.some(m => m.status === 'DITOLAK')
    : false

  if (isRejected && !dataPnbp.unggahDokumen) {
    throw new Error('Dokumen baru harus diunggah setelah penolakan.')
  }

  try {
    if (dataPnbp.unggahDokumen && !dataPnbp.unggahDokumen.startsWith('http')) {
      throw new Error('Unggah dokumen harus berupa URL yang valid.')
    }
    const updatePengembalianPnbp = await editPengembalianPnbp(id, dataPnbp)
    // 🔔 Kirim notifikasi ke semua admin setelah edit berhasil
    const adminUsers = await getAllAdminUsers()
    const notifMessage = `Kode Satker ${updatePengembalianPnbp.kodeSatker} telah mengupdate dokumen Pengembalian PNBP.`

    for (const admin of adminUsers) {
      await createNotification({
        userId: admin.id,
        message: notifMessage,
        monitoringId: updatePengembalianPnbp.monitoring?.id || null, // pastikan ini sesuai schema
        monitoringType: 'PengembalianPnBp' // isi sesuai kebutuhan
      })
    }
    return updatePengembalianPnbp
  } catch (error) {
    console.error('Error saat update PNBP:', error)
    throw error
  }
}

async function deletePengembalianPnbpById (id) {
  await getPengembalianPnbpById(id)
  await deletePengembalianPnbp(id)
}

module.exports = {
  createPengembalianPnbp,
  getAllPengembalianPnbp,
  getPengembalianPnbpById,
  editPengembalianPnbpById,
  deletePengembalianPnbpById
}
