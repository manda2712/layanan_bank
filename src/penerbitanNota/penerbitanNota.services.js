const { pengajuanNota } = require('../db')
const {
  InsertPenerbitanNota,
  findPenerbitanNota,
  findPenerbitanNotaById,
  editPenerbitanNota,
  deletePenerbitanNota
} = require('./penerbitanNota.repository')

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
  await getPenerbitanNotaById(id)
  // ✅ Validasi alasan lainnya jika enum-nya LAINNYA
  if (dataNota.tahunSetoran === 'LAINNYA' && !dataNota.tahunLainnya) {
    throw new Error('Alasan lainnya wajib diisi jika memilih LAINNYA.')
  }
  const updatePenerbitanNota = await editPenerbitanNota(id, dataNota)
  return updatePenerbitanNota
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
