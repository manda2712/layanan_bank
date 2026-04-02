const express = require('express')
const router = express.Router()
const monitoringReturSp2dService = require('./monitoringReturSp2d.service')
const adminAuthorize = require('../middleware/adminAuthorizeJWT')
const authorizeJWT = require('../middleware/authorizeJWT')

router.get('/', authorizeJWT, async (req, res) => {
  try {
    let monitoringList
    if (req.user.role === 'admin') {
      monitoringList =
        await monitoringReturSp2dService.getAllMonitoringForAdmin()
    } else {
      monitoringList =
        await monitoringReturSp2dService.getAllMonitoringReturSp2d(req.user)
    }

    res.status(200).json(monitoringList)
  } catch (error) {
    console.error('Error fetching monitoring:', error)
    res.status(500).json({ error: error.message })
  }
})

router.get('/:id', authorizeJWT, async (req, res) => {
  try {
    const monitoringId = parseInt(req.params.id)
    const monitoring =
      await monitoringReturSp2dService.getMonitoringReturSp2dById(monitoringId)
    res.status(200).json(monitoring)
  } catch (error) {
    res.status(400).json({ error: error.message })
  }
})

router.patch('/:id', adminAuthorize, async (req, res) => {
  try {
    const monitoringId = req.params.id
    const monitoringData = req.body
    const updatedMonitoring =
      await monitoringReturSp2dService.editMonitoringReturSp2dById(
        monitoringId,
        monitoringData
      )

    res.status(200).json({
      data: updatedMonitoring,
      message: 'Status Monitoring berhasil diubah oleh Admin'
    })
  } catch (error) {
    res.status(400).json({ error: error.message })
  }
})

router.delete('/:id', adminAuthorize, async (req, res) => {
  try {
    const monitoringId = req.params.id
    await monitoringReturSp2dService.deleteMonitoringReturSp2dById(monitoringId)
    res.status(200).json({ message: 'Data Berhasil dihapus' })
  } catch (error) {
    res.status(400).json({ error: error.message })
  }
})

module.exports = router
