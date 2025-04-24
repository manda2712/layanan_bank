const express = require('express')
const router = express.Router()
const penerbitanNotaService = require('./penerbitanNota.services')
const authorizeJWT = require('../middleware/authorizeJWT')
const multer = require('multer')
const path = require('path')
const fs = require('fs')

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
        return res.status(401).json({ message: 'User Tidak Terautentikasi' })
      }

      const { kodeSatker, noTelpon, tahunSetoran, tahunLainnya } = req.body
      const unggahDokumen = req.file ? req.file.filename : null // Ambil path file

      if (!kodeSatker || !noTelpon || !tahunSetoran) {
        return res.status(400).json({ message: 'Semua field wajib diisi!' })
      }

      if (!unggahDokumen) {
        return res.status(400).json({ message: 'Dokumen wajib diunggah!' })
      }

      const dataNota = await penerbitanNotaService.createPenerbitanNota(
        {
          kodeSatker,
          noTelpon,
          tahunSetoran,
          tahunLainnya,
          unggahDokumen
        },
        req.userId
      )
      res
        .status(201)
        .json({ dataNota, message: 'Penerbitan Nota Berhasil Dibuat' })
    } catch (error) {
      console.error('Error di Controller:', error)
      res.status(400).send(error.message)
    }
  }
)

router.get('/', async (req, res) => {
  try {
    const penerbitanNota = await penerbitanNotaService.getAllPenerbitanNota()
    res.send(penerbitanNota)
  } catch (error) {
    res.status(500).send(error.message)
  }
})

router.get('/:id', async (req, res) => {
  try {
    const penerbitanNotaId = parseInt(req.params.id)
    const dataNota = await penerbitanNotaService.getPenerbitanNotaById(
      penerbitanNotaId
    )
    res.status(200).send(dataNota)
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
      const penerbitanNotaId = req.params.id
      const dataNota = req.body
      const penerbitanNota = await penerbitanNotaService.getPenerbitanNotaById(
        penerbitanNotaId
      )

      const isRejected = Array.isArray(penerbitanNota?.monitoring)
        ? penerbitanNota.monitoring.some(
            monitoring => monitoring.status === 'DITOLAK'
          )
        : false

      if (!isRejected && !req.file) {
        return res
          .status(400)
          .json({ message: 'Dokumen baru harus diunggah setelah penolakan' })
      }

      const unggahDokumen = req.file ? req.file.filename : null

      if (unggahDokumen) {
        dataNota.unggahDokumen = unggahDokumen
      }

      const updatePenerbitanNota =
        await penerbitanNotaService.editPenerbitanNotaById(penerbitanNotaId, {
          ...dataNota,
          unggahDokumen
        })
      res.status(200).json({
        updatePenerbitanNota,
        message: 'Penerbitan Nota Bershasil Diubah'
      })
    } catch (error) {
      console.log('Error saat update Penerbitan NOTA:', error)
      res.status(400).json({ error: error.message })
    }
  }
)

router.delete('/:id', async (req, res) => {
  try {
    const penerbitanNotaId = req.params.id
    await penerbitanNotaService.deletePenerbitanNotaById(penerbitanNotaId)
    res
      .status(200)
      .json({ message: 'pengajuan Penerbitan Nota Berhasil Dihapus' })
  } catch (error) {
    res.status(400).send(error.message)
  }
})

module.exports = router // ✅ PENTING
