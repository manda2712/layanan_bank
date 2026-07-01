// const express = require('express')
// const router = express.Router()
// const monitoringReturSp2dService = require('./monitoringReturSp2d.service')
// const adminAuthorize = require('../middleware/adminAuthorizeJWT')
// const authorizeJWT = require('../middleware/authorizeJWT')

// router.get('/', authorizeJWT, async (req, res) => {
//   try {
//     let monitoringList
//     if (req.user.role === 'admin') {
//       monitoringList =
//         await monitoringReturSp2dService.getAllMonitoringForAdmin()
//     } else {
//       monitoringList =
//         await monitoringReturSp2dService.getAllMonitoringReturSp2d(req.user)
//     }

//     res.status(200).json(monitoringList)
//   } catch (error) {
//     console.error('Error fetching monitoring:', error)
//     res.status(500).json({ error: error.message })
//   }
// })

// router.get('/:id', authorizeJWT, async (req, res) => {
//   try {
//     const monitoringId = parseInt(req.params.id)
//     const monitoring =
//       await monitoringReturSp2dService.getMonitoringReturSp2dById(monitoringId)
//     res.status(200).json(monitoring)
//   } catch (error) {
//     res.status(400).json({ error: error.message })
//   }
// })

// router.patch('/:id', adminAuthorize, async (req, res) => {
//   try {
//     const monitoringId = req.params.id
//     const monitoringData = req.body
//     const updatedMonitoring =
//       await monitoringReturSp2dService.editMonitoringReturSp2dById(
//         monitoringId,
//         monitoringData
//       )

//     res.status(200).json({
//       data: updatedMonitoring,
//       message: 'Status Monitoring berhasil diubah oleh Admin'
//     })
//   } catch (error) {
//     res.status(400).json({ error: error.message })
//   }
// })

// router.delete('/:id', adminAuthorize, async (req, res) => {
//   try {
//     const monitoringId = req.params.id
//     await monitoringReturSp2dService.deleteMonitoringReturSp2dById(monitoringId)
//     res.status(200).json({ message: 'Data Berhasil dihapus' })
//   } catch (error) {
//     res.status(400).json({ error: error.message })
//   }
// })

// module.exports = router

const express = require('express')
const router = express.Router()
const monitoringReturSp2dService = require('./monitoringReturSp2d.service')
const adminAuthorize = require('../middleware/adminAuthorizeJWT')
const authorizeJWT = require('../middleware/authorizeJWT')

/**
 * GET: Ambil semua data monitoring
 * Logika: Admin dapat semua (plus data KMP), User hanya milik sendiri
 */
router.get('/', authorizeJWT, async (req, res) => {
  try {
    let monitoringList

    if (req.user.role === 'admin') {
      // Mengambil data lengkap dengan isSesuaiSyarat untuk Admin
      monitoringList =
        await monitoringReturSp2dService.getAllMonitoringForAdmin()
    } else {
      // Mengambil data terbatas untuk Satker/User biasa
      monitoringList =
        await monitoringReturSp2dService.getAllMonitoringReturSp2d(req.user)
    }

    res.status(200).json(monitoringList)
  } catch (error) {
    console.error('Error fetching monitoring:', error)
    res.status(500).json({ error: 'Gagal mengambil data monitoring' })
  }
})

/**
 * GET: Ambil detail monitoring berdasarkan ID
 */
router.get('/:id', authorizeJWT, async (req, res) => {
  try {
    const monitoringId = parseInt(req.params.id)
    const monitoring =
      await monitoringReturSp2dService.getMonitoringReturSp2dById(monitoringId)

    res.status(200).json(monitoring)
  } catch (error) {
    res.status(404).json({ error: error.message })
  }
})

/**
 * PATCH: Admin mengubah status (SELESAI/DITOLAK) & memberikan catatan
 * Hanya boleh diakses oleh Admin
 */
router.patch('/:id', adminAuthorize, async (req, res) => {
  try {
    const monitoringId = req.params.id
    const monitoringData = req.body // Berisi { status, catatan }

    const updatedMonitoring =
      await monitoringReturSp2dService.editMonitoringReturSp2dById(
        monitoringId,
        monitoringData
      )

    res.status(200).json({
      data: updatedMonitoring,
      message: `Status dokumen berhasil diubah menjadi ${updatedMonitoring.status}`
    })
  } catch (error) {
    res.status(400).json({ error: error.message })
  }
})

/**
 * DELETE: Hapus data monitoring & retur terkait
 * Hanya boleh diakses oleh Admin
 */
router.delete('/:id', adminAuthorize, async (req, res) => {
  try {
    const monitoringId = req.params.id
    await monitoringReturSp2dService.deleteMonitoringReturSp2dById(monitoringId)

    res
      .status(200)
      .json({ message: 'Data monitoring dan dokumen terkait berhasil dihapus' })
  } catch (error) {
    res.status(400).json({ error: error.message })
  }
})

module.exports = router
