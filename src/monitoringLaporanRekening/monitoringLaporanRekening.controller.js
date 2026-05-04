const express = require('express')
const router = express.Router()
const monitoringLaporanRekeningService = require('./monitoringLaporanRekening.service')
const adminAuthorize = require('../middleware/adminAuthorizeJWT')
const authorizeJWT = require('../middleware/authorizeJWT')

router.get('/', authorizeJWT, async (req, res) => {
  try {
    let monitoringList
    if (req.user.role === 'admin') {
      monitoringList =
        await monitoringLaporanRekeningService.getMonitoringLaporanByAdmin()
    } else {
      monitoringList =
        await monitoringLaporanRekeningService.getAllMonitoringLaporanRekening(
          req.user
        )
    }
    res.send(monitoringList)
  } catch (error) {
    res.status(500).send(error.message)
  }
})

router.get('/:id', authorizeJWT, async (req, res) => {
  try {
    const monitoringId = parseInt(req.params.id)
    const monitoring =
      await monitoringLaporanRekeningService.getMonitoringLaporanRekeningById(
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
      await monitoringLaporanRekeningService.editMonitoringLpaoranRekeningById(
        monitoringId,
        monitoringData
      )
    res.status(200).json({
      updatedMonitoring,
      message: 'Status Laporan Rekening Berhasil Diubah'
    })
  } catch (error) {
    res.status(400).json({ error: error.message })
  }
})

router.delete('/:id', adminAuthorize, async (req, res) => {
  try {
    const monitoringId = req.params.id
    await monitoringLaporanRekeningService.deletedMonitoringLaporanRekeningById(
      monitoringId
    )
    res
      .status(200)
      .json({ message: 'Monitoring Laporan Rekening Berhasil Dihapus' })
  } catch (error) {
    res.status(400).send(error.message)
  }
})

module.exports = router
