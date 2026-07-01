const { penerbitanNota } = require('../db')
const {
  findMonitoringPenerbitanNota,
  findMonitoringPenerbitanNotaById,
  updatedMonitoringPenerbitanNota,
  deleteMonitoringPenerbitanNota,
  findMonitoringPenerbitanNotaAdmin
} = require('./monitoringPenerbitanNota.repository')

function formatStatus (status) {
  const statusMap = {
    DIPROSES: 'Menunggu Validasi Admin',
    SELESAI: 'Selesai',
    DITOLAK: 'Ditolak',
    MENUNGGU_VALIDASI_ADMIN: 'Menunggu Validasi Admin'
  }
  return statusMap[status] || status
}

async function getAllMonitoringPenerbitanNota (user) {
  const data = await findMonitoringPenerbitanNota()

  return data
    .filter(item => item.penerbitanNota.userId === user.id)
    .map(item => ({
      id: item.id,
      penerbitanNotaId: item.penerbitanNotaId,
      status: formatStatus(item.status),
      catatan: item.catatan,
      dokumenAdmin: item.dokumenAdmin,
      penerbitanNota: item.penerbitanNota
    }))
}

async function getMonitoringPenerbitanNotaByAdmin () {
  const data = await findMonitoringPenerbitanNotaAdmin()

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
      penerbitanNotaId: item.penerbitanNotaId,
      status: formatStatus(item.status),
      statusOriginal: item.status,
      catatan: item.catatan,
      dokumenAdmin: item.dokumenAdmin,
      checklistKmp: checklistKmp,
      isSesuaiSyarat: isSesuaiSyarat,
      penerbitanNota: {
        ...item.penerbitanNota,
        extractedText: item.penerbitanNota.extractedText
      }
    }
  })
}

async function getMonitoringPenerbitanNotaById (id) {
  const monitoring = await findMonitoringPenerbitanNotaById(id)
  if (!monitoring) {
    throw new Error('Monitoring Penerbitan Nota Berhasil Dibuat')
  }
  return {
    ...monitoring,
    statusFormatted: formatStatus(monitoring.status)
  }
}

async function editMonitoringPenerbitanNotaById (id, dataMonitoring) {
  await getMonitoringPenerbitanNotaById(id)
  const updatedMonitoring = await updatedMonitoringPenerbitanNota(
    id,
    dataMonitoring
  )
  return updatedMonitoring
}

async function deleteMonitoringPenerbitanNotaById (id) {
  await getMonitoringPenerbitanNotaById(id)
  await deleteMonitoringPenerbitanNota(id)
}

module.exports = {
  getAllMonitoringPenerbitanNota,
  getMonitoringPenerbitanNotaById,
  getMonitoringPenerbitanNotaByAdmin,
  editMonitoringPenerbitanNotaById,
  deleteMonitoringPenerbitanNotaById
}
