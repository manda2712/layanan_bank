const prisma = require('../db')
const {
  insertPengajuanVoid,
  findPengajuanVoid,
  findPengajuanVoidById,
  deletePengajuanVoid,
  editPengajuanVoid
} = require('./pengajuanVoid.repository')

async function creatPengajuanVoid (dataVoid, userId) {
  try {
    if (!userId) {
      throw new Error('User Id Tidak Ditemukan')
    }
    const newPengajuanVoid = await insertPengajuanVoid(dataVoid, userId)
    return newPengajuanVoid
  } catch (error) {
    throw new Error('Gagal Membuat Pengajuan Void')
  }
}

async function getAllPengajuanVoid () {
  const pengajuanVoid = findPengajuanVoid()
  return pengajuanVoid
}

async function getPengajuanVoidById (id) {
  const pengajuanVoid = findPengajuanVoidById(id)
  if (!pengajuanVoid) {
    throw new Error('tidak dapat menemukan pengajuan void')
  }
  return pengajuanVoid
}

async function editPengajuanVoidById (id, dataVoid) {
  const pengajuanVoid = await getPengajuanVoidById(id)

  if (!pengajuanVoid) {
    throw new Error(`Pengajuan Void dengan ID ${id} tidak ditemukan!`)
  }

  const isRejected = Array.isArray(pengajuanVoid.monitoring)
    ? pengajuanVoid.monitoring.some(m => m.status === 'DITOLAK')
    : false

  if (isRejected && !dataVoid.unggahDokumen) {
    throw new Error('Dokumen harus diunngah setelah penolakan')
  }

  try {
    const updatePengajuanVoid = await editPengajuanVoid(id, dataVoid)
    return updatePengajuanVoid
  } catch (error) {
    console.error('Error saat update pengajuan Void:', error)
  }
}

async function deletePengajuanVoidById (id) {
  await getPengajuanVoidById(id)
  await deletePengajuanVoid(id)
}

module.exports = {
  creatPengajuanVoid,
  getAllPengajuanVoid,
  getPengajuanVoidById,
  editPengajuanVoidById,
  deletePengajuanVoidById
}
