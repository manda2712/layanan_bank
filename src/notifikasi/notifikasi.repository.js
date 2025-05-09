const prisma = require('../db')

async function createNotification ({
  userId,
  message,
  monitoringId,
  monitoringType
}) {
  return await prisma.notification.create({
    data: {
      userId,
      message,
      monitoringId,
      monitoringType,
      status: 'unread'
    }
  })
}

async function getNotificationsByUser (userId) {
  console.log('Fetching notifications for userId:', userId)
  const userIdInt = parseInt(userId)
  if (!userId || isNaN(userIdInt)) {
    throw new Error('Invalid userId')
  }
  const notif = await prisma.notification.findMany({
    where: { userId: parseInt(userId) },
    select: {
      id: true,
      message: true,
      monitoringId: true,
      monitoringType: true,
      status: true,
      createdAt: true
    },
    orderBy: { createdAt: 'desc' }
  })
  console.log('Notifications fetched:', notif)
  return notif
}

async function markAsRead (notificationId) {
  return await prisma.notification.update({
    where: { id: notificationId },
    data: { status: 'read' }
  })
}

async function deleteMessage () {
  return await prisma.notification.deleteMany({})
}

module.exports = {
  createNotification,
  getNotificationsByUser,
  markAsRead,
  deleteMessage
}
