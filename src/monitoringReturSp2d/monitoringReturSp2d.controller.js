const express = require('express')
const router = express.Router()
const monitoringReturSp2dService = require('./monitoringReturSp2d.service')
const adminAuthorize = require('../middleware/adminAuthorizeJWT')
const authorizeJWT = require('../middleware/authorizeJWT')

// 1. Endpoint Utama: Otomatis bedakan Admin dan User
router.get('/', authorizeJWT, async (req, res) => {
  try {
    let monitoringList
    // Cek role dari token (asumsi payload token punya property role)
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

// 2. Endpoint Detail (Bisa dipakai Admin/User)
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

// 3. Update Status (Hanya Admin)
router.patch('/:id', adminAuthorize, async (req, res) => {
  try {
    const monitoringId = req.params.id
    const monitoringData = req.body // Isinya: { status: 'DITOLAK', catatan: 'Alasan..' }

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

// 4. Delete (Hanya Admin)
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
