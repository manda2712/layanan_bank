const express = require('express')
const router = express.Router()

const satkerService = require('./satker.service')

router.post('/insert', async (req, res) => {
  try {
    const satker = req.body
    const newSatker = await satkerService.createSatker(satker)
    res.status(201).json(newSatker)
  } catch (error) {
    res.status(400).send(error.message)
  }
})

router.get('/', async (req, res) => {
  try {
    // Di sini jangan pakai req.params.id karena ini route untuk SEMUA data
    const satker = await satkerService.getAllSatker()
    res.status(200).send(satker)
  } catch (error) {
    res.status(400).send(error.message)
  }
})

// 3. GET BY ID (Tambahkan route ini karena sebelumnya tidak ada)
router.get('/:id', async (req, res) => {
  try {
    const satkerId = parseInt(req.params.id) // Pastikan diparsing ke Int
    const satker = await satkerService.getSatkerById(satkerId)
    res.status(200).send(satker)
  } catch (error) {
    res.status(400).send(error.message)
  }
})

// 4. UPDATE (PATCH)
router.patch('/:id', async (req, res) => {
  try {
    const satkerId = parseInt(req.params.id)
    const satker = req.body
    const updateSatker = await satkerService.editSatkerById(satkerId, satker)
    res
      .status(200)
      .send({ data: updateSatker, message: 'Satker Berhasil Diupdate!' })
  } catch (error) {
    res.status(400).send(error.message)
  }
})

router.delete(':/', async (req, res) => {
  try {
    const satkerId = parseInt(req.params.id)
    await satkerService.deleteSatkerid(satkerId)
    res.status(200).json({ message: 'Satker Telah Dihapus' })
  } catch (error) {
    res.status(400).send(error.message)
  }
})

module.exports = router
