const express = require('express')
const router = express.Router()
const multer = require('multer')
const pembukaanRekeningService = require('./pembukaanRekening.service')
const authorizeJWT = require('../middleware/authorizeJWT')
const storage = multer.memoryStorage()
const upload = multer({ storage })

router.post(
  '/create',
  authorizeJWT,
  upload.single('unggahDokumen'),
  async (req, res) => {
    try {
      const { noTelpon, jenisRekening } = req.body
      const userId = req.user?.id
      const file = req.file
      if (!userId)
        return res.status(400).json({ message: 'Dokumen Wajib Diunggah!' })

      const dataRekening =
        await pembukaanRekeningService.createPembukaanRekening(
          {
            noTelpon,
            jenisRekening
          },
          userId,
          file
        )

      res
        .status(201)
        .json({ dataRekening, message: 'Pembukaan Rekening Berhasil!' })
    } catch (error) {
      console.error('Error di controller:', error)
      res.status(400).json({ error: error.message })
    }
  }
)

router.get('/', async (req, res) => {
  try {
    const pembukaanRekening =
      await pembukaanRekeningService.getAllPembukaanRekening()
    res.send(pembukaanRekening)
  } catch (error) {
    res.status(500).send(error.message)
  }
})

router.get('/:id', async (req, res) => {
  try {
    const pembukaanRekeningById = parseInt(req.params.id)
    const pembukaanRekening =
      await pembukaanRekeningService.getPembukaanRekeningById(
        pembukaanRekeningById
      )
    res.status(200).send(pembukaanRekening)
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
      const pembukaanRekeningId = req.params.id
      const dataRekening = req.body
      const file = req.file
      const updatePembukaanRekening =
        await pembukaanRekeningService.editPembukaanRekeningById(
          pembukaanRekeningId,
          dataRekening,
          file
        )

      res.status(200).json({
        updatePembukaanRekening,
        message: 'Pembukaan Rekening Berhasil Diubah'
      })
    } catch (error) {
      res.status(400).json({ error: error.message })
    }
  }
)

router.delete('/:id', async (req, res) => {
  try {
    const pembukaanRekeningId = req.params.id
    await pembukaanRekeningService.deletePembukaanRekeningById(
      pembukaanRekeningId
    )
    res.status(200).json({ message: 'Pembukaan Rekening Berhasil Dihapus' })
  } catch (error) {
    res.status(400).send(error.message)
  }
})

module.exports = router
