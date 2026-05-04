const express = require('express')
const router = express.Router()
const monitoringPenerbitanNotaService = require('./monitoringPenerbitanNota.service')
const adminAuthorize = require('../middleware/adminAuthorizeJWT')
const authorizeJWT = require('../middleware/authorizeJWT')
router.get('/', authorizeJWT, async (req, res) => {
  try {
    console.log('Isi req.user:', req.user)
    let monitoringList
    if (req.user.role === 'admin') {
      monitoringList =
        await monitoringPenerbitanNotaService.getMonitoringPenerbitanNotaByAdmin()
    } else {
      monitoringList =
        await monitoringPenerbitanNotaService.getAllMonitoringPenerbitanNota(
          req.user
        )
    }
    res.status(200).json(monitoringList)
  } catch (error) {
    res.status(500).send(error.message)
  }
})

router.get('/:id', async (req, res) => {
  try {
    const monitoringId = parseInt(req.params.id)
    const monitoring =
      await monitoringPenerbitanNotaService.getMonitoringPenerbitanNotaById(
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
      await monitoringPenerbitanNotaService.editMonitoringPenerbitanNotaById(
        monitoringId,
        monitoringData
      )
    res.status(200).json({
      updatedMonitoring,
      message: 'Monitoring Penerbitan Nota Berhasil Diubah'
    })
  } catch (error) {
    res.status(400).json({ error: error.message })
  }
})

router.delete('/:id', adminAuthorize, async (req, res) => {
  try {
    const monitoringId = req.params.id
    await monitoringPenerbitanNotaService.deleteMonitoringPenerbitanNotaById(
      monitoringId
    )
    res
      .status(200)
      .json({ message: 'Monitoring Penerbitan Nota Berhasil Dihapus' })
  } catch (error) {
    res.status(400).send(error.message)
  }
})

module.exports = router
