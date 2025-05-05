const prisma = require('../db')

async function createNotification (
  userId,
  message,
  monitoringKoreksiPenerimaanId,
  link
) {
  return await prisma.notification.create({
    data: {
      userId,
      message,
      monitoringKoreksiPenerimaanId,
      status: 'unread',
      link
    }
  })
}

async function getNotificationsByUser (userId) {
  const notif = await prisma.notification.findMany({
    where: { userId },
    select: {
      id: true,
      message: true,
      status: true,
      link: true,
      createdAt: true
    },
    orderBy: { createdAt: 'desc' }
  })
  console.log(notif) // 👉 log sekarang akan tampil
  return notif
}

async function markAsRead (notificationId) {
  return await prisma.notification.update({
    where: { id: notificationId },
    data: { status: 'read' }
  })
}

module.exports = {
  createNotification,
  getNotificationsByUser,
  markAsRead
}
