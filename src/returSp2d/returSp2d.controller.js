const express = require('express')
const router = express.Router()
const multer = require('multer')
const cloudinary = require('../config/cloudinary')
const returService = require('./retusSp2d.services')
const authorizeJWT = require('../middleware/authorizeJWT')

// Gunakan memoryStorage agar file langsung diunggah ke Cloudinary
const storage = multer.memoryStorage()
const upload = multer({ storage })

// Route untuk membuat retur
router.post(
  '/create',
  authorizeJWT,
  upload.single('unggah_dokumen'),
  async (req, res) => {
    try {
      console.log('user Id dari request:', req.userId)

      if (!req.userId) {
        return res.status(401).json({ message: 'User Belum Terautentikasi' })
      }

      const { kodeSatker, noTelpon, alasanRetur, alasanLainnya } = req.body

      if (!kodeSatker || !noTelpon || !alasanRetur) {
        return res.status(400).json({ message: 'Semua field wajib diisi!' })
      }

      if (!req.file) {
        return res.status(400).json({ message: 'Dokumen wajib diunggah!' })
      }

      // Fungsi untuk upload file ke Cloudinary
      const uploadToCloudinary = buffer =>
        new Promise((resolve, reject) => {
          const stream = cloudinary.uploader.upload_stream(
            { resource_type: 'auto' }, // Resource type auto agar otomatis deteksi tipe file
            (error, result) => {
              if (error) reject(error)
              else resolve(result)
            }
          )
          stream.end(buffer)
        })

      // Upload file ke Cloudinary
      const result = await uploadToCloudinary(req.file.buffer)
      const fileUrl = result.secure_url
      console.log('File yang diupload ke Cloudinary:', fileUrl)

      const dataRetur = await returService.createRetur(
        {
          kodeSatker,
          noTelpon,
          alasanRetur,
          alasanLainnya,
          unggah_dokumen: fileUrl
        },
        req.userId
      )

      res
        .status(201)
        .json({ dataRetur, message: 'Pembuatan Retur SP2D berhasil!' })
    } catch (error) {
      console.error('Error di Controller:', error)
      res.status(400).send(error.message)
    }
  }
)

// Route untuk mengambil semua retur
router.get('/', async (req, res) => {
  try {
    const returSp2d = await returService.findRetur()
    res.status(200).json(returSp2d)
  } catch (error) {
    res.status(500).send(error.message)
  }
})

// Route untuk mengambil retur berdasarkan ID
router.get('/:id', async (req, res) => {
  try {
    const returId = parseInt(req.params.id)
    const dataRetur = await returService.getAllReturById(returId)
    res.status(200).json(dataRetur)
  } catch (error) {
    res.status(400).send(error.message)
  }
})

// Route untuk update retur
router.patch(
  '/:id',
  authorizeJWT,
  upload.single('unggah_dokumen'),
  async (req, res) => {
    try {
      const returId = req.params.id
      const dataRetur = req.body

      const returSp2d = await returService.getAllReturById(returId)

      const isRejected = Array.isArray(returSp2d?.monitoring)
        ? returSp2d.monitoring.some(m => m.status === 'DITOLAK')
        : false

      let unggah_dokumen = null

      if (req.file) {
        // Fungsi upload ke Cloudinary dari buffer
        const uploadToCloudinary = buffer =>
          new Promise((resolve, reject) => {
            const stream = cloudinary.uploader.upload_stream(
              { resource_type: 'auto' },
              (error, result) => {
                if (error) reject(error)
                else resolve(result)
              }
            )
            stream.end(buffer)
          })

        // Upload dokumen baru ke Cloudinary
        const cloudinaryRes = await uploadToCloudinary(req.file.buffer)
        unggah_dokumen = cloudinaryRes.secure_url
      }

      if (isRejected && !unggah_dokumen) {
        return res
          .status(400)
          .json({ message: 'Dokumen baru harus diunggah setelah penolakan.' })
      }

      if (unggah_dokumen) {
        dataRetur.unggah_dokumen = unggah_dokumen
      }

      const updatedRetur = await returService.editReturById(returId, dataRetur)

      res
        .status(200)
        .json({ updatedRetur, message: 'Retur SP2D berhasil diubah' })
    } catch (error) {
      console.error('Error saat update retur:', error)
      res.status(400).json({ error: error.message })
    }
  }
)

// Route untuk menghapus retur
router.delete('/:id', async (req, res) => {
  try {
    const returId = req.params.id
    await returService.deleteDataRetur(returId)
    res.status(200).json({ message: 'Pengajuan Retur SP2D berhasil dihapus' })
  } catch (error) {
    res.status(400).send(error.message)
  }
})

module.exports = router
