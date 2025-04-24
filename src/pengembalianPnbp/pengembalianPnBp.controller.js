const express = require('express')
const router = express.Router()
const multer = require('multer')
const path = require('path')
const fs = require('fs')
const pengembalianPnbpService = require('./pengembalianPnBp.service')
const authorizeJWT = require('../middleware/authorizeJWT')
const { error } = require('console')

const uploadDir = path.join(__dirname, '..', 'uploads')
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir)
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, '..', 'uploads')) // simpan ke root/uploads
  },
  filename: function (req, file, cb) {
    const ext = path.extname(file.originalname) // Ambil ekstensi asli
    const uniqueSuffix = Date.now() // Gunakan timestamp agar unik
    cb(null, `file_${uniqueSuffix}${ext}`) // Format nama file
  }
})
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
      const unggahDokumen = req.file ? req.file.filename : null // Ambil path file
      if (!pihakMengajukan || !kodeSatker || !noTelpon) {
        return res.status(400).json({ message: 'Semua field wajib diisi!' })
      }

      if (!unggahDokumen) {
        return res.status(400).json({ message: 'Dokumen wajib diunggah!' })
      }

      const dataPnbp = await pengembalianPnbpService.createPengembalianPnbp(
        {
          pihakMengajukan,
          kodeSatker,
          noTelpon,
          unggahDokumen
        },
        req.userId
      )
      res.status(201).json({
        dataPnbp,
        message: 'Berhasil dalam Mmembuat Pengembalian PNBP'
      })
    } catch (error) {
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

      if (isRejected && !req.file) {
        return res
          .status(400)
          .json({ message: 'Dokumen baru harus diunggah Setelah Penelokan' })
      }

      const unggahDokumen = req.file ? req.file.filename : null

      if (unggahDokumen) {
        dataPnbp.unggahDokumen = unggahDokumen
      }

      const updatePengembalianPnbp =
        await pengembalianPnbpService.editPengembalianPnbpById(
          pengembalianPnBpId,
          {
            ...dataPnbp,
            unggahDokumen
          }
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
