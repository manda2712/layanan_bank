const express = require('express')
const router = express.Router()
const authorizeJWT = require('../middleware/authorizeJWT')
const koreksiPenerimaanService = require('./koreksiPenerimaan.service')
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
        return res.status(400).json({ message: 'Dokumen wajib diunggah!' })
      const dataKoreksi =
        await koreksiPenerimaanService.createKoreksiPenerimaan(
          {
            noTelpon,
            tahunSetoran,
            tahunLainnya
          },
          userId,
          file
        )

      res.status(201).json({
        dataKoreksi,
        message: 'Koreksi Penerimaan Berhasil Dibuat'
      })
    } catch (error) {
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
    const { id } = req.params
    const koreksiPenerimaan =
      await koreksiPenerimaanService.getKoreksiPenerimaanById(id)
    res.status(200).send(koreksiPenerimaan)
  } catch (error) {
    console.log('gagal mengambil data', error)
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
      const userId = req.user.id
      const file = req.file
      const updateKoreksiPenerimaan =
        await koreksiPenerimaanService.editKoreksiPenerimaanById(
          koreksiPenerimaanId,
          userId,
          dataKoreksi,
          file
        )
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
    const userId = req.user.id
    await koreksiPenerimaanService.deleteKoreksiPenerimaanById(
      koreksiPenerimaanId,
      userId
    )
    res.status(200).json({ message: 'Koreksi Penerimaan Berhasil Dihapus' })
  } catch (error) {
    res.status(400).send(error.message)
  }
})

module.exports = router
