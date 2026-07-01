const express = require('express')
const multer = require('multer')
const path = require('path')
const fs = require('fs')
const router = express.Router()
const monitoringPenerbitanBuktiService = require('./monitoringPenerbitanBukti.service')
const adminAuthorize = require('../middleware/adminAuthorizeJWT')
const authorizeJWT = require('../middleware/authorizeJWT')

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const dir = 'uploads/'
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir)
    }
    cb(null, dir)
  },
  filename: (req, file, cb) => {
    // Menghasilkan nama unik: 1714800000-123456789.pdf
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9)
    cb(null, uniqueSuffix + path.extname(file.originalname))
  }
})

const upload = multer({ storage })

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

router.patch(
  '/:id',
  upload.single('dokumenAdmin'),
  adminAuthorize,
  async (req, res) => {
    try {
      const monitoringId = req.params.id

      const monitoringData = {
        ...req.body,
        ...(req.file && { dokumenAdmin: req.file.filename })
      }
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
  }
)

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
