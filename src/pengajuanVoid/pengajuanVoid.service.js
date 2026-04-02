const fs = require('fs')
const path = require('path')
const prisma = require('../db')
const {
  insertPengajuanVoid,
  findPengajuanVoid,
  findPengajuanVoidById,
  deletePengajuanVoid,
  editPengajuanVoid
} = require('./pengajuanVoid.repository')

const { getAllAdminUsers } = require('../user/user.services') // Import service user
const { createNotification } = require('../notifikasi/notifikasi.repository')
const ocrService = require('../service/ocrService')
const { kmpSearch } = require('../utils/kmp')
const patterns = require('../config/voidPattern')

const uploadsPath = path.join(__dirname, '../uploads')
if (!fs.existsSync(uploadsPath)) fs.mkdirSync(uploadsPath)

async function creatPengajuanVoid (dataVoid, userId, file) {
  try {
    if (!userId) throw new Error('User Id Tidak Ditemukan')
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

    dataVoid.unggahDokumen = filename

    const extractedText = await ocrService.extractTextFromPDF(filePath)
    dataVoid.extractedText = extractedText

    const lowerText = extractedText.toLowerCase()
    const missingPatterns = []
    const detailValidasi = {}

    for (const [key, patternList] of Object.entries(patterns)) {
      const ditemukan = patternList.some(pattern =>
        kmpSearch(lowerText, pattern.toLowerCase())
      )
      detailValidasi[key] = ditemukan
      if (!ditemukan) missingPatterns.push(key)
    }

    dataVoid.catatanKmp =
      missingPatterns.length === 0
        ? 'Sistem: Dokumen Terdeteksi Lengkap.'
        : `Sistem: Pola tidak ditemukan pada: [${missingPatterns.join(', ')}]`

    dataVoid.hasilAnalisis = JSON.stringify(detailValidasi)

    // Tambahkan await
    const newPengajuanVoid = await insertPengajuanVoid(
      dataVoid,
      userId,
      satkerId
    )
    return newPengajuanVoid
  } catch (error) {
    console.error('DEBUG ERROR VOID:', error)
    throw error // Biarkan error asli naik ke controller
  }
}

async function getAllPengajuanVoid () {
  // PERBAIKAN: Tambahkan await
  const pengajuanVoid = await findPengajuanVoid()
  return pengajuanVoid
}

async function getPengajuanVoidById (id) {
  // PERBAIKAN: Konversi id ke Number dan tambahkan await
  const pengajuanVoid = await findPengajuanVoidById(Number(id))
  if (!pengajuanVoid) {
    throw new Error(`Tidak dapat menemukan pengajuan void dengan ID ${id}`)
  }
  return pengajuanVoid
}

async function editPengajuanVoidById (id, dataVoid, file) {
  // 1. Ambil data lama dulu (pake await)
  const existingData = await getPengajuanVoidById(id)

  try {
    // 2. Jika ada file baru, proses OCR lagi
    if (file) {
      const filename = `${Date.now()}-${file.originalname}`
      const filePath = path.join(uploadsPath, filename)
      fs.writeFileSync(filePath, file.buffer)

      dataVoid.unggahDokumen = filename

      const text = await ocrService.extractTextFromPDF(filePath)
      dataVoid.extractedText = text
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
      dataVoid.hasilAnalisis = JSON.stringify(detailValidasi)
      dataVoid.catatanKmp =
        missingPatterns.length === 0
          ? 'Sistem: Dokumen Terdeteksi Lengkap.'
          : `Sistem: Pola tidak ditemukan pada: [${missingPatterns.join(', ')}]`
    }

    // 3. Update ke DB (pake await)
    // Gunakan Number(id) untuk memastikan tipe data sesuai
    const updatePengajuanVoid = await editPengajuanVoid(Number(id), dataVoid)
    return updatePengajuanVoid
  } catch (error) {
    console.error('Error saat update pengajuan Void:', error)
    throw error // Sangat penting agar controller tahu kalau ini gagal
  }
}

async function deletePengajuanVoidById (id) {
  await getPengajuanVoidById(id)
  await deletePengajuanVoid(Number(id))
}

module.exports = {
  creatPengajuanVoid,
  getAllPengajuanVoid,
  getPengajuanVoidById,
  getAllAdminUsers,
  editPengajuanVoidById,
  deletePengajuanVoidById
}
