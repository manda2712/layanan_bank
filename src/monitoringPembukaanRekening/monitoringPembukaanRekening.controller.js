const express = require('express')
const router = express.Router()
const monitoringPembukaanRekeningService = require('./monitroingPembukaanRekening.service')
const adminAuthorize = require('../middleware/adminAuthorizeJWT')
const authorizeJWT = require('../middleware/authorizeJWT')

router.get('/', authorizeJWT, async (req, res) => {
  try {
    let monitoringList
    if (req.user.role === 'admin') {
      monitoringList =
        await monitoringPembukaanRekeningService.getAllMonitoringPembukaanRekening()
    } else {
      monitoringList =
        await monitoringPembukaanRekeningService.getAllMonitoringPembukaanRekening(
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
      await monitoringPembukaanRekeningService.getMonitoringPembukaanRekeningById(
        monitoringId
      )
    res.status(200).send(monitoring)
  } catch (error) {
    res.status(400).send(error.message)
  }
})

// Edit monitoring berdasarkan ID
router.patch('/:id', adminAuthorize, async (req, res) => {
  try {
    const monitoringId = req.params.id
    const monitoringData = req.body
    const updatedMonitoring =
      await monitoringPembukaanRekeningService.editMonitoringPembukaanRekeningById(
        monitoringId,
        monitoringData
      )
    res.status(200).json({
      updatedMonitoring,
      message: 'Monitoring pembukaan rekening berhasil diperbarui'
    })
  } catch (error) {
    res.status(400).json({ error: error.message })
  }
})

router.delete('/:id', adminAuthorize, async (req, res) => {
  try {
    const monitoringId = req.params.id
    await monitoringPembukaanRekeningService.deleteMonitoringPembukaanRekeningById(
      monitoringId
    )
    res
      .status(200)
      .json({ message: 'Monitoring pembukaan rekening berhasil dihapus' })
  } catch (error) {
    res.status(400).send(error.message)
  }
})

module.exports = router
