// const {
//   findMonitoringReturSp2d,
//   findMonitoringReturSp2dById,
//   updatedMonitoringReturSp2d,
//   deleteMonitoringReturSp2d,
//   findMonitoringForAdmin
// } = require('./monitoringReturSp2d.repository')

// function formatStatus (status) {
//   const statusMap = {
//     DIPROSES: 'Menunggu Validasi Admin',
//     SELESAI: 'Selesai',
//     DITOLAK: 'Ditolak',
//     MENUNGGU_VALIDASI_ADMIN: 'Menunggu Validasi Admin'
//   }
//   return statusMap[status] || status
// }

// async function getAllMonitoringReturSp2d (user) {
//   const data = await findMonitoringReturSp2d()

//   return data
//     .filter(item => item.returSp2d.userId === user.id)
//     .map(item => ({
//       id: item.id,
//       returSp2dId: item.returSp2dId,
//       status: formatStatus(item.status),
//       catatan: item.catatan, // Ini adalah pesan manual dari Admin
//       createdAt: item.createdAt,
//       returSp2d: item.returSp2d
//     }))
// }

// async function getAllMonitoringForAdmin () {
//   const data = await findMonitoringForAdmin()

//   return data.map(item => {
//     let checklistKmp = null
//     try {
//       checklistKmp = item.hasilKmp ? JSON.parse(item.hasilKmp) : null
//     } catch (e) {
//       console.error('Gagal parse JSON hasilKmp:', e)
//     }
//     return {
//       id: item.id,
//       returSp2dId: item.returSp2dId,
//       status: formatStatus(item.status),
//       statusOriginal: item.status,
//       catatan: item.catatan,
//       checklistKmp: checklistKmp,
//       createdAt: item.createdAt,
//       returSp2d: {
//         ...item.returSp2d,
//         extractedText: item.returSp2d.extractedText
//       }
//     }
//   })
// }

// async function getMonitoringReturSp2dById (id) {
//   const monitoring = await findMonitoringReturSp2dById(id)
//   if (!monitoring) {
//     throw new Error('Monitoring Retur SP2D tidak ditemukan')
//   }
//   return monitoring
// }

// async function editMonitoringReturSp2dById (id, dataMonitoring) {
//   await getMonitoringReturSp2dById(id)
//   const updatedMonitoring = await updatedMonitoringReturSp2d(id, dataMonitoring)
//   return updatedMonitoring
// }

// async function deleteMonitoringReturSp2dById (id) {
//   await getMonitoringReturSp2dById(id)
//   await deleteMonitoringReturSp2d(id)
// }

// module.exports = {
//   getAllMonitoringReturSp2d,
//   getAllMonitoringForAdmin,
//   getMonitoringReturSp2dById,
//   editMonitoringReturSp2dById,
//   deleteMonitoringReturSp2dById
// }

const {
  findMonitoringReturSp2d,
  findMonitoringReturSp2dById,
  updatedMonitoringReturSp2d,
  deleteMonitoringReturSp2d,
  findMonitoringForAdmin
} = require('./monitoringReturSp2d.repository')

/**
 * Helper untuk memetakan status DB ke teks yang mudah dibaca User
 */
function formatStatus (status) {
  const statusMap = {
    DIPROSES: 'Menunggu Validasi Admin',
    SELESAI: 'Selesai',
    DITOLAK: 'Ditolak',
    MENUNGGU_VALIDASI_ADMIN: 'Menunggu Validasi Admin'
  }
  return statusMap[status] || status
}

/**
 * Service untuk Dashboard USER
 * Hanya menampilkan informasi yang relevan bagi Satker
 */
async function getAllMonitoringReturSp2d (user) {
  const data = await findMonitoringReturSp2d()

  // Filter hanya milik user yang sedang login
  return data
    .filter(item => item.returSp2d.userId === user.id)
    .map(item => ({
      id: item.id,
      returSp2dId: item.returSp2dId,
      status: formatStatus(item.status),
      statusOriginal: item.status,
      catatan: item.catatan, // Alasan manual dari Admin
      createdAt: item.createdAt,
      returSp2d: item.returSp2d
    }))
}

/**
 * Service untuk Dashboard ADMIN
 * Menyertakan hasil analisis KMP/OCR untuk mempermudah verifikasi
 */
async function getAllMonitoringForAdmin () {
  const data = await findMonitoringForAdmin()

  return data.map(item => {
    let checklistKmp = null
    let isSesuaiSyarat = false

    try {
      // Parse data JSON dari field hasilKmp
      checklistKmp = item.hasilKmp ? JSON.parse(item.hasilKmp) : null

      // LOGIKA PENENTUAN SYARAT LENGKAP
      // Jika checklistKmp ada, cek apakah semua key bernilai true
      if (checklistKmp) {
        isSesuaiSyarat = Object.values(checklistKmp).every(val => val === true)
      }
    } catch (e) {
      console.error('Gagal parse JSON hasilKmp:', e)
    }

    return {
      id: item.id,
      returSp2dId: item.returSp2dId,
      status: formatStatus(item.status),
      statusOriginal: item.status,
      catatan: item.catatan,
      createdAt: item.createdAt,

      // Field Tambahan untuk Memudahkan Frontend Admin
      checklistKmp: checklistKmp,
      isSesuaiSyarat: isSesuaiSyarat, // TRUE jika semua pola KMP ditemukan

      returSp2d: {
        ...item.returSp2d,
        extractedText: item.returSp2d.extractedText
      }
    }
  })
}

/**
 * Mendapatkan detail monitoring berdasarkan ID
 */
async function getMonitoringReturSp2dById (id) {
  const monitoring = await findMonitoringReturSp2dById(id)
  if (!monitoring) {
    throw new Error('Monitoring Retur SP2D tidak ditemukan')
  }
  return {
    ...monitoring,
    statusFormatted: formatStatus(monitoring.status)
  }
}

/**
 * Update Status atau Catatan oleh Admin
 */
async function editMonitoringReturSp2dById (id, dataMonitoring) {
  // Pastikan data ada sebelum di-update
  await getMonitoringReturSp2dById(id)

  const updatedMonitoring = await updatedMonitoringReturSp2d(id, dataMonitoring)
  return updatedMonitoring
}

/**
 * Hapus data monitoring dan data retur terkait (Transaction)
 */
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
