const fs = require('fs')
const path = require('path')
const prisma = require('../db')
const {
  insertPembukaanRekening,
  findPembukaanRekening,
  findPembukaanRekeningById,
  editPembukaanRekening,
  deletePembukaanRekening
} = require('./pembukaanRekening.repository')

const ocrService = require('../service/ocrService')
const { kmpSearch } = require('../utils/kmp')
const patterns = require('../config/pembukaanRekeningPattern')

const uploadsPath = path.join(__dirname, '../uploads')
if (!fs.existsSync(uploadsPath)) fs.mkdirSync(uploadsPath, { recursive: true })

async function createPembukaanRekening (dataRekening, userId, file) {
  try {
    if (!userId) throw new Error('User ID tidak ditemukan!')
    if (!file) throw new Error('Dokumen wajib diunggah!')

    const userData = await prisma.user.findUnique({
      where: { id: userId },
      select: { satkerId: true }
    })

    if (!userData?.satkerId)
      throw new Error('User belum terdaftar di Satker manapun.')

    const satkerId = userData.satkerId
    const filename = `${Date.now()}-${file.originalname}`
    const filePath = path.join(uploadsPath, filename)
    fs.writeFileSync(filePath, file.buffer)

    dataRekening.unggahDokumen = filename
    const extractedText = await ocrService.extractTextFromPDF(filePath)
    dataRekening.extractedText = extractedText
    const lowerText = extractedText.toLowerCase()

    const isHibahDocument =
      kmpSearch(lowerText, 'hibah') || kmpSearch(lowerText, 'register')
    const masterPatternKey = isHibahDocument
      ? 'rekeningHibah'
      : 'rekeningSatker'

    // Ambil object pattern-nya (misal: patterns.rekeningHibah)
    const selectedPattern = patterns[masterPatternKey]

    const missingPatterns = []
    const detailValidasi = {}

    // Lakukan validasi menggunakan KMP
    if (selectedPattern) {
      for (const [key, patternList] of Object.entries(selectedPattern)) {
        if (Array.isArray(patternList)) {
          const ditemukan = patternList.some(pattern =>
            kmpSearch(lowerText, pattern.toLowerCase())
          )
          detailValidasi[key] = ditemukan
          if (!ditemukan) missingPatterns.push(key)
        }
      }
    }

    // Set hasil analisis untuk database
    dataRekening.catatanKmp =
      missingPatterns.length === 0
        ? 'Sistem: Dokumen Terdeteksi Lengkap Sesuai Syarat.'
        : `Sistem: Syarat tidak ditemukan: [${missingPatterns.join(', ')}]`

    dataRekening.hasilAnalisis = JSON.stringify(detailValidasi)

    const newPembukaanRekening = await insertPembukaanRekening(
      dataRekening,
      userId,
      satkerId
    )
    return newPembukaanRekening
  } catch (error) {
    console.error('Error saat membuat pembukaan rekening:', error)
    // Throw error asli agar pesan dari 'missing patterns' sampai ke frontend
    throw error
  }
}

async function getAllPembukaanRekening () {
  return await findPembukaanRekening()
}

async function getPembukaanRekeningById (id) {
  const data = await findPembukaanRekeningById(id)
  if (!data) throw new Error('Tidak Dapat Menemukan Pembukaan Rekening')
  return data
}

async function editPembukaanRekeningById (id, dataRekening, file) {
  const existing = await getPembukaanRekeningById(id)

  try {
    if (file) {
      const filename = `${Date.now()}-${file.originalname}`
      const filePath = path.join(uploadsPath, filename)
      fs.writeFileSync(filePath, file.buffer)

      dataRekening.unggahDokumen = filename

      const text = await ocrService.extractTextFromPDF(filePath)
      dataRekening.extractedText = text
      const lowerText = text.toLowerCase()

      const selectedCategory =
        patterns[dataRekening.jenisRekening || existing.jenisRekening]
      const detailValidasi = {}
      const missingPatterns = []

      if (selectedCategory) {
        for (const [key, patternList] of Object.entries(selectedCategory)) {
          if (Array.isArray(patternList)) {
            const ditemukan = patternList.some(p =>
              kmpSearch(lowerText, p.toLowerCase())
            )
            detailValidasi[key] = ditemukan
            if (!ditemukan) missingPatterns.push(key)
          }
        }
        dataRekening.hasilAnalisis = JSON.stringify(detailValidasi)
        dataRekening.catatanKmp =
          missingPatterns.length === 0
            ? 'Sistem: Dokumen Terdeteksi Lengkap.'
            : `Sistem: Syarat tidak ditemukan pada: [${missingPatterns.join(
                ', '
              )}]`
      }
    }

    return await editPembukaanRekening(id, dataRekening)
  } catch (error) {
    console.error('Error saat update Pembukaan Rekening:', error)
    throw error
  }
}

async function deletePembukaanRekeningById (id) {
  await getPembukaanRekeningById(id)
  await deletePembukaanRekening(id)
}

module.exports = {
  createPembukaanRekening,
  getAllPembukaanRekening,
  getPembukaanRekeningById,
  editPembukaanRekeningById,
  deletePembukaanRekeningById
}
