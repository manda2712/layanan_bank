const express = require('express')
const router = express.Router()
const monitoringKoreksiPenerimaanService = require('./monitoringKoreksiPenerimaan.service')
const adminAuthorize = require('../middleware/adminAuthorizeJWT')

router.get('/', async (req, res) => {
  try {
    const monitoringList =
      await monitoringKoreksiPenerimaanService.getAllMonitoringKoreksiPenerimaan()
    res.send(monitoringList)
  } catch (error) {
    console.log('gagal mengambil data', error)
    res.status(500).send(error.message)
  }
})

router.get('/:id', async (req, res) => {
  try {
    const monitoringId = parseInt(req.params.id)
    const monitoring =
      await monitoringKoreksiPenerimaanService.getMonitoringKoreksiPenerimaanById(
        monitoringId
      )
    res.status(200).send(monitoring)
  } catch (error) {
    res.status(400).send(error.message)
  }
})

router.patch('/:id', adminAuthorize, async (req, res) => {
  try {
    const monitoringId = req.params.id
    const monitoringData = req.body
    const updatedMonitoring =
      await monitoringKoreksiPenerimaanService.editMonitoringKoreksiPenerimaan(
        monitoringId,
        monitoringData
      )
    res.status(200).json({
      updatedMonitoring,
      message: 'Monitoring koreksi Penerimaan Berhasil Diubah'
    })
  } catch (error) {
    res.status(400).json({ error: error.message })
  }
})

router.delete('/:id', async (req, res) => {
  try {
    const monitoringId = req.params.id
    await monitoringKoreksiPenerimaanService.deletedMonitoringKoreksiPenerimaanById(
      monitoringId
    )
    res
      .status(200)
      .json({ message: 'Monitoring Koreksi Penerimaan Berhasil Dihapus' })
  } catch (error) {
    res.status(400).send(error.message)
  }
})

module.exports = router
