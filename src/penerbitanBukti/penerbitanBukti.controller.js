const express = require('express')
const router = express.Router()
const multer = require('multer')
const PenerbitanBukstiService = require('./penerbitanBukti.services')
const authorizeJWT = require('../middleware/authorizeJWT')

const storage = multer.memoryStorage()
const upload = multer({ storage })

router.post(
  '/create',
  authorizeJWT,
  upload.single('unggah_dokumen'),
  async (req, res) => {
    try {
      const { noTelpon } = req.body
      const userId = req.user?.id
      const file = req.file

      if (!userId)
        return res.status(401).json({ message: 'User tidak teruatentikasi' })
      const dataBukti = await PenerbitanBukstiService.createPenerbitanBukti(
        { noTelpon },
        userId,
        file
      )
      res
        .status(200)
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
    res.status(200).json(penerbitanBukti)
  } catch (error) {
    res.status(500).send(error.message)
  }
})

router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params
    const data = await PenerbitanBukstiService.getPenerbitanBuktiById(id)
    res.send(data)
  } catch (error) {
    res.status(400).send(error.message)
  }
})

router.patch(
  '/:id',
  authorizeJWT,
  upload.single('unggah_dokumen'),
  async (req, res) => {
    try {
      const penerbitanBuktiId = req.params.id
      const dataBukti = req.body
      const file = req.file
      const updatePenerbitanBukti =
        await PenerbitanBukstiService.editPenerbitanBuktiById(
          penerbitanBuktiId,
          dataBukti,
          file
        )
      res
        .status(200)
        .json({ updatePenerbitanBukti, message: 'ReturSP2D berhasil diubah' })
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
