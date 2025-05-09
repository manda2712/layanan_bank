const express = require('express')
const router = express.Router()
const multer = require('multer')
const pengembalianPfkService = require('./pengembalianPfk.service')
const authorizeJWT = require('../middleware/authorizeJWT')
const cloudinary = require('cloudinary').v2

const storage = multer.memoryStorage()
const upload = multer({ storage })

router.post(
  '/create',
  authorizeJWT,
  upload.single('unggahDokumen'),
  async (req, res) => {
    try {
      console.log('User ID dari Request:', req.userId)

      if (!req.userId) {
        return res.status(401).json({ message: 'user tidak terautentikasi' })
      }

      const { pihakMengajukan, kodeSatker, noTelpon } = req.body

      if (!pihakMengajukan || !kodeSatker || !noTelpon) {
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

      const dataPfk = await pengembalianPfkService.createPengembalianPfk(
        {
          pihakMengajukan,
          kodeSatker,
          noTelpon,
          unggahDokumen: fileUrl
        },
        req.userId
      )

      res
        .status(201)
        .json({ dataPfk, message: 'Pengembalian PFK Berhasil Dibuat' })
    } catch (error) {
      res.status(400).json({ error: error.message })
    }
  }
)

router.get('/', async (req, res) => {
  try {
    const pengembalianPfk = await pengembalianPfkService.getAllPengembalianPfk()
    res.send(pengembalianPfk)
  } catch (error) {
    res.status(500).send(error.message)
  }
})

router.get('/:id', async (req, res) => {
  try {
    const pengembalianPfkId = parseInt(req.params.id)
    const dataPfk = await pengembalianPfkService.getPengembalianPfkById(
      pengembalianPfkId
    )
    res.status(200).send(dataPfk)
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
      const pengembalianPfkId = req.params.id
      const dataPfk = req.body
      const pengembalianPfk =
        await pengembalianPfkService.getPengembalianPfkById(pengembalianPfkId)

      const isRejected = Array.isArray(pengembalianPfk?.monitoring)
        ? pengembalianPfk.monitoring.some(
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

      if (isRejected && !unggahDokumen) {
        return res
          .status(400)
          .json({ message: 'Dokumen baru harus diunggah setelah penolakan' })
      }

      if (unggahDokumen) {
        dataPfk.unggahDokumen = unggahDokumen
      }

      const updatePfk = await pengembalianPfkService.updatePengembalianPfkById(
        pengembalianPfkId,
        {
          ...dataPfk,
          unggahDokumen
        }
      )
      res.status(200).json({
        updatePfk,
        message: 'Pengembalian PFK berhasil diubah'
      })
    } catch (error) {
      console.error('Error saat update pfk:', error)
      res.status(400).json({ error: error.message })
    }
  }
)

router.delete('/:id', async (req, res) => {
  try {
    const pengembalianPfk = req.params.id
    await pengembalianPfkService.deletePengembalianPfkById(pengembalianPfk)
    res.status(200).json({ message: 'Pengembalian PFK Berhasil dihapus' })
  } catch (error) {
    res.status(400).send(error.message)
  }
})

module.exports = router
