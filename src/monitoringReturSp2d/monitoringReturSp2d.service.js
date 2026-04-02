const {
  findMonitoringReturSp2d,
  findMonitoringReturSp2dById,
  updatedMonitoringReturSp2d,
  deleteMonitoringReturSp2d,
  findMonitoringForAdmin
} = require('./monitoringReturSp2d.repository')

function formatStatus (status) {
  const statusMap = {
    DIPROSES: 'Menunggu Validasi Admin',
    SELESAI: 'Selesai',
    DITOLAK: 'Ditolak',
    MENUNGGU_VALIDASI_ADMIN: 'Menunggu Validasi Admin'
  }
  return statusMap[status] || status
}

async function getAllMonitoringReturSp2d (user) {
  const data = await findMonitoringReturSp2d()

  return data
    .filter(item => item.returSp2d.userId === user.id)
    .map(item => ({
      id: item.id,
      returSp2dId: item.returSp2dId,
      status: formatStatus(item.status),
      catatan: item.catatan, // Ini adalah pesan manual dari Admin
      createdAt: item.createdAt,
      returSp2d: item.returSp2d
    }))
}

async function getAllMonitoringForAdmin () {
  const data = await findMonitoringForAdmin()

  return data.map(item => {
    let checklistKmp = null
    try {
      checklistKmp = item.hasilKmp ? JSON.parse(item.hasilKmp) : null
    } catch (e) {
      console.error('Gagal parse JSON hasilKmp:', e)
    }
    return {
      id: item.id,
      returSp2dId: item.returSp2dId,
      status: formatStatus(item.status),
      statusOriginal: item.status,
      catatan: item.catatan,
      checklistKmp: checklistKmp,
      createdAt: item.createdAt,
      returSp2d: {
        ...item.returSp2d,
        extractedText: item.returSp2d.extractedText
      }
    }
  })
}

async function getMonitoringReturSp2dById (id) {
  const monitoring = await findMonitoringReturSp2dById(id)
  if (!monitoring) {
    throw new Error('Monitoring Retur SP2D tidak ditemukan')
  }
  return monitoring
}

async function editMonitoringReturSp2dById (id, dataMonitoring) {
  await getMonitoringReturSp2dById(id)
  const updatedMonitoring = await updatedMonitoringReturSp2d(id, dataMonitoring)
  return updatedMonitoring
}

async function deleteMonitoringReturSp2dById (id) {
  await getMonitoringReturSp2dById(id)
  await deleteMonitoringReturSp2d(id)
}

module.exports = {
  getAllMonitoringReturSp2d,
  getAllMonitoringForAdmin,
  getMonitoringReturSp2dById,
  editMonitoringReturSp2dById,
  deleteMonitoringReturSp2dById
}
