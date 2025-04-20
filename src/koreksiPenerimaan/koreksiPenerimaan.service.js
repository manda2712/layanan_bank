const {
  InsertKoreksiPenerimaan,
  findKoreksiPenerimaan,
  findKoreksiPenerimaanById,
  editKoreksiPenerimaan,
  deleteKoreksiPenerimaan
} = require('./koreksiPenerimaan.repository')

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
  await getKoreksiPenerimaanById(id)
  // ✅ Validasi alasan lainnya jika enum-nya LAINNYA
  if (dataKoreksi.tahunSetoran === 'LAINNYA' && !dataKoreksi.tahunLainnya) {
    throw new Error('Alasan lainnya wajib diisi jika memilih LAINNYA.')
  }
  const updateKoreksiPenerimaan = await editKoreksiPenerimaan(id, dataKoreksi)
  return updateKoreksiPenerimaan
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
