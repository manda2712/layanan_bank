const fs = require('fs')
const path = require('path')
const prisma = require('../db')
const {
  insertLaporanRekening,
  findLaporanRekening,
  findLaporanRekeningById,
  editLaporanRekening,
  deleteLaporanRekening
} = require('./laporanRekening.repository')

const ocrService = require('../service/ocrService')
const { kmpSearch } = require('../utils/kmp')
const patterns = require('../config/laporanRekeningPattern')

const uploadsPath = path.join(__dirname, '../uploads')
if (!fs.existsSync(uploadsPath)) fs.mkdirSync(uploadsPath, { recursive: true })

async function createLaporanRekening (dataLaporan, userId, file) {
  try {
    if (!userId) throw new Error('User Id Tidak Ditemukan')
    if (!file) throw new Error('Dokumen wajib diunggah!')

    const userData = await prisma.user.findUnique({
      where: { id: userId },
      select: { satkerId: true }
    })

    if (!userData?.satkerId)
      throw new Error('User belum terdaftar di Satker manapun.')

    // Simpan satkerId ke variabel agar bisa digunakan di akhir fungsi
    const satkerId = userData.satkerId

    const filename = `${Date.now()}-${file.originalname}`
    const filePath = path.join(uploadsPath, filename)
    fs.writeFileSync(filePath, file.buffer)

    // Simpan nama file ke object data untuk database
    dataLaporan.unggahDokumen = filename

    const extractedText = await ocrService.extractTextFromPDF(filePath)
    dataLaporan.extractedText = extractedText
    const lowerText = extractedText.toLowerCase()

    // --- LOGIKA PEMILIHAN PATTERN (SMART SELECTION) ---
    // Cek jenis laporan dari body Postman atau deteksi kata 'penutupan' di dokumen
    const isPenutupan =
      dataLaporan.jenisLaporan === 'LAPORAN_PENUTUPAN_REKENING' ||
      kmpSearch(lowerText, 'penutupan')

    const selectedPattern = isPenutupan
      ? patterns.laporanPenutupan
      : patterns.laporanPembukaan

    const missingPatterns = []
    const detailValidasi = {}

    // Jalankan validasi KMP berdasarkan pattern yang terpilih
    for (const [key, patternList] of Object.entries(selectedPattern)) {
      if (Array.isArray(patternList)) {
        const ditemukan = patternList.some(pattern =>
          kmpSearch(lowerText, pattern.toLowerCase())
        )
        detailValidasi[key] = ditemukan

        if (!ditemukan) {
          missingPatterns.push(key)
        }
      }
    }

    const catatanKmp =
      missingPatterns.length === 0
        ? `Sistem: Dokumen ${
            isPenutupan ? 'Penutupan' : 'Pembukaan'
          } Terdeteksi Lengkap.`
        : `Sistem: Pola tidak ditemukan pada: [${missingPatterns.join(', ')}]`

    dataLaporan.catatanKmp = catatanKmp
    dataLaporan.hasilAnalisis = JSON.stringify(detailValidasi)

    const newLaporanRekening = await insertLaporanRekening(
      dataLaporan,
      userId,
      satkerId
    )
    return newLaporanRekening
  } catch (error) {
    console.error('Error saat membuat laporan rekening:', error)
    throw error
  }
}

async function getAllLaporanRekening () {
  const laporanRekening = findLaporanRekening()
  return laporanRekening
}

async function getLaporanRekeningById (id) {
  const laporanRekening = findLaporanRekeningById(id)
  if (!laporanRekening) {
    throw new Error('Tidak Dapat Menemukan')
  }
  return laporanRekening
}

async function updateLaporanRekeningById (id, dataLaporan, file) {
  const laporanRekening = await getLaporanRekeningById(id)
  if (!laporanRekening) {
    throw new Error('Dokumen baru harus diunggah setelah penolakan')
  }

  try {
    if (file) {
      const filename = `${Date.now()}-${file.originalname}`
      const filePath = path.join(uploadsPath, filename)
      fs.writeFileSync(filePath, file.buffer)

      dataLaporan.unggahDokumen = filename

      const text = await ocrService.extractTextFromPDF(filePath)
      dataLaporan.extractedText = text
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
      dataLaporan.hasilAnalisis = JSON.stringify(detailValidasi)
      dataLaporan.catatanKmp =
        missingPatterns.length === 0
          ? 'Sistem: Dokumen Terdeteksi Lengkap.'
          : `Sistem: Pola tidak ditemukan pada: [${missingPatterns.join(', ')}]`
    }
    const updateLaporanRekening = await editLaporanRekening(id, dataLaporan)
    return updateLaporanRekening
  } catch (error) {
    console.error('Error saat update Laporan Rekening:', error)
    throw error
  }
}

async function deleteLaporanRekeningById (id) {
  await getLaporanRekeningById(id)
  await deleteLaporanRekening(id)
}

module.exports = {
  createLaporanRekening,
  getAllLaporanRekening,
  getLaporanRekeningById,
  updateLaporanRekeningById,
  deleteLaporanRekeningById
}
