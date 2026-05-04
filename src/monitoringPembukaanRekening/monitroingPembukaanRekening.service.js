const {
  findMonitoringPembukaanRekening,
  findMonitoringPembukaanRekeningForAdmin,
  findMonitoringPembukaanRekeningById,
  updateMonitoringPembukaanRekening,
  deleteMonitoringPembukaanRekening
} = require('./monitoringPembukaanRekening.repository')

function formatStatus (status) {
  const statusMap = {
    DIPROSES: 'Menunggu Validasi Admin',
    SELESAI: 'Selesai',
    DITOLAK: 'Ditolak',
    MENUNGGU_VALIDASI_ADMIN: 'Menunggu Validasi Admin'
  }
  return statusMap[status] || status
}
async function getAllMonitoringPembukaanRekening (user) {
  const data = await findMonitoringPembukaanRekening()

  return data
    .filter(item => item.pembukaanRekening.userId === user.id)
    .map(item => ({
      id: item.id,
      pembukaanRekeningId: item.pembukaanRekeningId,
      status: formatStatus(item.status),
      catatan: item.catatan, // Ini adalah pesan manual dari Admin
      createdAt: item.createdAt,
      pembukaanRekening: item.pembukaanRekening
    }))
}

async function getAllPembukaanRekeningForAdmin () {
  const data = await findMonitoringPembukaanRekeningForAdmin()

  return data.map(item => {
    let checklistKmp = null
    try {
      checklistKmp = item.hasilKmp ? JSON.parse(item.hasilKmp) : null
    } catch (error) {
      console.error('Gagal parse JSON hasilKmp:', error)
    }
    return {
      id: item.id,
      pembukaanRekeningId: item.pembukaanRekeningId,
      status: formatStatus(item.status),
      statusOriginal: item.status,
      catatan: item.catatan,
      checklistKmp: checklistKmp,
      pembukaanRekening: {
        ...item.pembukaanRekening,
        extractedText: item.pembukaanRekening.extractedText
      }
    }
  })
}

async function getMonitoringPembukaanRekeningById (id) {
  const monitoring = await findMonitoringPembukaanRekeningById(id)
  if (!monitoring) {
    throw new Error('Monitoring tidak ditemukan')
  }
  return monitoring
}

async function editMonitoringPembukaanRekeningById (id, dataMonitoring) {
  await getMonitoringPembukaanRekeningById(id)
  const updatedMonitoring = await updateMonitoringPembukaanRekening(
    id,
    dataMonitoring
  )
  return updatedMonitoring
}

async function deleteMonitoringPembukaanRekeningById (id) {
  await getMonitoringPembukaanRekeningById(id)
  await deleteMonitoringPembukaanRekening(id)
}

module.exports = {
  getAllMonitoringPembukaanRekening,
  getMonitoringPembukaanRekeningById,
  getAllPembukaanRekeningForAdmin,
  editMonitoringPembukaanRekeningById,
  deleteMonitoringPembukaanRekeningById
}
