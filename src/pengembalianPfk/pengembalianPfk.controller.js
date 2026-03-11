const express = require('express')
const router = express.Router()
const multer = require('multer')
const pengembalianPfkService = require('./pengembalianPfk.service')
const authorizeJWT = require('../middleware/authorizeJWT')

const storage = multer.memoryStorage()
const upload = multer({ storage })

router.post(
  '/create',
  authorizeJWT,
  upload.single('unggahDokumen'),
  async (req, res) => {
    try {
      const { pihakMengajukan, noTelpon } = req.body
      const userId = req.user?.id
      const file = req.file

      if (!userId)
        return res.status(401).json({ message: 'User Belum Terautentikasi' })
      const dataPfk = await pengembalianPfkService.createPengembalianPfk(
        { noTelpon, pihakMengajukan },
        userId,
        file
      )
      res.status(200).json({ dataPfk, message: 'Pengembalian PFK berhasil' })
    } catch (error) {
      res.status(400).json({ error: error.message })
    }
  }
)

router.get('/', async (req, res) => {
  try {
    const pengembalianPfk = await pengembalianPfkService.getAllPengembalianPfk()
    res.send(pengembalianPfk)
  } catch (error) {
    res.status(500).send(error.message)
  }
})

router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params
    const dataPfk = await pengembalianPfkService.getPengembalianPfkById(id)
    res.status(200).send(dataPfk)
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
      const pengembalianPfkId = req.params.id
      const dataPfk = req.body
      const file = req.file
      const updatedPfk = await pengembalianPfkService.updatePengembalianPfkById(
        pengembalianPfkId,
        dataPfk,
        file
      )

      res
        .status(200)
        .json({ updatedPfk, message: 'Pengembalian PFK berhasl diubah' })
    } catch (error) {
      console.error('Error saat update pfk:', error)
      res.status(400).json({ error: error.message })
    }
  }
)

router.delete('/:id', async (req, res) => {
  try {
    const pengembalianPfk = req.params.id
    await pengembalianPfkService.deletePengembalianPfkById(pengembalianPfk)
    res.status(200).json({ message: 'Pengembalian PFK Berhasil dihapus' })
  } catch (error) {
    res.status(400).send(error.message)
  }
})

module.exports = router
