const { laporanRekening, koreksiPenerimaan } = require('../db')
const {
  findMonitoringLaporanRekening,
  findMonitoringLaporanRekeningById,
  deletedMonitoringLaporanRekening,
  updateMonitoringLaporanRekening
} = require('./monitoringLaporanRekening.repository')

function formatStatus (status) {
  const statusMap = {
    DIPROSES: 'Menunggu Validasi Admin',
    SELESAI: 'Selesai',
    DITOLAK: 'Ditolak',
    MENUNGGU_VALIDASI_ADMIN: 'Menunggu Validasi Admin'
  }
  return statusMap[status] || status
}

async function getAllMonitoringLaporanRekening (user) {
  const data = await findMonitoringLaporanRekening()

  return data
    .filter(item => item.laporanRekening?.userId === user.id)
    .map(item => ({
      id: item.id,
      laporanRekeningId: item.laporanRekeningId,
      status: formatStatus(item.status),
      catatan: item.catatan,
      laporanRekening: item.laporanRekening
    }))
}

async function getMonitoringLaporanRekeningById (id) {
  const monitoring = await findMonitoringLaporanRekeningById(id)
  if (!monitoring) {
    throw new Error('Monitoring Laporan Rekenig Tidak Ditemukan')
  }
  return monitoring
}

async function editMonitoringLpaoranRekeningById (id, dataMonitoring) {
  await getMonitoringLaporanRekeningById(id)
  const updatedMonitoring = await updateMonitoringLaporanRekening(
    id,
    dataMonitoring
  )
  return updatedMonitoring
}

async function deletedMonitoringLaporanRekeningById (id) {
  await getMonitoringLaporanRekeningById(id)
  await deletedMonitoringLaporanRekening(id)
}

module.exports = {
  getAllMonitoringLaporanRekening,
  getMonitoringLaporanRekeningById,
  editMonitoringLpaoranRekeningById,
  deletedMonitoringLaporanRekeningById
}
