const fs = require('fs')
const path = require('path')
const prisma = require('../db')
const {
  InsertPenerbitanBukti,
  findPenerbitan,
  findPenerbitanBuktiById,
  editPenerbitanBukti,
  deletePenerbitanBukti
} = require('./penerbitanBukti.repository')

const { getAllAdminUsers } = require('../user/user.services') // Import service user
const { createNotification } = require('../notifikasi/notifikasi.repository')
const ocrService = require('../service/ocrService')
const { kmpSearch } = require('../utils/kmp')
const patterns = require('../config/penerbitanBuktiPattern')

const uploadsPath = path.join(__dirname, '../uploads')
if (!fs.existsSync(uploadsPath)) fs.mkdirSync(uploadsPath)

async function createPenerbitanBukti (dataBukti, userId, file) {
  try {
    if (!userId) throw new Error('User Id Tidak Ditemukan')
    if (!file) throw new Error('Dokumen wajib diunggah!')

    // 1. Ambil data user secara bersih
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { satkerId: true }
    })

    if (!user || !user.satkerId) {
      throw new Error('User belum terdaftar pada Satker mana pun.')
    }

    // Definisikan satkerId secara eksplisit
    const satkerId = user.satkerId

    const filename = `${Date.now()}-${file.originalname}`
    const filePath = path.join(uploadsPath, filename)
    fs.writeFileSync(filePath, file.buffer)

    dataBukti.unggah_dokumen = filename

    // 2. Proses OCR berdasarkan dokumen Ditreskrimum [cite: 1, 28]
    const extractedText = await ocrService.extractTextFromPDF(filePath)
    dataBukti.extractedText = extractedText

    const lowerText = extractedText.toLowerCase()
    const missingPatterns = []
    const detailValidasi = {}

    // 3. Validasi KMP menggunakan pattern BPN
    // Pastikan patterns di-import dari config yang benar (BPN, bukan Retur)
    for (const [key, patternList] of Object.entries(patterns)) {
      const ditemukan = patternList.some(pattern =>
        kmpSearch(lowerText, pattern.toLowerCase())
      )

      detailValidasi[key] = ditemukan
      if (!ditemukan) {
        missingPatterns.push(key)
      }
    }

    // 4. Set Catatan KMP
    const catatanKmp =
      missingPatterns.length === 0
        ? 'Sistem: Dokumen Terdeteksi Lengkap.'
        : `Sistem: Pola tidak ditemukan pada: [${missingPatterns.join(', ')}]`

    dataBukti.catatanKmp = catatanKmp
    dataBukti.hasilAnalisis = JSON.stringify(detailValidasi)

    // 5. Simpan ke Repository (Pastikan parameter urut)
    const newPenerbitanBukti = await InsertPenerbitanBukti(
      dataBukti,
      userId,
      satkerId
    )

    return newPenerbitanBukti
  } catch (error) {
    console.error('DEBUG ERROR:', error.message)
    // Melempar pesan error spesifik agar muncul di log controller Anda
    throw new Error('Gagal Membuat Penerbitan Bukti: ' + error.message)
  }
}

async function getAllPenerbitanBukti () {
  const penerbitanBukti = findPenerbitan()
  return penerbitanBukti
}

async function getPenerbitanBuktiById (id) {
  const penerbitanBukti = await findPenerbitanBuktiById(id)
  if (!penerbitanBukti) {
    throw new Error('Tidak Dapat Menemukan Penerbitan Bukti Yang dicari')
  }
  return penerbitanBukti
}

async function editPenerbitanBuktiById (id, dataBukti, file) {
  const existPenerbitanBukti = await getPenerbitanBuktiById(id)

  try {
    if (file) {
      const filename = `${Date.now()}-${file.originalname}`
      const filePath = path.join(uploadsPath, filename)
      fs.writeFileSync(filePath, file.buffer)

      dataBukti.unggah_dokumen = filename

      const extractedText = await ocrService.extractTextFromPDF(filePath)
      dataBukti.extractedText = extractedText
    }
    const updateBukti = await editPenerbitanBukti(id, dataBukti)
    const adminUsers = await getAllAdminUsers()

    return await editPenerbitanBukti(id, dataBukti)
  } catch (error) {
    console.error('Error saat update retur:', error)
    throw error
  }
}

async function deletePenerbitanBuktiById (id) {
  await getPenerbitanBuktiById(id)
  await deletePenerbitanBukti(id)
}

module.exports = {
  createPenerbitanBukti,
  findPenerbitan,
  getAllPenerbitanBukti,
  getPenerbitanBuktiById,
  editPenerbitanBuktiById,
  deletePenerbitanBuktiById
}
