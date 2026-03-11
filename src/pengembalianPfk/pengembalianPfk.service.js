// const path = require('path')
// const prisma = require('../db')
// const {
//   insertPengembalianPfk,
//   findPengembalianPfk,
//   findPengembalianPfkById,
//   editPengembalianPfk
// } = require('./pengembalianPfk.repository')

// const { getAllAdminUsers } = require('../user/user.services') // Import service user
// const { createNotification } = require('../notifikasi/notifikasi.repository')
// const ocrService = require('../service/ocrService')
// const { kmpSearch } = require('../utils/kmp')
// const patterns = require('../config/penerbitanPfk')

// const uploadsPath = path.join(__dirname, '../uploads')
// if (!fs.existsSync(uploadsPath)) fs.mkdirSync(uploadsPath)

// async function createPengembalianPfk (dataPfk, userId) {
//   try {
//     if (!userId) throw new Error('User Id Tidak Ditemukan')
//     if (!file) throw new Error('Dokumen wajib diunggah!')

//     const userData = await prisma.user.findUnique({
//       where: { id: userId },
//       select: { satkerId: true }
//     })
//     if (!userData?.satkerId) {
//       throw new Error('User belum terdaftar di Satker manapun.')
//     }
//     const satkerId = userData.satkerId
//     const filename = `${Date.now()}-${file.originalname}`
//     const filePath = path.join(uploadsPath, filename)
//     fs.writeFileSync(filePath, file.buffer)
//     dataPfk.unggahDokumen = filename
//     const extractedText = await ocrService.extractTextFromPDF(filePath)
//     dataPfk.extractedText = extractedText

//     const lowerText = extractedText.toLowerCase()
//     const missingPatterns = []
//     const detailValidasi = {}

//     for (const [key, patternList] of Object.entries(patterns)) {
//       const pfk = patternList.some(pattern =>
//         kmpSearch(lowerText, pattern.toLowerCase())
//       )
//       detailValidasi[key] = pfk

//       if (!pfk) {
//         missingPatterns.push(key)
//       }
//     }
//     const catatanKmp =
//       missingPatterns.length === 0
//         ? 'Sistem: Dokumen Terdeteksi Lengkap.'
//         : `Sistem: Pola tidak ditemukan pada: [${missingPatterns.join(', ')}]`

//     dataPfk.catatanKmp = catatanKmp
//     dataPfk.hasilAnalisis = JSON.stringify(detailValidasi)

//     const newPfk = await insertPengembalianPfk(dataPfk, userId, satkerId)
//     return newPfk
//   } catch (error) {
//     throw new Error('Gagal Membuat Pengembalian PFK')
//   }
// }

// async function getAllPengembalianPfk () {
//   const pengembalianPfk = findPengembalianPfk()
//   return pengembalianPfk
// }

// async function getPengembalianPfkById (id) {
//   const pengembalianPfk = findPengembalianPfkById(id)
//   if (!pengembalianPfk) {
//     throw new Error('Tidak Dapat Menemukan Pengembalian PFK')
//   }
//   return pengembalianPfk
// }

// async function updatePengembalianPfkById (id, dataPfk, file) {
//   const existingPfk = await getAllPengembalianPfk(id)
//   const isRejected = existingPfk.monitoring?.some(m => m.status === 'DITOLAK')
//   if (isRejected && !file) {
//     throw new Error(
//       'Dokumen baru wajib diunggah karena pengajuan sebelumnya ditolak.'
//     )
//   }
//   try {
//     if (file) {
//       const filename = `${Date.now()}-${file.originalname}`
//       const filePath = path.join(uploadsPath, filename)
//       fs.writeFileSync(filePath, file.buffer)
//       dataPfk.unggahDokumen = filename
//       const extractedText = await ocrService.extractTextFromPDF(filePath)
//       dataPfk.extractedText = extractedText
//     }

//     const updatedPfk = await editPengembalianPfk(id, dataPfk)
//     const adminUser = await getAllAdminUsers()
//     const kodeSatker = updatedPfk.satker?.kodeSatker || 'Unknown'
//     const notifMessage = `Satker ${kodeSatker} memperbarui dokumen pengembalian PFK (ID: ${id}).`

//     for (const admin of adminUser) {
//       await createNotification({
//         userId: admin.id,
//         message: notifMessage,
//         monitoringId: updatedPfk.monitoring?.[0]?.id || null,
//         monitoringType: 'pengembalianPFK'
//       })
//     }
//     return updatedPfk
//   } catch (error) {
//     throw new Error(error.message)
//   }
// }
// async function deletePengembalianPfkById (id) {
//   await getPengembalianPfkById(id)
//   deletePengembalianPfkById(id)
// }

// module.exports = {
//   createPengembalianPfk,
//   getAllPengembalianPfk,
//   getPengembalianPfkById,
//   updatePengembalianPfkById,
//   deletePengembalianPfkById
// }

const path = require('path')
const fs = require('fs') // Tambahkan import fs yang hilang
const prisma = require('../db')
const {
  insertPengembalianPfk,
  findPengembalianPfk,
  findPengembalianPfkById,
  editPengembalianPfk,
  deletePengembalianPfk // Import fungsi delete yang benar
} = require('./pengembalianPfk.repository')

const { getAllAdminUsers } = require('../user/user.services')
const { createNotification } = require('../notifikasi/notifikasi.repository')
const ocrService = require('../service/ocrService')
const { kmpSearch } = require('../utils/kmp')

// Ganti import ke pattern spesifik PFK yang sudah dipisah
const pfkPatterns = require('../config/penerbitanPfk')

const uploadsPath = path.join(__dirname, '../uploads')
if (!fs.existsSync(uploadsPath)) fs.mkdirSync(uploadsPath, { recursive: true })

// Tambahkan 'file' ke parameter fungsi
async function createPengembalianPfk (dataPfk, userId, file) {
  try {
    if (!userId) throw new Error('User Id Tidak Ditemukan')
    if (!file) throw new Error('Dokumen wajib diunggah!')

    const userData = await prisma.user.findUnique({
      where: { id: userId },
      select: { satkerId: true }
    })

    if (!userData?.satkerId) {
      throw new Error('User belum terdaftar di Satker manapun.')
    }

    const satkerId = userData.satkerId
    const filename = `${Date.now()}-${file.originalname}`
    const filePath = path.join(uploadsPath, filename)

    // Simpan file
    fs.writeFileSync(filePath, file.buffer)
    dataPfk.unggahDokumen = filename

    // OCR Ekstraksi
    const extractedText = await ocrService.extractTextFromPDF(filePath)
    dataPfk.extractedText = extractedText
    const lowerText = extractedText.toLowerCase()

    // --- LOGIKA KONDISI PATTERN PFK ---
    // Ambil pattern common + pattern spesifik berdasarkan pihakMengajukan
    const specificKey =
      dataPfk.pihakMengajukan === 'satuan_kerja'
        ? 'satuan_kerja'
        : 'pemerintah_daerah'
    const selectedPatterns = [
      ...pfkPatterns.common,
      ...(pfkPatterns[specificKey] || [])
    ]

    const missingPatterns = []
    const detailValidasi = {}

    for (const pattern of selectedPatterns) {
      const isMatch = kmpSearch(lowerText, pattern.toLowerCase())
      detailValidasi[pattern] = isMatch

      if (!isMatch) {
        missingPatterns.push(pattern)
      }
    }
    // ----------------------------------

    dataPfk.hasilAnalisis = JSON.stringify(detailValidasi)
    dataPfk.catatanKmp =
      missingPatterns.length === 0
        ? 'Sistem: Dokumen Terdeteksi Lengkap.'
        : `Sistem: Pola tidak ditemukan pada: [${missingPatterns.join(', ')}]`

    const newPfk = await insertPengembalianPfk(dataPfk, userId, satkerId)
    return newPfk
  } catch (error) {
    // Berikan pesan error asli agar lebih mudah didebug
    throw new Error('Gagal Membuat Pengembalian PFK: ' + error.message)
  }
}

async function getAllPengembalianPfk () {
  return await findPengembalianPfk()
}

async function getPengembalianPfkById (id) {
  const data = await findPengembalianPfkById(id)
  if (!data) throw new Error('Tidak Dapat Menemukan Pengembalian PFK')
  return data
}

async function updatePengembalianPfkById (id, dataPfk, file) {
  const existingPfk = await getPengembalianPfkById(id)

  // Logika pengecekan status DITOLAK
  const isRejected = existingPfk.monitoring?.some(m => m.status === 'DITOLAK')
  if (isRejected && !file) {
    throw new Error(
      'Dokumen baru wajib diunggah karena pengajuan sebelumnya ditolak.'
    )
  }

  try {
    if (file) {
      const filename = `${Date.now()}-${file.originalname}`
      const filePath = path.join(uploadsPath, filename)
      fs.writeFileSync(filePath, file.buffer)
      dataPfk.unggahDokumen = filename

      const extractedText = await ocrService.extractTextFromPDF(filePath)
      dataPfk.extractedText = extractedText

      // Re-run KMP jika ada file baru (opsional tapi disarankan)
      const specificKey =
        dataPfk.pihakMengajukan === 'satuan_kerja'
          ? 'satuan_kerja'
          : 'pemerintah_daerah'
      const selectedPatterns = [
        ...pfkPatterns.common,
        ...(pfkPatterns[specificKey] || [])
      ]
      const detailValidasi = {}
      selectedPatterns.forEach(p => {
        detailValidasi[p] = kmpSearch(
          extractedText.toLowerCase(),
          p.toLowerCase()
        )
      })
      dataPfk.hasilAnalisis = JSON.stringify(detailValidasi)
    }

    const updatedPfk = await editPengembalianPfk(id, dataPfk)

    // Kirim Notifikasi ke Admin
    const adminUsers = await getAllAdminUsers()
    const kodeSatker = updatedPfk.satker?.kodeSatker || 'Unknown'
    const notifMessage = `Satker ${kodeSatker} memperbarui dokumen PFK (ID: ${id}).`

    for (const admin of adminUsers) {
      await createNotification({
        userId: admin.id,
        message: notifMessage,
        monitoringId: updatedPfk.monitoring?.[0]?.id || null,
        monitoringType: 'pengembalianPFK'
      })
    }
    return updatedPfk
  } catch (error) {
    throw new Error(error.message)
  }
}

async function deletePengembalianPfkById (id) {
  await getPengembalianPfkById(id) // Pastikan data ada
  return await deletePengembalianPfk(id) // Panggil fungsi delete dari repository
}

module.exports = {
  createPengembalianPfk,
  getAllPengembalianPfk,
  getPengembalianPfkById,
  updatePengembalianPfkById,
  deletePengembalianPfkById
}
