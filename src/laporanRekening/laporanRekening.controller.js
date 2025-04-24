const express = require('express')
const router = express.Router()
const multer = require('multer')
const path = require('path')
const fs = require('fs')
const authorizeJWT = require('../middleware/authorizeJWT')
const laporanRekeningService = require('./laporanRekening.service')

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
        return res.status(401).json({ message: 'User Tidak Terutentikasi' })
      }

      const { kodeSatker, noTelpon, jenisLaporan } = req.body
      const unggahDokumen = req.file ? req.file.filename : null // Ambil path file
      if (!kodeSatker || !noTelpon || !jenisLaporan) {
        return res.status(400).json({ message: 'Semua field wajib diisi!' })
      }

      if (!unggahDokumen) {
        return res.status(400).json({ message: 'Dokumen wajib diunggah!' })
      }
      const dataLaporan = await laporanRekeningService.createLaporanRekening(
        {
          kodeSatker,
          noTelpon,
          jenisLaporan,
          unggahDokumen
        },
        req.userId
      )
      res
        .status(201)
        .json({ dataLaporan, message: 'Berhasil Membuat Laporan Rekening' })
    } catch (error) {
      res.status(400).send(error.message)
    }
  }
)

router.get('/', async (req, res) => {
  try {
    const laporanRekening = await laporanRekeningService.getAllLaporanRekening()
    res.send(laporanRekening)
  } catch (error) {
    res.status(400).send(error.message)
  }
})

router.get('/:id', async (req, res) => {
  try {
    const laporanRekeningId = parseInt(req.params.id)
    const laporanRekening = await laporanRekeningService.getLaporanRekeningById(
      laporanRekeningId
    )
    res.status(200).send(laporanRekening)
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
      const laporanRekeningId = req.params.id
      const dataLaporan = req.body
      const laporanRekening =
        await laporanRekeningService.getLaporanRekeningById(laporanRekeningId)

      const isRejected = Array.isArray(laporanRekening?.monitoring)
        ? monitoring => monitoring.some(monitoring.status === 'DITOLAK')
        : false

      if (isRejected && !req.file) {
        return res
          .json(400)
          .json({ message: 'Dokumen harus diunggah setelah penolakan' })
      }

      const unggahDokumen = req.file ? req.file.filename : null

      if (unggahDokumen) {
        dataLaporan.unggahDokumen = unggahDokumen
      }
      const updateLaporanRekening =
        await laporanRekeningService.updateLaporanRekeningById(
          laporanRekeningId,
          {
            ...dataLaporan,
            unggahDokumen
          }
        )
      res
        .status(200)
        .json({ updateLaporanRekening, message: 'berhasil diubah' })
    } catch (error) {
      console.error('Error saat update Laporan Rekening:', error)
      res.status(400).json({ error: error.message })
    }
  }
)

router.delete('/:id', async (req, res) => {
  try {
    const laporanRekeningId = req.params.id
    await laporanRekeningService.deleteLaporanRekeningById(laporanRekeningId)
    res.status(200).json({ message: 'Berhasil Dihapus' })
  } catch (error) {
    res.status(400).send(error.message)
  }
})

module.exports = router
