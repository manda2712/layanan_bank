const express = require('express')
const router = express.Router()
const pengajuanVoidService = require('./pengajuanVoid.service')
const multer = require('multer')
const path = require('path')
const fs = require('fs')
const authorizeJWT = require('../middleware/authorizeJWT')
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
      console.log('User ID dari Request:', req.userId)

      if (!req.userId) {
        return res.status(401).json({ message: 'User Belum Terautentikasi' })
      }

      const { kodeSatker, noTelpon, alasanVoid } = req.body
      const unggahDokumen = req.file ? req.file.filename : null // Ambil path file
      if (!kodeSatker || !noTelpon || !alasanVoid) {
        return res.status(400).json({ message: 'Semua field wajib diisi!' })
      }

      if (!unggahDokumen) {
        return res.status(400).json({ message: 'Dokumen wajib diunggah!' })
      }
      const dataVoid = await pengajuanVoidService.creatPengajuanVoid(
        {
          kodeSatker,
          noTelpon,
          alasanVoid,
          unggahDokumen
        },
        req.userId
      )

      res
        .status(201)
        .json({ dataVoid, message: 'Berhasil Membuat Pengajuan Void' })
    } catch (error) {
      res.status(400).send(error.message)
    }
  }
)

router.get('/', async (req, res) => {
  try {
    const pengajuanVoid = await pengajuanVoidService.getAllPengajuanVoid()
    res.send(pengajuanVoid)
  } catch (error) {
    res.status(500).send(error.message)
  }
})

router.get('/:id', async (req, res) => {
  try {
    const pengajuanVoidId = parseInt(req.params.id)
    const pengajuanVoid = await pengajuanVoidService.getPengajuanVoidById(
      pengajuanVoidId
    )
    res.status(200).json(pengajuanVoid)
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
      const pengajuanVoidId = req.params.id
      const dataVoid = req.body

      const pengajuanVoid = await pengajuanVoidService.getPengajuanVoidById(
        pengajuanVoidId
      )

      const isRejected = Array.isArray(pengajuanVoid?.monitoring)
        ? pengajuanVoid.monitoring.some(
            monitoring => monitoring.status === 'DITOLAK'
          )
        : false

      if (isRejected && !req.file) {
        return res
          .status(400)
          .json({ message: 'Dokumen baru harus diunggah setelah penolakan' })
      }

      const unggahDokumen = req.file ? req.file.filename : null // Ambil path file

      if (unggahDokumen) {
        dataVoid.unggahDokumen = unggahDokumen
      }
      const updatePengajuanVoid =
        await pengajuanVoidService.editPengajuanVoidById(pengajuanVoidId, {
          ...dataVoid,
          unggahDokumen
        })
      res.status(200).json({
        updatePengajuanVoid,
        message: 'Pengajuan Void berhasil diubah'
      })
    } catch (error) {
      console.error('Error saat update Pengajuan Void')
      res.status(400).json({ error: error.message })
    }
  }
)

router.delete('/:id', async (req, res) => {
  try {
    const pengajuanVoidId = req.params.id
    await pengajuanVoidService.deletePengajuanVoidById(pengajuanVoidId)
    res.status(200).json({ message: 'Pengajuan Void Berhasil Dihapus' })
  } catch (error) {
    res.status(400).send(error.message)
  }
})

module.exports = router
