const express = require('express')
const router = express.Router()
const multer = require('multer')
const authorizeJWT = require('../middleware/authorizeJWT')
const laporanRekeningService = require('./laporanRekening.service')

const storage = multer.memoryStorage()
const upload = multer({ storage })

router.post(
  '/create',
  authorizeJWT,
  upload.single('unggahDokumen'),
  async (req, res) => {
    try {
      const { noTelpon, jenisLaporan, unggahDokumen } = req.body
      const userId = req.user?.id
      const file = req.file

      if (!userId)
        return res.status(400).json({ message: 'Dokumen wajib diunggah!' })

      const dataLaporan = await laporanRekeningService.createLaporanRekening(
        {
          noTelpon,
          jenisLaporan,
          unggahDokumen
        },
        userId,
        file
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
      const file = req.file
      const updateLaporanRekening =
        await laporanRekeningService.updateLaporanRekeningById(
          laporanRekeningId,
          dataLaporan,
          file
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
