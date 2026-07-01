const {
  findMonitoringPengajuanVoid,
  findMonitoringPengujuanVoidById,
  findMonitoringPengajuanVoidAdmin,
  updateMonitoringPengajuanVoid,
  deleteMonitoringPengajuanVoid
} = require('./monitoringPengajuanVoid.repository')

function formatStatus (status) {
  const statusMap = {
    DIPROSES: 'Menunggu Validasi Admin',
    SELESAI: 'Selesai',
    DITOLAK: 'Ditolak',
    MENUNGGU_VALIDASI_ADMIN: 'Menunggu Validasi Admin'
  }
  return statusMap[status] || status
}

async function getAllMonitoringPengajuanVoid (user) {
  if (!user || !user.id) {
    console.error('DEBUG: Objek user tidak ditemukan di service!')
    return []
  }
  const data = await findMonitoringPengajuanVoid()

  return data
    .filter(item => item.pengajuanVoid?.userId === user.id)
    .map(item => ({
      id: item.id,
      pengajuanVoidId: item.pengajuanVoidId,
      status: formatStatus(item.status),
      catatan: item.catatan,
      pengajuanVoid: item.pengajuanVoid
    }))
}

async function getPengajuanVoidByAdmin () {
  const data = await findMonitoringPengajuanVoidAdmin()

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
      pengajuanVoidId: item.pengajuanVoidId,
      status: formatStatus(item.status),
      statusOriginal: item.status,
      catatan: item.catatan,
      checklistKmp: checklistKmp,
      isSesuaiSyarat: isSesuaiSyarat,
      pengajuanVoid: {
        ...item.pengajuanVoid,
        extractedText: item.pengajuanVoid.extractedText
      }
    }
  })
}
async function getMonitoringPengajuanVoidById (id) {
  const monitoring = await findMonitoringPengujuanVoidById(id)
  if (!monitoring) {
    throw new Error('Monitoring Pengajuan Void Tidak Ditemukan')
  }
  return {
    ...monitoring,
    statusFormatted: formatStatus(monitoring.status)
  }
}

async function editMonitoringPengajuanVoidById (id, dataMonitoring) {
  await getMonitoringPengajuanVoidById(id)
  const updatedMonitoring = await updateMonitoringPengajuanVoid(
    id,
    dataMonitoring
  )
  return updatedMonitoring
}

async function deleteMonitoringPengajuanVoidById (id) {
  await getMonitoringPengajuanVoidById(id)
  await deleteMonitoringPengajuanVoid(id)
}

module.exports = {
  getAllMonitoringPengajuanVoid,
  getMonitoringPengajuanVoidById,
  getPengajuanVoidByAdmin,
  editMonitoringPengajuanVoidById,
  deleteMonitoringPengajuanVoidById
}
