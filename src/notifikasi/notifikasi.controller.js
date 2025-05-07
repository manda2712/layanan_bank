const express = require('express')
const router = express.Router()
const notificationService = require('./notifikasi.service')

// Ambil semua notifikasi untuk user tertentu
router.get('/:userId', async (req, res) => {
  try {
    const userId = parseInt(req.params.userId)
    const notifications = await notificationService.getUserNotifications(userId)
    res.json(notifications)
  } catch (error) {
    console.error('Error getUserNotifications:', error)
    res.status(500).json({ error: error.message })
  }
})

// Tandai notifikasi sebagai sudah dibaca
router.patch('/read/:id', async (req, res) => {
  try {
    const notificationId = parseInt(req.params.id)
    const result = await notificationService.setNotificationRead(notificationId)
    res.json(result)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

// Tandai semua notifikasi sebagai sudah dibaca
router.patch('/readall/:userId', async (req, res) => {
  try {
    const userId = parseInt(req.params.userId)
    const result = await notificationService.setAllNotificationsRead(userId)
    res.json(result)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

router.delete('/deleteall', async (req, res) => {
  try {
    await notificationService.removeAllMesaage()
    res.json({ message: 'Semua notifikasi berhasil dihapus.' })
  } catch (error) {
    console.error('Error deleteAllNotif:', error)
    res.status(500).json({ error: error.message })
  }
})

module.exports = router
