const express = require('express')
const router = express.Router()
const pengajuanVoidService = require('./pengajuanVoid.service')
const multer = require('multer')
const authorizeJWT = require('../middleware/authorizeJWT')
const adminAuthorize = require('../middleware/adminAuthorizeJWT')

const storage = multer.memoryStorage()
const upload = multer({ storage })

router.post(
  '/create',
  authorizeJWT,
  upload.single('unggahDokumen'),
  async (req, res) => {
    try {
      const { noTelpon, alasanVoid } = req.body
      const userId = req.user?.id
      const file = req.file
      if (!userId) {
        return res.status(400).json({ message: 'Dokumen wajib diunggah!' })
      }
      const dataVoid = await pengajuanVoidService.creatPengajuanVoid(
        {
          noTelpon,
          alasanVoid
        },
        userId,
        file
      )

      res
        .status(201)
        .json({ dataVoid, message: 'Berhasil Membuat Pengajuan Void' })
    } catch (error) {
      res.status(400).send(error.message)
    }
  }
)

router.get('/', async (req, res) => {
  try {
    const pengajuanVoid = await pengajuanVoidService.getAllPengajuanVoid()
    res.send(pengajuanVoid)
  } catch (error) {
    res.status(500).send(error.message)
  }
})

router.get('/:id', async (req, res) => {
  try {
    const pengajuanVoidId = parseInt(req.params.id)
    const pengajuanVoid = await pengajuanVoidService.getPengajuanVoidById(
      pengajuanVoidId
    )
    res.status(200).json(pengajuanVoid)
  } catch (error) {
    res.status(400).send(error.message)
  }
})

router.patch(
  '/:id',
  authorizeJWT,
  upload.single('unggahDokumen'),
  async (req, res) => {
    try {
      const pengajuanVoidId = req.params.id
      const dataVoid = req.body
      const file = req.file
      const updatePengajuanVoid =
        await pengajuanVoidService.editPengajuanVoidById(
          pengajuanVoidId,
          dataVoid,
          file
        )
      res.status(200).json({
        updatePengajuanVoid,
        message: 'Pengajuan Void berhasil diubah'
      })
    } catch (error) {
      console.error('Error saat update Pengajuan Void')
      res.status(400).json({ error: error.message })
    }
  }
)

router.delete('/:id', async (req, res) => {
  try {
    const pengajuanVoidId = req.params.id
    await pengajuanVoidService.deletePengajuanVoidById(pengajuanVoidId)
    res.status(200).json({ message: 'Pengajuan Void Berhasil Dihapus' })
  } catch (error) {
    res.status(400).send(error.message)
  }
})

module.exports = router
