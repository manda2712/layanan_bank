const {
  findMonitoringReturSp2d,
  findMonitoringReturSp2dById,
  updatedMonitoringReturSp2d,
  deleteMonitoringReturSp2d
} = require('./monitoringReturSp2d.repository')

// Format status agar lebih user-friendly
function formatStatus (status) {
  if (status === 'DIPROSES') return 'Menunggu Validasi Admin'
  if (status === 'SELESAI') return 'Selesai'
  if (status === 'DITOLAK') return 'Ditolak'
  return status
}
async function getAllMonitoringReturSp2d (user) {
  const data = await findMonitoringReturSp2d()

  // Jika user → sembunyikan detail RBS
  return data
    .filter(item => item.returSp2d.userId === user.id)
    .map(item => ({
      id: item.id,
      returSp2dId: item.returSp2dId,
      status: formatStatus(item.status),
      catatan: item.catatan,
      returSp2d: item.returSp2d
    }))
}

async function getAllMonitoringForAdmin () {
  const data = await findMonitoringReturSp2d()
  return data.map(item => ({
    id: item.id,
    returSp2dId: item.returSp2dId,
    status: formatStatus(item.status),
    catatan: item.catatan,
    returSp2d: {
      noTelpon: item.returSp2d.noTelpon,

      alasanRetur: item.returSp2d.alasanRetur,
      alasanLainnya: item.returSp2d.alasanLainnya,
      unggah_dokumen: item.returSp2d.unggah_dokumen,
      user: {
        namaLengkap: item.returSp2d.user.namaLengkap
      }
    }
  }))
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
