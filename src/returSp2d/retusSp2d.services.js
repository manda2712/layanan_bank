const fs = require('fs')
const path = require('path')
const prisma = require('../db')
const {
  insertRetur,
  findRetur,
  findReturById,
  editRetur,
  deleteDataRetur
} = require('./returSp2d.repository')

const { getAllAdminUsers } = require('../user/user.services')
const { createNotification } = require('../notifikasi/notifikasi.repository')
const ocrService = require('../service/ocrService')

const { kmpSearch } = require('../utils/kmp')
const patterns = require('../config/returSp2dPattern')

const uploadsPath = path.join(__dirname, '../uploads')
if (!fs.existsSync(uploadsPath)) fs.mkdirSync(uploadsPath)

async function createRetur (dataRetur, userId, file) {
  try {
    // 1. Validasi Dasar
    if (!userId) throw new Error('UserId Tidak Ditemukan')
    if (!file) throw new Error('Dokumen wajib diunggah!')
    if (dataRetur.alasanRetur === 'LAINNYA' && !dataRetur.alasanLainnya) {
      throw new Error('Alasan lainnya wajib diisi jika memilih LAINNYA.')
    }

    // 2. Ambil satkerId otomatis dari User yang Login
    const userData = await prisma.user.findUnique({
      where: { id: userId },
      select: { satkerId: true }
    })
    if (!userData?.satkerId)
      throw new Error('User belum terdaftar di Satker manapun.')
    const satkerId = userData.satkerId

    // 3. Simpan File ke Folder Uploads
    const filename = `${Date.now()}-${file.originalname}`
    const filePath = path.join(uploadsPath, filename)
    fs.writeFileSync(filePath, file.buffer)

    // Simpan path relatif atau nama file saja ke DB agar lebih rapi
    dataRetur.unggah_dokumen = filename

    // 4. Proses OCR melalui Service Terpisah
    const extractedText = await ocrService.extractTextFromPDF(filePath)
    dataRetur.extractedText = extractedText

    // 5. Validasi KMP (Perbaikan di sini)
    const lowerText = extractedText.toLowerCase()
    const missingPatterns = []
    const detailValidasi = {} // Inisialisasi objek di sini

    for (const [key, patternList] of Object.entries(patterns)) {
      const ditemukan = patternList.some(pattern =>
        kmpSearch(lowerText, pattern.toLowerCase())
      )

      // Simpan status true/false untuk tiap key pattern
      detailValidasi[key] = ditemukan

      if (!ditemukan) {
        missingPatterns.push(key)
      }
    }

    // Buat catatan ringkasan untuk Admin
    const catatanKmp =
      missingPatterns.length === 0
        ? 'Sistem: Dokumen Terdeteksi Lengkap.'
        : `Sistem: Pola tidak ditemukan pada: [${missingPatterns.join(', ')}]`

    dataRetur.catatanKmp = catatanKmp
    // Simpan objek detail (true/false) ke string JSON
    dataRetur.hasilAnalisis = JSON.stringify(detailValidasi)

    // 6. Simpan ke Database melalui Repository
    // Kita kirim dataRetur, userId, dan satkerId yang didapat otomatis tadi
    const newRetur = await insertRetur(dataRetur, userId, satkerId)

    return newRetur
  } catch (error) {
    console.error('Error detail:', error)
    throw new Error(error.message)
  }
}

// ==========================
// GET ALL
// ==========================
async function getAllRetur () {
  return await findRetur()
}

// ==========================
// GET BY ID
// ==========================
async function getAllReturById (id) {
  const returSp2d = await findReturById(id)
  if (!returSp2d) throw new Error('Tidak dapat menemukan data retur')
  return returSp2d
}

// ==========================
// EDIT
// ==========================
async function editReturById (id, dataRetur, file) {
  // 1. Cek keberadaan data
  const existingRetur = await getAllReturById(id)

  // 2. Validasi Bisnis (Jika status DITOLAK, wajib upload ulang)
  const isRejected = existingRetur.monitoring?.some(m => m.status === 'DITOLAK')
  if (isRejected && !file) {
    throw new Error(
      'Dokumen baru wajib diunggah karena pengajuan sebelumnya ditolak.'
    )
  }

  try {
    // 3. Jika ada file baru, jalankan OCR lagi
    if (file) {
      const filename = `${Date.now()}-${file.originalname}`
      const filePath = path.join(uploadsPath, filename)
      fs.writeFileSync(filePath, file.buffer)
      dataRetur.unggah_dokumen = filename

      const extractedText = await ocrService.extractTextFromPDF(filePath)
      dataRetur.extractedText = extractedText
    }

    // 4. Update via Repository
    const updatedRetur = await editRetur(id, dataRetur)

    // 5. Notifikasi ke Admin
    const adminUsers = await getAllAdminUsers()
    const kodeSatker = updatedRetur.satker?.kodeSatker || 'Unknown'
    const notifMessage = `Satker ${kodeSatker} memperbarui dokumen Retur SP2D (ID: ${id}).`

    for (const admin of adminUsers) {
      await createNotification({
        userId: admin.id,
        message: notifMessage,
        monitoringId: updatedRetur.monitoring?.[0]?.id || null,
        monitoringType: 'returSp2d'
      })
    }

    return updatedRetur
  } catch (error) {
    console.error('Error saat update retur:', error)
    throw new Error(error.message)
  }
}

// ==========================
// DELETE
// ==========================
async function deleteReturById (id) {
  await getAllReturById(id)
  await deleteDataRetur(id)
}

module.exports = {
  createRetur,
  getAllRetur,
  getAllReturById,
  editReturById,
  deleteReturById
}
