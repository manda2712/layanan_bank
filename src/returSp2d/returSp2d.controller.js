// const express = require('express')
// const router = express.Router()
// const multer = require('multer')
// const returService = require('./retusSp2d.services')
// const authorizeJWT = require('../middleware/authorizeJWT')
// const storage = multer.memoryStorage()
// const upload = multer({ storage })

// router.post(
//   '/create',
//   authorizeJWT,
//   upload.single('unggah_dokumen'),
//   async (req, res) => {
//     try {
//       const { noTelpon, alasanRetur, alasanLainnya } = req.body
//       const userId = req.user?.id
//       const file = req.file

//       if (!userId)
//         return res.status(401).json({ message: 'User Belum Terautentikasi' })
//       const dataRetur = await returService.createRetur(
//         { noTelpon, alasanRetur, alasanLainnya },
//         userId,
//         file
//       )

//       res
//         .status(200)
//         .json({ dataRetur, message: 'Pembuatan Retur SP2D berhasil!' })
//     } catch (error) {
//       console.error('Error di Controller:', error)
//       res.status(400).json({ error: error.message })
//     }
//   }
// )

// router.get('/', async (req, res) => {
//   try {
//     const returSp2d = await returService.getAllRetur()
//     res.status(200).json(returSp2d)
//   } catch (error) {
//     res.status(500).json({ error: error.message })
//   }
// })

// router.get('/:id', async (req, res) => {
//   try {
//     const { id } = req.params
//     const data = await returService.getAllReturById(id)
//     res.send(data)
//   } catch (error) {
//     res.status(404).send({ error: error.message })
//   }
// })

// router.patch(
//   '/:id',
//   authorizeJWT,
//   upload.single('unggah_dokumen'),
//   async (req, res) => {
//     try {
//       const returId = req.params.id
//       const userId = req.user.id
//       const dataRetur = req.body
//       const file = req.file
//       const updatedRetur = await returService.editReturById(
//         returId,
//         dataRetur,
//         userId,
//         file
//       )

//       res
//         .status(200)
//         .json({ updatedRetur, message: 'Retur SP2D berhasil diubah' })
//     } catch (error) {
//       console.error('Error saat update retur:', error)
//       res.status(400).json({ error: error.message })
//     }
//   }
// )

// router.delete('/:id', async (req, res) => {
//   try {
//     const returId = req.params.id
//     const userId = req.user.id
//     await returService.deleteReturById(returId, userId)
//     res.status(200).json({ message: 'Pengajuan Retur SP2D berhasil dihapus' })
//   } catch (error) {
//     res.status(400).json({ error: error.message })
//   }
// })

// module.exports = router

const express = require('express')
const router = express.Router()
const multer = require('multer')
const returService = require('./retusSp2d.services')
const authorizeJWT = require('../middleware/authorizeJWT')

// Konfigurasi Multer
const storage = multer.memoryStorage()
const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 } // Batas 5MB
})

// 1. CREATE RETUR
router.post(
  '/create',
  authorizeJWT,
  upload.single('unggah_dokumen'),
  async (req, res) => {
    try {
      const { noTelpon, alasanRetur, alasanLainnya } = req.body
      const userId = req.user?.id
      const file = req.file

      if (!userId) {
        return res.status(401).json({ message: 'User Belum Terautentikasi' })
      }

      const dataRetur = await returService.createRetur(
        { noTelpon, alasanRetur, alasanLainnya },
        userId,
        file
      )

      res.status(200).json({
        dataRetur,
        message: 'Pembuatan Retur SP2D berhasil!'
      })
    } catch (error) {
      console.error('Error di Controller (Create):', error)
      res.status(400).json({ error: error.message })
    }
  }
)

// 2. GET ALL RETUR (Admin biasanya pakai ini)
router.get('/', async (req, res) => {
  try {
    const returSp2d = await returService.getAllRetur()
    res.status(200).json(returSp2d)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

// 3. GET RETUR BY ID
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params
    const data = await returService.getAllReturById(id)
    res.send(data)
  } catch (error) {
    res.status(404).send({ error: error.message })
  }
})

// 4. UPDATE/EDIT RETUR (Penyebab error Prisma sebelumnya)
router.patch(
  '/:id',
  authorizeJWT,
  upload.single('unggah_dokumen'),
  async (req, res) => {
    try {
      const returId = req.params.id
      const userId = req.user.id // Diambil dari token
      const dataRetur = req.body // Berisi alasanRetur, alasanLainnya
      const file = req.file

      // URUTAN HARUS: (id, userId, dataUpdate, file)
      // Agar tidak tertukar antara Object data dan Integer userId
      const updatedRetur = await returService.editReturById(
        returId,
        userId,
        dataRetur,
        file
      )

      res.status(200).json({
        updatedRetur,
        message: 'Retur SP2D berhasil diubah'
      })
    } catch (error) {
      console.error('Error saat update retur:', error)
      res.status(400).json({ error: error.message })
    }
  }
)

// 5. DELETE RETUR
router.delete('/:id', authorizeJWT, async (req, res) => {
  try {
    const returId = req.params.id
    const userId = req.user.id

    await returService.deleteReturById(returId, userId)
    res.status(200).json({ message: 'Pengajuan Retur SP2D berhasil dihapus' })
  } catch (error) {
    console.error('Error saat delete retur:', error)
    res.status(400).json({ error: error.message })
  }
})

module.exports = router
