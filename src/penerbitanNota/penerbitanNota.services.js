// const fs = require('fs')
// const path = require('path')
// const prisma = require('../db')
// const AdmZip = require('adm-zip')
// const {
//   InsertPenerbitanNota,
//   findPenerbitanNota,
//   findPenerbitanNotaById,
//   editPenerbitanNota,
//   deletePenerbitanNota
// } = require('./penerbitanNota.repository')

// const { getAllAdminUsers } = require('../user/user.services') // Import service user
// const { createNotification } = require('../notifikasi/notifikasi.repository')
// const ocrService = require('../service/ocrService')
// const { kmpSearch } = require('../utils/kmp')
// const patterns = require('../config/penerbtanNotaPattern')

// const uploadsPath = path.join(__dirname, '../uploads')
// if (!fs.existsSync(uploadsPath)) fs.mkdirSync(uploadsPath)

// const validateADKLine = line => {
//   // Regex: 16 karakter Alfanumerik; Angka; Angka; Angka; Angka
//   const adkRegex = /^[A-Z0-9]{16};[0-9]+;[0-9]+;[0-9]+;[0-9]+$/
//   return adkRegex.test(line.trim())
// }

// async function createPenerbitanNota (dataNota, userId, file) {
//   try {
//     if (!userId) throw new Error('User Id Tidak Ditemukan')
//     if (!file) throw new Error('Dokumen wajib diunggah!')

//     // 1. Ambil data Satker User
//     const userData = await prisma.user.findUnique({
//       where: { id: userId },
//       select: { satkerId: true }
//     })
//     if (!userData?.satkerId) throw new Error('User belum terdaftar di Satker.')

//     const satkerId = userData.satkerId
//     let extractedText = ''
//     let adkValid = false

//     // 2. Proses File (ZIP atau PDF)
//     if (
//       file.mimetype === 'application/zip' ||
//       file.originalname.endsWith('.zip')
//     ) {
//       const zip = new AdmZip(file.buffer)
//       const zipEntries = zip.getEntries()

//       for (const entry of zipEntries) {
//         const entryName = entry.entryName

//         // A. Jika ketemu file ADK (.txt)
//         if (entryName.toLowerCase().endsWith('.txt')) {
//           const content = entry.getData().toString('utf8').trim()
//           const lines = content.split('\n')
//           // Cek apakah semua baris di TXT sesuai format (Regex)
//           adkValid = lines.every(line => validateADKLine(line))
//         }

//         // B. Jika ketemu file PDF (Mencari Surat Permohonan/Rekap)
//         if (
//           entryName.toLowerCase().endsWith('.pdf') &&
//           !entryName.startsWith('__MACOSX')
//         ) {
//           // Simpan sementara untuk di-OCR
//           const tempPath = path.join(
//             uploadsPath,
//             `temp-${Date.now()}-${entryName.split('/').pop()}`
//           )
//           fs.writeFileSync(tempPath, entry.getData())
//           const text = await ocrService.extractTextFromPDF(tempPath)
//           extractedText += ' ' + text // Gabungkan teks jika ada lebih dari 1 PDF
//           fs.unlinkSync(tempPath) // Hapus file temp
//         }
//       }
//     } else if (file.mimetype === 'application/pdf') {
//       // Jika yang diupload PDF satuan (bukan ZIP)
//       const tempPath = path.join(
//         uploadsPath,
//         `temp-${Date.now()}-${file.originalname}`
//       )
//       fs.writeFileSync(tempPath, file.buffer)
//       extractedText = await ocrService.extractTextFromPDF(tempPath)
//       fs.unlinkSync(tempPath)
//     }

//     // 3. Simpan File Asli yang diupload user ke folder uploads
//     const filename = `${Date.now()}-${file.originalname}`
//     const filePath = path.join(uploadsPath, filename)
//     fs.writeFileSync(filePath, file.buffer)
//     dataNota.unggahDokumen = filename

//     // 4. Analisis Teks menggunakan KMP Search & Validasi ADK
//     const lowerText = extractedText.toLowerCase()
//     const detailValidasi = {}
//     const missingPatterns = []

//     // Tambahkan hasil ADK ke detailValidasi agar tidak ikut di-loop di bawah
//     detailValidasi['ADK_FORMAT_VALID'] = adkValid
//     if (!adkValid) missingPatterns.push('ADK_FORMAT_VALID')

//     // Loop untuk validasi PDF
//     for (const [key, patternList] of Object.entries(patterns)) {
//       // PERBAIKAN: Pastikan patternList adalah Array sebelum pakai .some()
//       if (Array.isArray(patternList)) {
//         const ditemukan = patternList.some(pattern =>
//           kmpSearch(lowerText, pattern.toLowerCase())
//         )
//         detailValidasi[key] = ditemukan

//         if (!ditemukan) {
//           missingPatterns.push(key)
//         }
//       } else {
//         // Jika bukan array (seperti adkKonfirmasi), kita lewati/skip
//         continue
//       }
//     }

//     // 5. Buat Catatan Hasil Analisis Sistem
//     const catatanKmp =
//       missingPatterns.length === 0
//         ? 'Sistem: Dokumen Terdeteksi Lengkap.'
//         : `Sistem: Ketidaksesuaian ditemukan pada: [${missingPatterns.join(
//             ', '
//           )}]`

//     dataNota.catatanKmp = catatanKmp
//     dataNota.hasilAnalisis = JSON.stringify(detailValidasi)
//     dataNota.extractedText = extractedText

//     // 6. Simpan ke Database via Repository
//     const newPenerbitanNota = await InsertPenerbitanNota(
//       dataNota,
//       userId,
//       satkerId
//     )

//     return newPenerbitanNota
//   } catch (error) {
//     console.error('Error di Service Penerbitan Nota:', error)
//     throw new Error(error.message || 'Gagal Membuat Penerbitan Nota')
//   }
// }

// async function getAllPenerbitanNota (userId) {
//   const penerbitanNota = findPenerbitanNota(userId)
//   return penerbitanNota
// }

// async function getPenerbitanNotaById (id, userId) {
//   const penerbitanNota = findPenerbitanNotaById(parseInt(id), parseInt(userId))
//   if (!penerbitanNota) {
//     throw new Error('Tidak Dapat Menemukan Penerbitan Nota')
//   }
//   return penerbitanNota
// }

// async function editPenerbitanNotaById (id, userId, dataNota, file) {
//   try {
//     // 1. Cek apakah data yang mau diedit ada
//     const existingNota = await getPenerbitanNotaById(id, userId)
//     if (!existingNota) throw new Error('Data tidak ditemukan')

//     // 2. Jika ada file baru yang diunggah, proses ulang seperti saat create
//     if (file) {
//       let extractedText = ''
//       let adkValid = false

//       // Proses jika file adalah ZIP
//       if (
//         file.mimetype === 'application/zip' ||
//         file.originalname.endsWith('.zip')
//       ) {
//         const zip = new AdmZip(file.buffer)
//         const zipEntries = zip.getEntries()

//         for (const entry of zipEntries) {
//           const entryName = entry.entryName.toLowerCase()

//           // Validasi ADK (.txt)
//           if (entryName.endsWith('.txt')) {
//             const content = entry.getData().toString('utf8').trim()
//             const lines = content.split('\n')
//             adkValid = lines.every(line => validateADKLine(line))
//           }

//           // Ekstraksi PDF
//           if (entryName.endsWith('.pdf') && !entryName.startsWith('__macosx')) {
//             const tempPath = path.join(
//               uploadsPath,
//               `temp-edit-${Date.now()}-${entryName.split('/').pop()}`
//             )
//             fs.writeFileSync(tempPath, entry.getData())
//             const text = await ocrService.extractTextFromPDF(tempPath)
//             extractedText += ' ' + text
//             if (fs.existsSync(tempPath)) fs.unlinkSync(tempPath)
//           }
//         }
//       } else if (file.mimetype === 'application/pdf') {
//         // Jika upload PDF satuan
//         const tempPath = path.join(
//           uploadsPath,
//           `temp-edit-${Date.now()}-${file.originalname}`
//         )
//         fs.writeFileSync(tempPath, file.buffer)
//         extractedText = await ocrService.extractTextFromPDF(tempPath)
//         if (fs.existsSync(tempPath)) fs.unlinkSync(tempPath)
//       }

//       // Simpan file baru ke folder uploads
//       const filename = `${Date.now()}-${file.originalname}`
//       const filePath = path.join(uploadsPath, filename)
//       fs.writeFileSync(filePath, file.buffer)

//       // Update dataNota dengan file baru
//       dataNota.unggahDokumen = filename
//       dataNota.extractedText = extractedText

//       // Validasi ulang menggunakan KMP dan Regex
//       const lowerText = extractedText.toLowerCase()
//       const detailValidasi = {}
//       const missingPatterns = []

//       detailValidasi['ADK_FORMAT_VALID'] = adkValid
//       if (!adkValid) missingPatterns.push('ADK (.txt) tidak valid')

//       for (const [key, patternList] of Object.entries(patterns)) {
//         if (key === 'adkValidation') continue
//         const ditemukan = patternList.some(pattern =>
//           kmpSearch(lowerText, pattern.toLowerCase())
//         )
//         detailValidasi[key] = ditemukan
//         if (!ditemukan) missingPatterns.push(key)
//       }

//       dataNota.catatanKmp =
//         missingPatterns.length === 0
//           ? 'Sistem: Dokumen Terdeteksi Lengkap.'
//           : `Sistem: Pola tidak ditemukan pada: [${missingPatterns.join(', ')}]`
//       dataNota.hasilAnalisis = JSON.stringify(detailValidasi)
//     }

//     // 3. Update ke Database
//     const updatePenerbitanNota = await editPenerbitanNota(id, userId, dataNota)

//     // 4. Kirim Notifikasi ke Admin bahwa ada perubahan dokumen
//     const adminUsers = await getAllAdminUsers()
//     const notifMessage = `Satker telah memperbarui dokumen Penerbitan Nota (ID: ${id}).`

//     for (const admin of adminUsers) {
//       await createNotification({
//         userId: admin.id,
//         message: notifMessage,
//         monitoringId: updatePenerbitanNota.monitoring?.id || null
//       })
//     }

//     return updatePenerbitanNota
//   } catch (error) {
//     console.error('Error saat update Penerbitan Nota:', error)
//     throw new Error(error.message || 'Gagal memperbarui data')
//   }
// }

// async function deletePenerbitanNotaById (id, userId) {
//   await getPenerbitanNotaById(id, userId)
//   await deletePenerbitanNota(id)
// }

// module.exports = {
//   createPenerbitanNota,
//   getAllPenerbitanNota,
//   getPenerbitanNotaById,
//   editPenerbitanNotaById,
//   deletePenerbitanNotaById
// }

const fs = require('fs')
const path = require('path')
const prisma = require('../db')
const AdmZip = require('adm-zip')
const {
  InsertPenerbitanNota,
  findPenerbitanNota,
  findPenerbitanNotaById,
  editPenerbitanNota,
  deletePenerbitanNota
} = require('./penerbitanNota.repository')

const { getAllAdminUsers } = require('../user/user.services')
const { createNotification } = require('../notifikasi/notifikasi.repository')
const ocrService = require('../service/ocrService')
const { kmpSearch } = require('../utils/kmp')
const patterns = require('../config/penerbtanNotaPattern')

const uploadsPath = path.join(__dirname, '../uploads')
if (!fs.existsSync(uploadsPath)) fs.mkdirSync(uploadsPath)

const validateADKLine = line => {
  const adkRegex = /^[A-Z0-9]{16};[0-9]+;[0-9]+;[0-9]+;[0-9]+$/
  return adkRegex.test(line.trim())
}

async function createPenerbitanNota (dataNota, userId, file) {
  try {
    if (!userId) throw new Error('User Id Tidak Ditemukan')
    if (!file) throw new Error('Dokumen wajib diunggah!')

    const userData = await prisma.user.findUnique({
      where: { id: userId },
      select: { satkerId: true }
    })
    if (!userData?.satkerId) throw new Error('User belum terdaftar di Satker.')

    const satkerId = userData.satkerId
    let extractedText = ''
    let adkValid = false

    if (
      file.mimetype === 'application/zip' ||
      file.originalname.endsWith('.zip')
    ) {
      const zip = new AdmZip(file.buffer)
      const zipEntries = zip.getEntries()

      for (const entry of zipEntries) {
        const entryName = entry.entryName
        if (entryName.toLowerCase().endsWith('.txt')) {
          const content = entry.getData().toString('utf8').trim()
          const lines = content.split('\n')
          adkValid = lines.every(line => validateADKLine(line))
        }

        if (
          entryName.toLowerCase().endsWith('.pdf') &&
          !entryName.startsWith('__MACOSX')
        ) {
          const tempPath = path.join(
            uploadsPath,
            `temp-${Date.now()}-${entryName.split('/').pop()}`
          )
          fs.writeFileSync(tempPath, entry.getData())
          const text = await ocrService.extractTextFromPDF(tempPath)
          extractedText += ' ' + text
          if (fs.existsSync(tempPath)) fs.unlinkSync(tempPath)
        }
      }
    } else if (file.mimetype === 'application/pdf') {
      const tempPath = path.join(
        uploadsPath,
        `temp-${Date.now()}-${file.originalname}`
      )
      fs.writeFileSync(tempPath, file.buffer)
      extractedText = await ocrService.extractTextFromPDF(tempPath)
      if (fs.existsSync(tempPath)) fs.unlinkSync(tempPath)
    }

    const filename = `${Date.now()}-${file.originalname}`
    const filePath = path.join(uploadsPath, filename)
    fs.writeFileSync(filePath, file.buffer)
    dataNota.unggahDokumen = filename

    const lowerText = extractedText.toLowerCase()
    const detailValidasi = {}
    const missingPatterns = []

    detailValidasi['ADK_FORMAT_VALID'] = adkValid
    if (!adkValid) missingPatterns.push('ADK_FORMAT_VALID')

    for (const [key, patternList] of Object.entries(patterns)) {
      if (Array.isArray(patternList)) {
        const ditemukan = patternList.some(pattern =>
          kmpSearch(lowerText, pattern.toLowerCase())
        )
        detailValidasi[key] = ditemukan
        if (!ditemukan) missingPatterns.push(key)
      }
    }

    dataNota.catatanKmp =
      missingPatterns.length === 0
        ? 'Sistem: Dokumen Terdeteksi Lengkap.'
        : `Sistem: Ketidaksesuaian ditemukan pada: [${missingPatterns.join(
            ', '
          )}]`

    dataNota.hasilAnalisis = JSON.stringify(detailValidasi)
    dataNota.extractedText = extractedText

    return await InsertPenerbitanNota(dataNota, userId, satkerId)
  } catch (error) {
    console.error('Error di Service Penerbitan Nota:', error)
    throw new Error(error.message || 'Gagal Membuat Penerbitan Nota')
  }
}

async function getAllPenerbitanNota (userId) {
  return findPenerbitanNota(userId)
}

async function getPenerbitanNotaById (id, userId) {
  const penerbitanNota = await findPenerbitanNotaById(
    parseInt(id),
    parseInt(userId)
  )
  if (!penerbitanNota) throw new Error('Tidak Dapat Menemukan Penerbitan Nota')
  return penerbitanNota
}

async function editPenerbitanNotaById (id, userId, dataNota, file) {
  try {
    const existingNota = await getPenerbitanNotaById(id, userId)
    if (!existingNota) throw new Error('Data tidak ditemukan')

    if (file) {
      let extractedText = ''
      let adkValid = false

      if (
        file.mimetype === 'application/zip' ||
        file.originalname.endsWith('.zip')
      ) {
        const zip = new AdmZip(file.buffer)
        const zipEntries = zip.getEntries()

        for (const entry of zipEntries) {
          const entryName = entry.entryName.toLowerCase()
          if (entryName.endsWith('.txt')) {
            const content = entry.getData().toString('utf8').trim()
            const lines = content.split('\n')
            adkValid = lines.every(line => validateADKLine(line))
          }

          if (entryName.endsWith('.pdf') && !entryName.startsWith('__macosx')) {
            const tempPath = path.join(
              uploadsPath,
              `temp-edit-${Date.now()}-${entryName.split('/').pop()}`
            )
            fs.writeFileSync(tempPath, entry.getData())
            const text = await ocrService.extractTextFromPDF(tempPath)
            extractedText += ' ' + text
            if (fs.existsSync(tempPath)) fs.unlinkSync(tempPath)
          }
        }
      } else if (file.mimetype === 'application/pdf') {
        const tempPath = path.join(
          uploadsPath,
          `temp-edit-${Date.now()}-${file.originalname}`
        )
        fs.writeFileSync(tempPath, file.buffer)
        extractedText = await ocrService.extractTextFromPDF(tempPath)
        if (fs.existsSync(tempPath)) fs.unlinkSync(tempPath)
      }

      const filename = `${Date.now()}-${file.originalname}`
      const filePath = path.join(uploadsPath, filename)
      fs.writeFileSync(filePath, file.buffer)

      dataNota.unggahDokumen = filename
      dataNota.extractedText = extractedText

      const lowerText = extractedText.toLowerCase()
      const detailValidasi = {}
      const missingPatterns = []

      detailValidasi['ADK_FORMAT_VALID'] = adkValid
      if (!adkValid) missingPatterns.push('ADK (.txt) tidak valid')

      // PROTEKSI ERROR: Cek Array.isArray sebelum .some()
      for (const [key, patternList] of Object.entries(patterns)) {
        if (key === 'adkValidation' || key === 'adkKonfirmasi') continue

        if (Array.isArray(patternList)) {
          const ditemukan = patternList.some(pattern =>
            kmpSearch(lowerText, pattern.toLowerCase())
          )
          detailValidasi[key] = ditemukan
          if (!ditemukan) missingPatterns.push(key)
        }
      }

      dataNota.catatanKmp =
        missingPatterns.length === 0
          ? 'Sistem: Dokumen Terdeteksi Lengkap.'
          : `Sistem: Pola tidak ditemukan pada: [${missingPatterns.join(', ')}]`
      dataNota.hasilAnalisis = JSON.stringify(detailValidasi)
    }

    const updatePenerbitanNota = await editPenerbitanNota(id, userId, dataNota)

    const adminUsers = await getAllAdminUsers()
    const notifMessage = `Satker telah memperbarui dokumen Penerbitan Nota (ID: ${id}).`

    for (const admin of adminUsers) {
      await createNotification({
        userId: admin.id,
        message: notifMessage,
        monitoringId: updatePenerbitanNota.monitoring?.[0]?.id || null
      })
    }

    return updatePenerbitanNota
  } catch (error) {
    console.error('Error saat update Penerbitan Nota:', error)
    throw new Error(error.message || 'Gagal memperbarui data')
  }
}

async function deletePenerbitanNotaById (id, userId) {
  await getPenerbitanNotaById(id, userId)
  await deletePenerbitanNota(id, userId)
}

module.exports = {
  createPenerbitanNota,
  getAllPenerbitanNota,
  getPenerbitanNotaById,
  editPenerbitanNotaById,
  deletePenerbitanNotaById
}
