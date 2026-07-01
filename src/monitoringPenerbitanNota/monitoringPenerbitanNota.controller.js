// const express = require('express')
// const router = express.Router()
// const monitoringPenerbitanNotaService = require('./monitoringPenerbitanNota.service')
// const adminAuthorize = require('../middleware/adminAuthorizeJWT')
// const authorizeJWT = require('../middleware/authorizeJWT')
// router.get('/', authorizeJWT, async (req, res) => {
//   try {
//     console.log('Isi req.user:', req.user)
//     let monitoringList
//     if (req.user.role === 'admin') {
//       monitoringList =
//         await monitoringPenerbitanNotaService.getMonitoringPenerbitanNotaByAdmin()
//     } else {
//       monitoringList =
//         await monitoringPenerbitanNotaService.getAllMonitoringPenerbitanNota(
//           req.user
//         )
//     }
//     res.status(200).json(monitoringList)
//   } catch (error) {
//     res.status(500).send(error.message)
//   }
// })

// router.get('/:id', async (req, res) => {
//   try {
//     const monitoringId = parseInt(req.params.id)
//     const monitoring =
//       await monitoringPenerbitanNotaService.getMonitoringPenerbitanNotaById(
//         monitoringId
//       )
//     res.status(200).send(monitoring)
//   } catch (error) {
//     res.status(400).send(error.message)
//   }
// })

// router.patch('/:id', adminAuthorize, async (req, res) => {
//   try {
//     const monitoringId = req.params.id
//     const monitoringData = req.body
//     const updatedMonitoring =
//       await monitoringPenerbitanNotaService.editMonitoringPenerbitanNotaById(
//         monitoringId,
//         monitoringData
//       )
//     res.status(200).json({
//       updatedMonitoring,
//       message: 'Monitoring Penerbitan Nota Berhasil Diubah'
//     })
//   } catch (error) {
//     res.status(400).json({ error: error.message })
//   }
// })

// router.delete('/:id', adminAuthorize, async (req, res) => {
//   try {
//     const monitoringId = req.params.id
//     await monitoringPenerbitanNotaService.deleteMonitoringPenerbitanNotaById(
//       monitoringId
//     )
//     res
//       .status(200)
//       .json({ message: 'Monitoring Penerbitan Nota Berhasil Dihapus' })
//   } catch (error) {
//     res.status(400).send(error.message)
//   }
// })

// module.exports = router

const express = require('express')
const multer = require('multer')
const path = require('path')
const fs = require('fs')
const router = express.Router()
const monitoringPenerbitanNotaService = require('./monitoringPenerbitanNota.service')
const adminAuthorize = require('../middleware/adminAuthorizeJWT')
const authorizeJWT = require('../middleware/authorizeJWT')

// Konfigurasi Penyimpanan Disk
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

// --- ROUTES ---

// Get All Monitoring (Admin & User)
router.get('/', authorizeJWT, async (req, res) => {
  try {
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

// Get By ID
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

// UPDATE (PATCH) - Tempat Admin Upload Dokumen
router.patch(
  '/:id',
  adminAuthorize,
  upload.single('dokumenAdmin'),
  async (req, res) => {
    try {
      const monitoringId = req.params.id

      // Gabungkan data body dengan nama file dari multer
      const monitoringData = {
        ...req.body,
        ...(req.file && { dokumenAdmin: req.file.filename }) // Ambil nama file hasil diskStorage
      }

      const updatedMonitoring =
        await monitoringPenerbitanNotaService.editMonitoringPenerbitanNotaById(
          monitoringId,
          monitoringData
        )

      res.status(200).json({
        updatedMonitoring,
        message: 'Monitoring Berhasil Diperbarui'
      })
    } catch (error) {
      res.status(400).json({ error: error.message })
    }
  }
)

// Delete
router.delete('/:id', adminAuthorize, async (req, res) => {
  try {
    const monitoringId = req.params.id
    await monitoringPenerbitanNotaService.deleteMonitoringPenerbitanNotaById(
      monitoringId
    )
    res.status(200).json({ message: 'Monitoring Berhasil Dihapus' })
  } catch (error) {
    res.status(400).send(error.message)
  }
})

module.exports = router
