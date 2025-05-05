const {
  createNotification,
  getNotificationsByUser,
  markAsRead
} = require('./notifikasi.repository')

async function sendDokumenNotification (
  userId,
  kodeSatker,
  status,
  monitoringId
) {
  const message = `Pengajuan dokumen dengan kode satker ${kodeSatker} telah ${
    status === 'approved' ? 'diterima' : 'ditolak'
  }.`

  return await createNotification(userId, message, monitoringId) // 🟢 tambahkan link ke pa// null jika tidak terkait koreksiPenerimaan
}

async function getUserNotifications (userId) {
  return await getNotificationsByUser(userId)
}

async function setNotificationRead (notificationId) {
  return await markAsRead(notificationId)
}

// Fungsi untuk menandai semua notifikasi sebagai sudah dibaca
async function setAllNotificationsRead (userId) {
  return await prisma.notification.updateMany({
    where: { userId, status: 'unread' }, // Pastikan hanya yang statusnya 'unread'
    data: { status: 'read' }
  })
}

module.exports = {
  sendDokumenNotification,
  getUserNotifications,
  setNotificationRead,
  setAllNotificationsRead // Menambahkan fungsi untuk menandai semua sebagai sudah dibaca
}
