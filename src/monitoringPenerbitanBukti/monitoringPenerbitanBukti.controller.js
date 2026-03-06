const express = require('express')
const router = express.Router()
const monitoringPenerbitanBuktiService = require('./monitoringPenerbitanBukti.service')
const adminAuthorize = require('../middleware/adminAuthorizeJWT')
const authorizeJWT = require('../middleware/authorizeJWT')

router.get('/', authorizeJWT, async (req, res) => {
  try {
    let monitoringList
    if (req.user.role === 'admin') {
      monitoringList =
        await monitoringPenerbitanBuktiService.getAllMonitoringAdmin()
    } else {
      monitoringList =
        await monitoringPenerbitanBuktiService.getAllMonitoringPenerbitanBukti(
          req.user.id
        )
    }
    res.send(monitoringList)
  } catch (error) {
    res.status(500).send(error.message)
  }
})

router.get('/:id', async (req, res) => {
  try {
    const monitoringId = parseInt(req.params.id)
    const monitoring =
      await monitoringPenerbitanBuktiService.getMonitoringPenerbitanBuktiById(
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
      await monitoringPenerbitanBuktiService.editMonitoringPenerbitanBuktiById(
        monitoringId,
        monitoringData
      )
    res.status(200).json({
      updatedMonitoring,
      message: 'Monitoring Penerbitan Bukti Berhasil Diubah'
    })
  } catch (error) {
    res.status(400).json({ error: error.message })
  }
})

router.delete('/:id', adminAuthorize, async (req, res) => {
  try {
    const monitoringId = req.params.id
    await monitoringPenerbitanBuktiService.deleteMonitoringPenerbitanBuktiById(
      monitoringId
    )
    res
      .status(200)
      .json({ message: 'Monitroing Penerbiatn Bukti Berhasil Dihapus' })
  } catch (error) {
    res.status(400).send(error.message)
  }
})

module.exports = router
