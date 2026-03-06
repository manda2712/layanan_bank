const express = require('express')
const router = express.Router()
const multer = require('multer')
const returService = require('./retusSp2d.services')
const authorizeJWT = require('../middleware/authorizeJWT')
const storage = multer.memoryStorage()
const upload = multer({ storage })

router.post(
  '/create',
  authorizeJWT,
  upload.single('unggah_dokumen'),
  async (req, res) => {
    try {
      const { noTelpon, alasanRetur, alasanLainnya } = req.body
      const userId = req.user?.id
      const file = req.file

      if (!userId)
        return res.status(401).json({ message: 'User Belum Terautentikasi' })
      const dataRetur = await returService.createRetur(
        { noTelpon, alasanRetur, alasanLainnya },
        userId,
        file
      )

      res
        .status(200)
        .json({ dataRetur, message: 'Pembuatan Retur SP2D berhasil!' })
    } catch (error) {
      console.error('Error di Controller:', error)
      res.status(400).json({ error: error.message })
    }
  }
)

router.get('/', async (req, res) => {
  try {
    const returSp2d = await returService.getAllRetur()
    res.status(200).json(returSp2d)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params
    const data = await returService.getAllReturById(id)
    res.send(data)
  } catch (error) {
    res.status(404).send({ error: error.message })
  }
})

router.patch(
  '/:id',
  authorizeJWT,
  upload.single('unggah_dokumen'),
  async (req, res) => {
    try {
      const returId = req.params.id
      const dataRetur = req.body
      const file = req.file
      const updatedRetur = await returService.editReturById(
        returId,
        dataRetur,
        file
      )

      res
        .status(200)
        .json({ updatedRetur, message: 'Retur SP2D berhasil diubah' })
    } catch (error) {
      console.error('Error saat update retur:', error)
      res.status(400).json({ error: error.message })
    }
  }
)

router.delete('/:id', async (req, res) => {
  try {
    const returId = req.params.id
    await returService.deleteReturById(returId)
    res.status(200).json({ message: 'Pengajuan Retur SP2D berhasil dihapus' })
  } catch (error) {
    res.status(400).json({ error: error.message })
  }
})

module.exports = router
