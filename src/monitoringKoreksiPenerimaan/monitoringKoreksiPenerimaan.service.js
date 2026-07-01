const {
  findMonitoringKoreksiPenerimaan,
  findMonitoringKoreksiPenerimaanById,
  updateMonitoringKoreksiPenerimaan,
  deletedMonitoringKoreksiPenerimaan,
  findMonitoringKoreksiPenerimaanAdmin
} = require('./monitoringKoreksiPenerimaan.repository')

function formatStatus (status) {
  const statusMap = {
    DIPROSES: 'Menunggu Validasi Admin',
    SELESAI: 'Selesai',
    DITOLAK: 'Ditolak',
    MENUNGGU_VALIDASI_ADMIN: 'Menunggu Validasi Admin'
  }
  return statusMap[status] || status
}

async function getAllMonitoringKoreksiPenerimaan (user) {
  const data = await findMonitoringKoreksiPenerimaan()

  // Filter dengan keamanan ekstra
  return data
    .filter(item => item.koreksiPenerimaan?.userId === user.id)
    .map(item => ({
      id: item.id,
      koreksiPenerimaanId: item.koreksiPenerimaanId,
      status: formatStatus(item.status),
      catatan: item.catatan,
      dokumenAdmin: item.dokumenAdmin,
      koreksiPenerimaan: item.koreksiPenerimaan
    }))
}

async function getMonitoringKoreksiForAdmin () {
  const data = await findMonitoringKoreksiPenerimaanAdmin()

  return data.map(item => {
    let checklistKmp = null
    let isSesuaiSyarat = false
    try {
      checklistKmp = item.hasilKmp ? JSON.parse(item.hasilKmp) : null

      if (checklistKmp) {
        isSesuaiSyarat = Object.values(checklistKmp).every(val => val === true)
      }
    } catch (error) {
      console.error('Gagal parse JSON hasilKmp:', error)
    }
    return {
      id: item.id,
      koreksiPenerimaanId: item.koreksiPenerimaanId,
      status: formatStatus(item.status),
      statusOrginal: item.status,
      catatan: item.catatan,
      dokumenAdmin: item.dokumenAdmin,
      checklistKmp: checklistKmp,
      isSesuaiSyarat: isSesuaiSyarat,
      koreksiPenerimaan: {
        ...item.koreksiPenerimaan,
        extractedText: item.koreksiPenerimaan.extractedText
      }
    }
  })
}

async function getMonitoringKoreksiPenerimaanById (id) {
  const monitoring = await findMonitoringKoreksiPenerimaanById(id)
  if (!monitoring) {
    throw new Error('Monitoring Koreksi Penerimaan Tidak Ditemukan ')
  }
  return {
    ...monitoring,
    statusFormatted: formatStatus(monitoring.status)
  }
}

async function editMonitoringKoreksiPenerimaan (id, dataMonitoring) {
  await getMonitoringKoreksiPenerimaanById(id)
  const updatedMonitoring = await updateMonitoringKoreksiPenerimaan(
    id,
    dataMonitoring
  )
  return updatedMonitoring
}

async function deletedMonitoringKoreksiPenerimaanById (id) {
  await getMonitoringKoreksiPenerimaanById(id)
  await deletedMonitoringKoreksiPenerimaan(id)
}

module.exports = {
  getAllMonitoringKoreksiPenerimaan,
  getMonitoringKoreksiForAdmin,
  getMonitoringKoreksiPenerimaanById,
  editMonitoringKoreksiPenerimaan,
  deletedMonitoringKoreksiPenerimaanById
}
