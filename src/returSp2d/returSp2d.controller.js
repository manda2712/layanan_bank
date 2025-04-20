const express = require('express')
const router = express.Router()
const multer = require('multer')
const path = require('path')
const fs = require('fs')
const returService = require('./retusSp2d.services')
const authorizeJWT = require('../middleware/authorizeJWT')

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
  upload.single('unggah_dokumen'),
  async (req, res) => {
    try {
      console.log('user Id dari request:', req.userId)

      if (!req.userId) {
        return res.status(401).json({ message: 'User Belum Terautentikasi' })
      }

      const { kodeSatker, noTelpon, alasanRetur, alasanLainnya } = req.body
      const unggah_dokumen = req.file ? req.file.filename : null // Ambil path file
      console.log('File yang diupload:', unggah_dokumen) // Pastikan ini hanya file name
      if (!kodeSatker || !noTelpon || !alasanRetur) {
        return res.status(400).json({ message: 'Semua field wajib diisi!' })
      }

      if (!unggah_dokumen) {
        return res.status(400).json({ message: 'Dokumen wajib diunggah!' })
      }

      const dataRetur = await returService.createRetur(
        {
          kodeSatker,
          noTelpon,
          alasanRetur,
          alasanLainnya,
          unggah_dokumen
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

router.get('/', async (req, res) => {
  try {
    const user = await returService.getAllRetur()
    res.send(user)
  } catch (error) {
    res.status(500).send(error.message)
  }
})

router.get('/:id', async (req, res) => {
  try {
    const returId = parseInt(req.params.id)
    const dataRetur = await returService.getAllReturById(returId)
    res.status(200).send(dataRetur)
  } catch (error) {
    res.status(400).send(error.message)
  }
})

router.patch('/:id', async (req, res) => {
  try {
    const returId = req.params.id
    const dataRetur = req.body
    const updateRetur = await returService.editReturById(returId, dataRetur)
    res.status(200).json({ updateRetur, message: 'Retur SP2D berhasil diubah' })
  } catch (error) {
    res.status(400).json({ error: error.message })
  }
})

router.delete('/:id', async (req, res) => {
  try {
    const returId = req.params.id
    await returService.deleteReturById(returId)
    res.status(200).json({ massage: 'Pengajuan Retur SP2D berhasil dihapus' })
  } catch (error) {
    res.status(400).send(error.message)
  }
})

module.exports = router
