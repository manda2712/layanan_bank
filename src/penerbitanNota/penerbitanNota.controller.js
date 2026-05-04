const express = require('express')
const router = express.Router()
const penerbitanNotaService = require('./penerbitanNota.services')
const authorizeJWT = require('../middleware/authorizeJWT')
const multer = require('multer')
const storage = multer.memoryStorage()
const upload = multer({ storage })

router.post(
  '/create',
  authorizeJWT,
  upload.single('unggahDokumen'),
  async (req, res) => {
    try {
      const { noTelpon, tahunSetoran, tahunLainnya } = req.body
      const userId = req.user?.id
      const file = req.file

      if (!userId)
        return res.status(401).json({ message: 'User Tidak Terautentikasi' })
      const dataNota = await penerbitanNotaService.createPenerbitanNota(
        {
          noTelpon,
          tahunSetoran,
          tahunLainnya
        },
        userId,
        file
      )
      res
        .status(200)
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
      const userId = req.user.id
      const dataNota = req.body
      const file = req.file
      const updatedNota = await penerbitanNotaService.editPenerbitanNotaById(
        penerbitanNotaId,
        userId,
        dataNota,
        file
      )

      res.status(200).json({
        updatedNota,
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
    const userId = req.user.id
    await penerbitanNotaService.deletePenerbitanNotaById(
      penerbitanNotaId,
      userId
    )
    res
      .status(200)
      .json({ message: 'pengajuan Penerbitan Nota Berhasil Dihapus' })
  } catch (error) {
    res.status(400).send(error.message)
  }
})

module.exports = router // ✅ PENTING
