const express = require('express')
const router = express.Router()
const multer = require('multer')
const path = require('path')
const fs = require('fs')
const PenerbitanBukstiService = require('./penerbitanBukti.services')
const authorizeJWT = require('../middleware/authorizeJWT')
const cloudinary = require('cloudinary').v2

const storage = multer.memoryStorage()
const upload = multer({ storage })

router.post(
  '/create',
  authorizeJWT,
  upload.single('unggah_dokumen'),
  async (req, res) => {
    try {
      console.log('User Id dari Request:', req.userId)

      if (!req.userId) {
        return res.status(401).json({ message: 'User tidak teruatentikasi' })
      }

      const { kodeSatker, noTelpon, alasanRetur, alasanLainnya } = req.body

      if (!kodeSatker || !noTelpon || !alasanRetur) {
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

      const dataBukti = await PenerbitanBukstiService.createPenerbitanBukti(
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
        .json({ dataBukti, message: 'Penerbitan Bukti Berhasil dibuat' })
    } catch (error) {
      console.error('Error di controller:', error)
      res.status(400).json({ error: error.message })
    }
  }
)

router.get('/', async (req, res) => {
  try {
    const penerbitanBukti =
      await PenerbitanBukstiService.getAllPenerbitanBukti()
    res.send(penerbitanBukti)
  } catch (error) {
    res.status(500).send(error.message)
  }
})

router.get('/:id', async (req, res) => {
  try {
    const penerbitanBuktiId = parseInt(req.params.id)
    const dataBukti = await PenerbitanBukstiService.getPenerbitanBuktiById(
      penerbitanBuktiId
    )
    res.status(200).send(dataBukti)
  } catch (error) {
    res.status(400).send(error.message)
  }
})

router.patch(
  '/:id',
  authorizeJWT,
  upload.single('unggah_Dokumen'),
  async (req, res) => {
    try {
      const penerbitanBuktiId = req.params.id
      const dataBukti = req.body
      const penerbitanBukti =
        await PenerbitanBukstiService.getPenerbitanBuktiById(penerbitanBuktiId)

      const isRejected = Array.isArray(penerbitanBukti?.monitoring)
        ? penerbitanBukti.monitoring.some(
            monitoring => monitoring.status === 'DITOLAK'
          )
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

      if (isRejected && !req.file) {
        return res
          .status(400)
          .json({ message: 'Dokumen baru harus diunggah setelah penolakan' })
      }

      if (unggah_dokumen) {
        dataBukti.unggah_dokumen = unggah_dokumen
      }

      const updateBukti = await PenerbitanBukstiService.editPenerbitanBuktiById(
        penerbitanBuktiId,
        {
          ...dataBukti,
          unggah_dokumen
        }
      )

      res
        .status(200)
        .json({ updateBukti, message: 'Update Penerbitan Bukti Berhasil' })
    } catch (error) {
      console.error('Error Saat update Penerbitan Bukti')
      res.status(400).json({ error: error.message })
    }
  }
)

router.delete('/:id', async (req, res) => {
  try {
    const penerbitanBuktiId = req.params.id
    await PenerbitanBukstiService.deletePenerbitanBuktiById(penerbitanBuktiId)
    res.status(200).json({ message: 'Pengajuan Penerbitan Bukti Berhasil' })
  } catch (error) {
    res.status(400).send(error.message)
  }
})

module.exports = router
