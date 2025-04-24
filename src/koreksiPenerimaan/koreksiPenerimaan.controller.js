const express = require('express')
const router = express.Router()
const authorizeJWT = require('../middleware/authorizeJWT')
const koreksiPenerimaanService = require('./koreksiPenerimaan.service')
const multer = require('multer')
const path = require('path')
const fs = require('fs')
const adminAuthorize = require('../middleware/adminAuthorizeJWT')

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
      console.log('User ID dari request:', req.userId)

      if (!req.userId) {
        return res.status(401).json({ message: 'User Tidak Terautentikasi' })
      }

      const { kodeSatker, noTelpon, tahunSetoran, tahunLainnya } = req.body
      const unggahDokumen = req.file ? req.file.filename : null // Ambil path file

      // Validasi untuk memastikan kodeSatker, noTelpon, dan tahunSetoran ada
      if (!kodeSatker || !noTelpon || !tahunSetoran) {
        return res.status(400).json({ message: 'Semua field wajib diisi!' })
      }

      // Validasi dokumen yang diunggah
      if (!unggahDokumen) {
        return res.status(400).json({ message: 'Dokumen wajib diunggah!' })
      }

      // Validasi tambahan jika tahunSetoran adalah 'LAINNYA' dan tahunLainnya tidak diisi
      if (tahunSetoran === 'LAINNYA' && !tahunLainnya) {
        return res
          .status(400)
          .json({ message: 'Alasan lainnya wajib diisi jika memilih LAINNYA.' })
      }

      // Mengirim data ke service untuk diproses
      const dataKoreksi =
        await koreksiPenerimaanService.createKoreksiPenerimaan(
          {
            kodeSatker,
            noTelpon,
            tahunSetoran,
            tahunLainnya,
            unggahDokumen
          },
          req.userId
        )

      // Response jika data berhasil diproses
      res.status(201).json({
        dataKoreksi,
        message: 'Koreksi Penerimaan Berhasil Dibuat'
      })
    } catch (error) {
      // Mengirimkan pesan error yang lebih informatif
      console.error('Error pada route /create:', error)
      res.status(500).json({
        message: 'Terjadi kesalahan saat memproses permintaan.',
        error: error.message
      })
    }
  }
)

router.get('/', async (req, res) => {
  try {
    const koreksiPenerimaan =
      await koreksiPenerimaanService.getAllKoreksiPenerimaan()
    res.send(koreksiPenerimaan)
  } catch (error) {
    res.status(500).send(error.message)
  }
})

router.get('/:id', async (req, res) => {
  try {
    const koreksiPenerimaanId = parseInt(req.params.id)
    const koreksiPenerimaan =
      await koreksiPenerimaanService.getKoreksiPenerimaanById(
        koreksiPenerimaanId
      )
    res.status(200).send(koreksiPenerimaan)
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
      const koreksiPenerimaanId = req.params.id
      const dataKoreksi = req.body
      const koreksiPenerimaan =
        await koreksiPenerimaanService.getKoreksiPenerimaanById(
          koreksiPenerimaanId
        )

      const isRejected = Array.isArray(koreksiPenerimaan?.monitoring)
        ? koreksiPenerimaan.monitoring.some(
            monitoring => monitoring.status === 'DITOLAK'
          )
        : false

      if (!isRejected && !req.file) {
        return res
          .status(400)
          .json({ message: 'Dokumen baru harus diunggah setelah penolakan.' })
      }

      const unggahDokumen = req.file ? req.file.filename : null

      if (unggahDokumen) {
        dataKoreksi.unggahDokumen = unggahDokumen
      }

      const updateKoreksiPenerimaan =
        await koreksiPenerimaanService.deleteKoreksiPenerimaanById()
      res.status(200).json({
        updateKoreksiPenerimaan,
        message: 'Koreksi Penermaan Berhasil Diubah'
      })
    } catch (error) {
      console.error('Error Saat update Koreksi Penerimaan', error)
      res.status(400).json({ error: error.message })
    }
  }
)

router.delete('/:id', async (req, res) => {
  try {
    const koreksiPenerimaanId = req.params.id
    await koreksiPenerimaanService.deleteKoreksiPenerimaanById(
      koreksiPenerimaanId
    )
    res.status(200).json({ message: 'Koreksi Penerimaan Berhasil Dihapus' })
  } catch (error) {
    res.status(400).send(error.message)
  }
})

module.exports = router
