const { penerbitanBukti } = require('../db')
const {
  findMonitoringPenerbitanBukti,
  findMonitoringPenerbitanBuktiById,
  findMonitoringPenerbitanBuktiAdmin,
  updatedMonitoringPenerbitanBukti,
  deleteMonitoringPenerbitanBukti
} = require('./monitoringPenerbitanBukti.repository')

function formatStatus (status) {
  const statusMap = {
    DIPROSES: 'Menunggu Validasi Admin',
    SELESAI: 'Selesai',
    DITOLAK: 'Ditolak',
    MENUNGGU_VALIDASI_ADMIN: 'Menunggu Validasi Admin'
  }
  return statusMap[status] || status
}
async function getAllMonitoringPenerbitanBukti (userId) {
  const data = await findMonitoringPenerbitanBukti()

  return data
    .filter(item => item.penerbitanBukti.userId === userId)
    .map(item => ({
      id: item.id,
      penerbitanBuktiId: item.penerbitanBuktiId,
      status: formatStatus(item.status),
      catatan: item.catatan,
      dokumenAdmin: item.dokumenAdmin,
      penerbitanBukti: item.penerbitanBukti
    }))
}

async function getAllMonitoringAdmin () {
  const data = await findMonitoringPenerbitanBuktiAdmin()

  return data.map(item => {
    let checklistKmp = null
    let isSesuaiSyarat = false
    try {
      checklistKmp = item.hasilKmp ? JSON.parse(item.hasilKmp) : null
      if (checklistKmp) {
        isSesuaiSyarat = Object.values(checklistKmp).every(val => val === true)
      }
    } catch (error) {
      console.error('Gagal parse JSON hasilKmp:', e)
    }

    return {
      id: item.id,
      penerbitanBuktiId: item.penerbitanBuktiId,
      status: formatStatus(item.status),
      statusOriginal: item.status,
      catatan: item.catatan,
      dokumenAdmin: item.dokumenAdmin,
      checklistKmp: checklistKmp,
      isSesuaiSyarat: isSesuaiSyarat,
      penerbitanBukti: {
        ...item.penerbitanBukti,
        extractedText: item.penerbitanBukti.extractedText
      }
    }
  })
}

async function getMonitoringPenerbitanBuktiById (id) {
  const monitoring = await findMonitoringPenerbitanBuktiById(id)
  if (!monitoring) {
    throw new Error('Monitoring Penerbitan Bukti Tidak Ditemukan')
  }
  return {
    ...monitoring,
    statusFormatted: formatStatus(monitoring.status)
  }
}

async function editMonitoringPenerbitanBuktiById (id, dataMonitoring) {
  await getMonitoringPenerbitanBuktiById(id)
  const updatedMonitoring = await updatedMonitoringPenerbitanBukti(
    id,
    dataMonitoring
  )
  return updatedMonitoring
}

async function deleteMonitoringPenerbitanBuktiById (id) {
  await getMonitoringPenerbitanBuktiById(id)
  await deleteMonitoringPenerbitanBukti(id)
}

module.exports = {
  getAllMonitoringPenerbitanBukti,
  getMonitoringPenerbitanBuktiById,
  editMonitoringPenerbitanBuktiById,
  getAllMonitoringAdmin,
  deleteMonitoringPenerbitanBuktiById
}
