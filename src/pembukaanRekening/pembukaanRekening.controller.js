const express = require('express')
const router = express.Router()
const multer = require('multer')
const path = require('path')
const pembukaanRekeningService = require('./pembukaanRekening.service')
const authorizeJWT = require('../middleware/authorizeJWT')
const fs = require('fs')
const cloudinary = require('cloudinary').v2

const storage = multer.memoryStorage()
const upload = multer({ storage })

// Route untuk pembukaan rekening
router.post(
  '/create',
  authorizeJWT,
  upload.single('unggahDokumen'),
  async (req, res) => {
    try {
      console.log('User ID dari request:', req.userId) // Debugging

      if (!req.userId) {
        return res.status(401).json({ message: 'User tidak terautentikasi!' })
      }

      const { kodeSatker, noTelpon, jenisRekening } = req.body

      if (!kodeSatker || !noTelpon || !jenisRekening) {
        return res.status(400).json({ message: 'Semua field wajib diisi!' })
      }

      if (!req.file) {
        return res.status(400).json({ message: 'Dokumen wajib diunggah!' })
      }

      const uploadToCloudinary = buffer =>
        new Promise((resolve, rejects) => {
          const stream = cloudinary.uploader.upload_stream(
            { resource_type: 'auto' },
            (error, result) => {
              if (error) rejects(error)
              else resolve(result)
            }
          )
          stream.end(buffer)
        })
      const result = await uploadToCloudinary(req.file.buffer)
      const fileUrl = result.secure_url

      const dataRekening =
        await pembukaanRekeningService.createPembukaanRekening(
          {
            kodeSatker,
            noTelpon,
            jenisRekening,
            unggahDokumen: fileUrl
          },
          req.userId
        )

      res
        .status(201)
        .json({ dataRekening, message: 'Pembukaan Rekening Berhasil!' })
    } catch (error) {
      console.error('Error di controller:', error)
      res.status(400).json({ error: error.message })
    }
  }
)

router.get('/', async (req, res) => {
  try {
    const pembukaanRekening =
      await pembukaanRekeningService.getAllPembukaanRekening()
    res.send(pembukaanRekening)
  } catch (error) {
    res.status(500).send(error.message)
  }
})

router.get('/:id', async (req, res) => {
  try {
    const pembukaanRekeningById = parseInt(req.params.id)
    const pembukaanRekening =
      await pembukaanRekeningService.getPembukaanRekeningById(
        pembukaanRekeningById
      )
    res.status(200).send(pembukaanRekening)
  } catch (error) {
    res.status(400).send(error.message)
  }
})

router.patch(
  '/:id',
  authorizeJWT,
  upload.single('unggahDokumen'),
  async (req, res) => {
    try {
      const pembukaanRekeningId = req.params.id
      const dataRekening = req.body
      const pembukaanRekening =
        await pembukaanRekeningService.getPembukaanRekeningById(
          pembukaanRekeningId
        )

      const isRejected = Array.isArray(pembukaanRekening?.monitoring)
        ? pembukaanRekening.monitoring.some(
            monitoring => monitoring.status === 'DITOLAK'
          )
        : false

      let unggahDokumen = null

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
        unggahDokumen = cloudinaryRes.secure_url
      }

      if (isRejected && !req.file) {
        return res
          .status(400)
          .json({ message: 'Dokumen baru harus diunggah setelah penolakan' })
      }

      if (unggahDokumen) {
        dataRekening.unggahDokumen = unggahDokumen
      }

      const updatePembukaanRekening =
        await pembukaanRekeningService.editPembukaanRekeningById(
          pembukaanRekeningId,
          {
            ...dataRekening,
            unggahDokumen
          }
        )

      res.status(200).json({
        updatePembukaanRekening,
        message: 'Pembukaan Rekening Berhasil Diubah'
      })
    } catch (error) {
      res.status(400).json({ error: error.message })
    }
  }
)

router.delete('/:id', async (req, res) => {
  try {
    const pembukaanRekeningId = req.params.id
    await pembukaanRekeningService.deletePembukaanRekeningById(
      pembukaanRekeningId
    )
    res.status(200).json({ message: 'Pembukaan Rekening Berhasil Dihapus' })
  } catch (error) {
    res.status(400).send(error.message)
  }
})

module.exports = router
