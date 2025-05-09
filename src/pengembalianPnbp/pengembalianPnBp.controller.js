const express = require('express')
const router = express.Router()
const multer = require('multer')
const pengembalianPnbpService = require('./pengembalianPnBp.service')
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
      console.log('User Id dari Request:', req.userId)

      if (!req.userId) {
        return res.status(401).json({ message: 'User Belum Terautentikasi' })
      }

      const { pihakMengajukan, kodeSatker, noTelpon } = req.body
      // const unggahDokumen = req.file ? req.file.filename : null // Ambil path file
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
      const dataPnbp = await pengembalianPnbpService.createPengembalianPnbp(
        {
          pihakMengajukan,
          kodeSatker,
          noTelpon,
          unggahDokumen: fileUrl
        },
        req.userId
      )
      res.status(201).json({
        dataPnbp,
        message: 'Berhasil dalam Mmembuat Pengembalian PNBP'
      })
    } catch (error) {
      console.log('apa yang error', error)
      res.status(400).json({ error: error.message })
    }
  }
)

router.get('/', async (req, res) => {
  try {
    const pengembalianPnBp =
      await pengembalianPnbpService.getAllPengembalianPnbp()
    res.send(pengembalianPnBp)
  } catch (error) {
    res.status(500).send(error.message)
  }
})

router.get('/:id', async (req, res) => {
  try {
    const pengembalianPnBpId = parseInt(req.params.id)
    const dataPnbp = await pengembalianPnbpService.getPengembalianPnbpById(
      pengembalianPnBpId
    )
    res.status(200).json(dataPnbp)
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
      const pengembalianPnBpId = req.params.id
      const dataPnbp = req.body
      const pengembalianPnBp =
        await pengembalianPnbpService.getPengembalianPnbpById(
          pengembalianPnBpId
        )

      const isRejected = Array.isArray(pengembalianPnBp)
        ? pengembalianPnBp.monitoring.some(
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
          .json({ message: 'Dokumen baru harus diunggah setelah penolakan.' })
      }

      if (unggahDokumen) {
        dataPnbp.unggahDokumen = unggahDokumen
      }

      const updatePengembalianPnbp =
        await pengembalianPnbpService.editPengembalianPnbpById(
          pengembalianPnBpId,
          dataPnbp
        )

      res.status(200).json({
        updatePengembalianPnbp,
        message: 'Pengembalian Pnbp berhasil diubah'
      })
    } catch (error) {
      console.error('Error saat Update Pengembalian Pnbp:', error)
      res.status(400).json({ error: error.message })
    }
  }
)

router.delete('/:id', async (req, res) => {
  try {
    const pengembalianPnBpId = req.params.id
    await pengembalianPnbpService.deletePengembalianPnbpById(pengembalianPnBpId)
    res.status(200).json({ message: 'Berhasil' })
  } catch (error) {
    res.status(400).send(error.message)
  }
})

module.exports = router
