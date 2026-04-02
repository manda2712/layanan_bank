const fs = require('fs')
const path = require('path')
const prisma = require('../db')
const {
  InsertKoreksiPenerimaan,
  findKoreksiPenerimaan,
  findKoreksiPenerimaanById,
  editKoreksiPenerimaan,
  deleteKoreksiPenerimaan
} = require('./koreksiPenerimaan.repository')

const ocrService = require('../service/ocrService')
const { kmpSearch } = require('../utils/kmp')
const patterns = require('../config/koreksiPenerimaanPattern')

const uploadsPath = path.join(__dirname, '../uploads')
if (!fs.existsSync(uploadsPath)) fs.mkdirSync(uploadsPath)

async function createKoreksiPenerimaan (dataKoreksi, userId, file) {
  try {
    if (!userId) throw new Error('User ID Tidak Ditemukan')
    if (!file) throw new Error('Dokumen wajib diunggah!')

    if (dataKoreksi.tahunSetoran === 'LAINNYA' && !dataKoreksi.tahunLainnya) {
      throw new Error('Alasan lainnya wajib diisi jika memilih LAINNYA.')
    }

    // 1. Ambil data Satker
    const userData = await prisma.user.findUnique({
      where: { id: userId },
      select: { satkerId: true }
    })
    if (!userData?.satkerId)
      throw new Error('User belum terdaftar di satker manapun')

    const satkerId = userData.satkerId

    // 2. Simpan File PDF
    const filename = `${Date.now()}-${file.originalname}`
    const filePath = path.join(uploadsPath, filename)
    fs.writeFileSync(filePath, file.buffer)
    dataKoreksi.unggahDokumen = filename

    // 3. PROSES OCR (PENTING: Membaca teks dari PDF)
    // Gunakan await agar sistem menunggu hasil pembacaan selesai
    const extractedText = await ocrService.extractTextFromPDF(filePath)
    const lowerText = extractedText.toLowerCase()

    const missingPatterns = []
    const detailValidasi = {}

    // 4. Analisis KMP Search
    for (const [key, patternList] of Object.entries(patterns)) {
      const ditemukan = patternList.some(pattern =>
        kmpSearch(lowerText, pattern.toLowerCase())
      )
      detailValidasi[key] = ditemukan

      if (!ditemukan) {
        missingPatterns.push(key)
      }
    }

    const catatanKmp =
      missingPatterns.length === 0
        ? 'Sistem: Dokumen Terdeteksi Lengkap.'
        : `Sistem: Pola tidak ditemukan pada: [${missingPatterns.join(', ')}]`

    dataKoreksi.catatanKmp = catatanKmp
    dataKoreksi.hasilAnalisis = JSON.stringify(detailValidasi)
    dataKoreksi.extractedText = extractedText // Simpan hasil OCR ke DB jika diperlukan

    // 5. Simpan ke Database
    const newKoreksiPenerimaan = await InsertKoreksiPenerimaan(
      dataKoreksi,
      userId,
      satkerId
    )
    return newKoreksiPenerimaan
  } catch (error) {
    // Tambahkan log detail di console agar kamu mudah debug
    console.error('DEBUG ERROR KOREKSI:', error)
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

async function editKoreksiPenerimaanById (id, dataKoreksi, file) {
  const existingData = await getKoreksiPenerimaanById(id)
  if (!existingData) {
    throw new Error(
      `Data Koreksi Penerimaan dengan ID ${id} memang tidak ada di database.`
    )
  }

  try {
    if (file) {
      const filename = `${Date.now()}-${file.originalname}`
      const filePath = path.join(uploadsPath, filename)
      fs.writeFileSync(filePath, file.buffer)

      dataKoreksi.unggahDokumen = filename

      const text = await ocrService.extractTextFromPDF(filePath)
      dataKoreksi.extractedText = text
      const lowerText = text.toLowerCase()
      const detailValidasi = {}
      const missingPatterns = []

      for (const [key, patternList] of Object.entries(patterns)) {
        if (Array.isArray(patternList)) {
          const ditemukan = patternList.some(p =>
            kmpSearch(lowerText, p.toLowerCase())
          )
          detailValidasi[key] = ditemukan
          if (!ditemukan) missingPatterns.push(key)
        }
      }

      dataKoreksi.hasilAnalisis = JSON.stringify(detailValidasi)
      dataKoreksi.catatanKmp =
        missingPatterns.length === 0
          ? 'Sistem: Dokumen Terdeteksi Lengkap.'
          : `Sistem: Pola tidak ditemukan pada: [${missingPatterns.join(', ')}]`
    }
    const updated = await editKoreksiPenerimaan(id, dataKoreksi)
    return updated
  } catch (error) {
    console.error('Error saat update Koreksi Penerimaan:', error)
    throw new Error(`Gagal memperbarui data: ${error.message}`)
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
