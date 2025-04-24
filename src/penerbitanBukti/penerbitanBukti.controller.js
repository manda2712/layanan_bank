const express = require('express')
const router = express.Router()
const multer = require('multer')
const path = require('path')
const fs = require('fs')
const PenerbitanBukstiService = require('./penerbitanBukti.services')
const authorizeJWT = require('../middleware/authorizeJWT')
const { arrayBuffer } = require('stream/consumers')
const { Retur } = require('@prisma/client')

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
      console.log('User Id dari Request:', req.userId)

      if (!req.userId) {
        return res.status(401).json({ message: 'User tidak teruatentikasi' })
      }

      const { kodeSatker, noTelpon, alasanRetur, alasanLainnya } = req.body

      const unggah_dokumen = req.file ? req.file.filename : null // Ambil path file

      if (!kodeSatker || !noTelpon || !alasanRetur) {
        return res.status(400).json({ message: 'Semua field wajib diisi!' })
      }

      if (!unggah_dokumen) {
        return res.status(400).json({ message: 'Dokumen wajib diunggah!' })
      }

      const dataBukti = await PenerbitanBukstiService.createPenerbitanBukti(
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

      if (isRejected && !req.file) {
        return res
          .status(400)
          .json({ message: 'Dokumen baru harus diunggah setelah penolakan' })
      }

      const unggah_dokumen = req.file ? req.file.filename : null

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
