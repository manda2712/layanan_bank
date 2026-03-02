// const axios = require('axios')
// const FormData = require('form-data')
// const { runRBS } = require('../rbs')
// const {
//   insertRetur,
//   findRetur,
//   findReturById,
//   editRetur,
//   deleteDataRetur
// } = require('./returSp2d.repository')

// const { getAllAdminUsers } = require('../user/user.services') // Import service user
// const { createNotification } = require('../notifikasi/notifikasi.repository')

// async function createRetur (dataRetur, userId) {
//   try {
//     if (!userId) {
//       throw new Error('UserId Tidak Ditemukan')
//     }
//     // ✅ Validasi alasan lainnya jika enum-nya LAINNYA
//     if (dataRetur.alasanRetur === 'LAINNYA' && !dataRetur.alasanLainnya) {
//       throw new Error('Alasan lainnya wajib diisi jika memilih LAINNYA.')
//     }

//     if (!dataRetur.unggah_dokumen) {
//       throw new Error('Dokumen wajib diunggah.')
//     }

//     // ------------------------------------------
//     // 1️⃣ Proses OCR
//     // ------------------------------------------

//     async function sendToOCR (fileUrl) {
//       const fileBuffer = await axios.get(fileUrl, {
//         responseType: 'arraybuffer'
//       })

//       const form = new FormData()
//       form.append('file', fileBuffer.data, {
//         filename: 'dokumen.pdf',
//         contentType: 'application/pdf'
//       })

//       const ocrResponse = await axios.post('http://localhost:5000/ocr', form, {
//         headers: form.getHeaders()
//       })

//       return ocrResponse.data.text
//     }

//     // 👉 panggil fungsi OCR
//     const extractedText = await sendToOCR(dataRetur.unggah_dokumen)

//     // ------------------------------------------
//     // 2️⃣ Jalankan RBS
//     // ------------------------------------------

//     const rbsResult = await runRBS('returSp2d', extractedText)

//     // ------------------------------------------
//     // 3️⃣ Simpan ke database
//     // ------------------------------------------
//     const newRetur = await insertRetur(
//       dataRetur,
//       userId,
//       extractedText,
//       JSON.stringify(rbsResult)
//     )

//     console.log('Data yang akan disimpan:', dataRetur)

//     console.log('Koreksi Penerimaan berhasil dibuat:', newRetur)

//     // 🔔 Kirim notifikasi ke semua admin
//     const adminUsers = await getAllAdminUsers()
//     const notifMessage = `Kode Satker ${newRetur.kodeSatker} telah mengajukan dokumen Penyelesaian Retur.`

//     for (const admin of adminUsers) {
//       await createNotification({
//         userId: admin.id,
//         message: notifMessage,
//         monitoringId: newRetur.monitoring?.id || null, // pastikan ini sesuai schema
//         monitoringType: 'returSp2d' // isi sesuai kebutuhan
//       })
//     }
//     return newRetur
//   } catch (error) {
//     console.error('Error sata membuat data Retur SP2D', error)
//     throw new Error('gagal membuat retur SP2D')
//   }
// }

// async function getAllRetur () {
//   const returSp2d = findRetur()
//   return returSp2d
// }

// async function getAllReturById (id) {
//   console.log('Cek ID di service:', id)
//   const returSp2d = await findReturById(id)
//   if (!returSp2d) {
//     throw new Error('Tidak dapat menemukan data retur')
//   }
//   return returSp2d
// }

// async function editReturById (id, dataRetur) {
//   const returSp2d = await getAllReturById(id)

//   const isRejected = Array.isArray(returSp2d.monitoring)
//     ? returSp2d.monitoring.some(m => m.status === 'DITOLAK')
//     : false

//   if (isRejected && !dataRetur.unggah_dokumen) {
//     throw new Error('Dokumen baru harus diunggah setelah penolakan.')
//   }

//   if (dataRetur.alasanRetur === 'LAINNYA' && !dataRetur.alasanLainnya) {
//     throw new Error('Alasan lainnya wajib diisi jika memilih LAINNYA.')
//   }
//   try {
//     // Periksa jika unggah_dokumen bukan URL (misalnya filename saja)
//     if (
//       dataRetur.unggah_dokumen &&
//       !dataRetur.unggah_dokumen.startsWith('http')
//     ) {
//       throw new Error('Unggah dokumen harus berupa URL yang valid.')
//     }
//     const updatedRetur = await editRetur(id, dataRetur)
//     // 🔔 Kirim notifikasi ke semua admin setelah edit berhasil
//     const adminUsers = await getAllAdminUsers()
//     const notifMessage = `Kode Satker ${updatedRetur.kodeSatker} telah mengupdate dokumen Penyelesaian Retur.`

//     for (const admin of adminUsers) {
//       await createNotification({
//         userId: admin.id,
//         message: notifMessage,
//         monitoringId: updatedRetur.monitoring?.id || null, // pastikan ini sesuai schema
//         monitoringType: 'returSp2d' // isi sesuai kebutuhan
//       })
//     }
//     return updatedRetur
//   } catch (error) {
//     console.error('Error saat update retur:', error)
//     throw new Error('Gagal mengupdate retur SP2D: ' + error.message)
//   }
// }

// async function deleteReturById (id) {
//   await getAllReturById(id)
//   await deleteDataRetur(id)
// }

// module.exports = {
//   createRetur,
//   getAllRetur,
//   getAllReturById,
//   editReturById,
//   deleteReturById
// }

// const fs = require('fs')
// const path = require('path')
// const axios = require('axios')
// const FormData = require('form-data')
// const { runRBS } = require('../rbs')
// const {
//   insertRetur,
//   findRetur,
//   findReturById,
//   editRetur,
//   deleteDataRetur
// } = require('./returSp2d.repository')

// const { getAllAdminUsers } = require('../user/user.services')
// const { kmpSearch } = require('../utils/kmp')
// const patterns = require('../config/returPatterns')
// const { createNotification } = require('../notifikasi/notifikasi.repository')

// // Pastikan folder uploads ada
// const uploadsPath = path.join(__dirname, '../uploads')
// if (!fs.existsSync(uploadsPath)) fs.mkdirSync(uploadsPath)

// async function createRetur (dataRetur, userId, file) {
//   try {
//     if (!userId) throw new Error('UserId Tidak Ditemukan')
//     if (!file) throw new Error('Dokumen wajib diunggah!')

//     // Validasi alasan lainnya
//     if (dataRetur.alasanRetur === 'LAINNYA' && !dataRetur.alasanLainnya) {
//       throw new Error('Alasan lainnya wajib diisi jika memilih LAINNYA.')
//     }

//     // Simpan file ke folder uploads lokal
//     const filename = Date.now() + '-' + file.originalname
//     const filePath = path.join(uploadsPath, filename)
//     fs.writeFileSync(filePath, file.buffer)
//     dataRetur.unggah_dokumen = filePath // simpan path lokal ke DB

//     // OCR
//     async function sendToOCR (filePath) {
//       const fileBuffer = fs.readFileSync(filePath)
//       const form = new FormData()
//       form.append('file', fileBuffer, {
//         filename: 'dokumen.pdf',
//         contentType: 'application/pdf'
//       })
//       const ocrResponse = await axios.post('http://localhost:5000/ocr', form, {
//         headers: form.getHeaders()
//       })
//       return ocrResponse.data.text
//     }

//     const extractedText = await sendToOCR(filePath)

//     // Jalankan RBS
//     const rbsResult = await runRBS('returSp2d', extractedText)

//     dataRetur.extractedText = extractedText
//     dataRetur.rbsResult = JSON.stringify(rbsResult)

//     // Simpan ke DB
//     const newRetur = await insertRetur(dataRetur, userId)
//     console.log('Koreksi Penerimaan berhasil dibuat:', newRetur)

//     let rbsResultParsed = {}
//     try {
//       rbsResultParsed = JSON.parse(newRetur.rbsResult)
//     } catch (err) {
//       console.error('Error parsing rbsResult:', err)
//     }

//     // Notifikasi admin
//     const adminUsers = await getAllAdminUsers()
//     const notifMessage = `Kode Satker ${newRetur.kodeSatker} telah mengajukan dokumen Penyelesaian Retur.`
//     const monitoringId = newRetur.monitoring?.[0]?.id || null

//     for (const admin of adminUsers) {
//       await createNotification({
//         userId: admin.id,
//         message: notifMessage,
//         monitoringId,
//         monitoringType: 'returSp2d'
//       })
//     }

//     return { ...newRetur, rbsResult: rbsResultParsed }
//   } catch (error) {
//     console.error('Error saat membuat data Retur SP2D', error)
//     throw new Error('Gagal membuat retur SP2D: ' + error.message)
//   }
// }
// async function getAllRetur () {
//   return await findRetur()
// }

// async function getAllReturById (id) {
//   const returSp2d = await findReturById(id)
//   if (!returSp2d) throw new Error('Tidak dapat menemukan data retur')
//   return returSp2d
// }

// async function editReturById (id, dataRetur) {
//   const returSp2d = await getAllReturById(id)

//   const isRejected = Array.isArray(returSp2d.monitoring)
//     ? returSp2d.monitoring.some(m => m.status === 'DITOLAK')
//     : false

//   if (isRejected && !dataRetur.unggah_dokumen) {
//     throw new Error('Dokumen baru harus diunggah setelah penolakan.')
//   }

//   if (dataRetur.alasanRetur === 'LAINNYA' && !dataRetur.alasanLainnya) {
//     throw new Error('Alasan lainnya wajib diisi jika memilih LAINNYA.')
//   }

//   try {
//     if (
//       dataRetur.unggah_dokumen &&
//       !dataRetur.unggah_dokumen.startsWith('http')
//     ) {
//       throw new Error('Unggah dokumen harus berupa URL yang valid.')
//     }

//     const updatedRetur = await editRetur(id, dataRetur)

//     // Notifikasi setelah update
//     const adminUsers = await getAllAdminUsers()
//     const notifMessage = `Kode Satker ${updatedRetur.kodeSatker} telah mengupdate dokumen Penyelesaian Retur.`

//     const monitoringId = updatedRetur.monitoring?.[0]?.id || null

//     for (const admin of adminUsers) {
//       await createNotification({
//         userId: admin.id,
//         message: notifMessage,
//         monitoringId,
//         monitoringType: 'returSp2d'
//       })
//     }

//     return updatedRetur
//   } catch (error) {
//     console.error('Error saat update retur:', error)
//     throw new Error('Gagal mengupdate retur SP2D: ' + error.message)
//   }
// }

// async function deleteReturById (id) {
//   await getAllReturById(id)
//   await deleteDataRetur(id)
// }

// module.exports = {
//   createRetur,
//   getAllRetur,
//   getAllReturById,
//   editReturById,
//   deleteReturById
// }

const fs = require('fs')
const path = require('path')
const axios = require('axios')
const FormData = require('form-data')

const {
  insertRetur,
  findRetur,
  findReturById,
  editRetur,
  deleteDataRetur
} = require('./returSp2d.repository')

const { getAllAdminUsers } = require('../user/user.services')
const { createNotification } = require('../notifikasi/notifikasi.repository')

const { kmpSearch } = require('../utils/kmp')
const patterns = require('../config/returSp2dPattern')

// Pastikan folder uploads ada
const uploadsPath = path.join(__dirname, '../uploads')
if (!fs.existsSync(uploadsPath)) fs.mkdirSync(uploadsPath)

// ==========================
// CREATE RETUR
// ==========================
async function createRetur (dataRetur, userId, file) {
  try {
    if (!userId) throw new Error('UserId Tidak Ditemukan')
    if (!file) throw new Error('Dokumen wajib diunggah!')

    if (dataRetur.alasanRetur === 'LAINNYA' && !dataRetur.alasanLainnya) {
      throw new Error('Alasan lainnya wajib diisi jika memilih LAINNYA.')
    }

    // ======================
    // SIMPAN FILE
    // ======================
    const filename = Date.now() + '-' + file.originalname
    const filePath = path.join(uploadsPath, filename)
    fs.writeFileSync(filePath, file.buffer)

    dataRetur.unggah_dokumen = filePath

    // ======================
    // OCR
    // ======================
    async function sendToOCR (filePath) {
      const fileBuffer = fs.readFileSync(filePath)

      const form = new FormData()
      form.append('file', fileBuffer, {
        filename: 'dokumen.pdf',
        contentType: 'application/pdf'
      })

      const ocrResponse = await axios.post('http://localhost:5000/ocr', form, {
        headers: form.getHeaders()
      })

      return ocrResponse.data.text
    }

    const extractedText = await sendToOCR(filePath)
    dataRetur.extractedText = extractedText

    // ======================
    // VALIDASI DENGAN KMP
    // WAJIB SEMUA PATTERN ADA
    // ======================
    const lowerText = extractedText.toLowerCase()
    const validationResults = {}
    const missingPatterns = []

    for (const [key, patternList] of Object.entries(patterns)) {
      const ditemukan = patternList.some(pattern =>
        kmpSearch(lowerText, pattern.toLowerCase())
      )

      validationResults[key] = ditemukan

      if (!ditemukan) {
        missingPatterns.push(key)
      }
    }

    // ======================
    // SIMPAN KE DATABASE
    // ======================
    const newRetur = await insertRetur(dataRetur, userId)
    return newRetur
  } catch (error) {
    console.error('Error saat membuat data Retur SP2D', error)
    throw new Error('Gagal membuat retur SP2D: ' + error.message)
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
async function editReturById (id, dataRetur) {
  const returSp2d = await getAllReturById(id)

  const isRejected = Array.isArray(returSp2d.monitoring)
    ? returSp2d.monitoring.some(m => m.status === 'DITOLAK')
    : false

  if (isRejected && !dataRetur.unggah_dokumen) {
    throw new Error('Dokumen baru harus diunggah setelah penolakan.')
  }

  if (dataRetur.alasanRetur === 'LAINNYA' && !dataRetur.alasanLainnya) {
    throw new Error('Alasan lainnya wajib diisi jika memilih LAINNYA.')
  }

  try {
    const updatedRetur = await editRetur(id, dataRetur)

    const adminUsers = await getAllAdminUsers()
    const notifMessage = `Kode Satker ${updatedRetur.kodeSatker} telah mengupdate dokumen Penyelesaian Retur.`
    const monitoringId = updatedRetur.monitoring?.[0]?.id || null

    for (const admin of adminUsers) {
      await createNotification({
        userId: admin.id,
        message: notifMessage,
        monitoringId,
        monitoringType: 'returSp2d'
      })
    }

    return updatedRetur
  } catch (error) {
    console.error('Error saat update retur:', error)
    throw new Error('Gagal mengupdate retur SP2D: ' + error.message)
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
