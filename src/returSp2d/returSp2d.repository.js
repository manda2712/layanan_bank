const prisma = require('../db')

async function insertRetur (dataRetur, userId, satkerId) {
  if (!userId) throw new Error('User ID tidak ditemukan!')

  return await prisma.returSp2d.create({
    data: {
      noTelpon: dataRetur.noTelpon,
      alasanRetur: dataRetur.alasanRetur,
      alasanLainnya: dataRetur.alasanLainnya || null,
      unggah_dokumen: dataRetur.unggah_dokumen,
      extractedText: dataRetur.extractedText,
      validationResult: dataRetur.validationResult,

      user: {
        connect: { id: userId }
      },

      satker: {
        connect: { id: satkerId }
      },

      monitoring: {
        create: {
          status: 'DIPROSES',
          hasilKmp: dataRetur.hasilAnalisis,
          catatan: null,
          user: { connect: { id: userId } },
          satker: { connect: { id: satkerId } }
        }
      }
    },
    include: { monitoring: true }
  })
}

async function findRetur () {
  const returSp2d = await prisma.returSp2d.findMany({
    select: {
      id: true,
      noTelpon: true,
      alasanRetur: true,
      alasanLainnya: true,
      unggah_dokumen: true,
      satker: {
        select: {
          kodeSatker: true,
          namaInstansi: true
        }
      }
    }
  })
  return returSp2d
}

async function findReturById (id) {
  const returSp2d = await prisma.returSp2d.findFirst({
    where: { id: Number(id) },
    include: {
      monitoring: {
        orderBy: { createdAt: 'desc' },
        take: 1,
        select: {
          status: true,
          catatan: true
        }
      },
      satker: {
        select: {
          kodeSatker: true,
          namaInstansi: true
        }
      }
    }
  })
  return returSp2d
}

async function editRetur (id, dataRetur) {
  // 1. Ambil data lama dulu untuk cek monitoring
  const oldData = await prisma.returSp2d.findUnique({
    where: { id: Number(id) },
    include: { monitoring: true }
  })

  if (!oldData) throw new Error('Retur tidak ditemukan!')

  // 2. Update field yang dikirim saja (Partial Update)
  const updatedRetur = await prisma.returSp2d.update({
    where: { id: Number(id) },
    data: {
      ...(dataRetur.noTelpon && { noTelpon: dataRetur.noTelpon }),
      ...(dataRetur.alasanRetur && { alasanRetur: dataRetur.alasanRetur }),
      ...(dataRetur.alasanLainnya !== undefined && {
        alasanLainnya: dataRetur.alasanLainnya
      }),
      ...(dataRetur.unggah_dokumen && {
        unggah_dokumen: dataRetur.unggah_dokumen
      }),
      ...(dataRetur.extractedText && { extractedText: dataRetur.extractedText })
    },
    include: { satker: true } // Supaya di Service bisa dapet kodeSatker
  })

  // 3. Jika ada monitoring, kembalikan status ke DIPROSES
  if (oldData.monitoring && oldData.monitoring.length > 0) {
    const lastMonitoring = oldData.monitoring.sort((a, b) => b.id - a.id)[0]
    await prisma.monitoringReturSp2d.update({
      where: { id: lastMonitoring.id },
      data: { status: 'DIPROSES' }
    })
  }

  return updatedRetur
}
async function deleteDataRetur (id) {
  await prisma.returSp2d.delete({
    where: {
      id: parseInt(id)
    }
  })
}

module.exports = {
  insertRetur,
  findRetur,
  findReturById,
  editRetur,
  deleteDataRetur
}

// const prisma = require('../db')

// async function insertRetur (dataRetur, userId) {
//   if (!userId) throw new Error('User ID tidak ditemukan!')

//   let statusMonitoring = 'DIPROSES'
//   let rbsStatus = 'TIDAK_LENGKAP'

//   try {
//     const rbs = JSON.parse(dataRetur.rbsResult)
//     if (rbs.summary?.diterima === true) {
//       statusMonitoring = 'SELESAI'
//       rbsStatus = 'LENGKAP'
//     } else if (rbs.summary?.diterima === false) {
//       statusMonitoring = 'DITOLAK'
//       rbsStatus = 'TIDAK_LENGKAP'
//     }
//   } catch (error) {
//     console.log('Gagal membaca RBS ')
//   }

//   return await prisma.returSp2d.create({
//     data: {
//       noTelpon: dataRetur.noTelpon,
//       alasanRetur: dataRetur.alasanRetur,
//       alasanLainnya: dataRetur.alasanLainnya || null,
//       unggah_dokumen: dataRetur.unggah_dokumen,

//       extractedText: dataRetur.extractedText,
//       rbsResult: dataRetur.rbsResult,

//       userId,
//       satkerId: Number(dataRetur.satkerId),
//       monitoring: {
//         create: {
//           status: 'MENUNGGU_VALIDASI_ADMIN',
//           rbsStatus: rbsStatus,
//           userId,
//           satkerId: Number(dataRetur.satkerId)
//         }
//       }
//     },
//     include: { monitoring: true }
//   })
// }

// async function findRetur () {
//   return await prisma.returSp2d.findMany({
//     select: {
//       id: true,
//       noTelpon: true,
//       alasanRetur: true,
//       alasanLainnya: true,
//       unggah_dokumen: true
//     }
//   })
// }

// async function findReturById (id) {
//   return await prisma.returSp2d.findFirst({
//     where: { id: Number(id) },
//     include: {
//       monitoring: {
//         select: { status: true },
//         orderBy: { createdAt: 'desc' }
//       }
//     }
//   })
// }

// async function editRetur (id, dataRetur) {
//   const returSp2d = await prisma.returSp2d.findUnique({
//     where: { id: Number(id) },
//     include: { monitoring: true }
//   })

//   if (!returSp2d) throw new Error('Retur tidak ditemukan!')
//   if (!dataRetur.unggah_dokumen)
//     throw new Error('Dokumen baru harus diunggah setelah penolakan')

//   const updatedRetur = await prisma.returSp2d.update({
//     where: { id: Number(id) },
//     data: { unggah_dokumen: dataRetur.unggah_dokumen }
//   })

//   // ambil monitoring paling baru
//   const lastMonitoring = returSp2d.monitoring.sort((a, b) => b.id - a.id)[0]

//   await prisma.monitoringReturSp2d.update({
//     where: { id: lastMonitoring.id },
//     data: { status: 'DIPROSES' }
//   })

//   return updatedRetur
// }

// async function deleteDataRetur (id) {
//   return await prisma.returSp2d.delete({
//     where: { id: Number(id) }
//   })
// }

// module.exports = {
//   insertRetur,
//   findRetur,
//   findReturById,
//   editRetur,
//   deleteDataRetur
// }

// const prisma = require('../db')

// async function insertRetur (dataRetur, userId) {
//   if (!userId) throw new Error('User ID tidak ditemukan!')

//   // Karena sudah lolos validasi KMP di service
//   // maka status otomatis lengkap
//   const statusMonitoring = 'MENUNGGU_VALIDASI_ADMIN'
//   const validationStatus = 'LENGKAP'

//   return await prisma.returSp2d.create({
//     data: {
//       noTelpon: dataRetur.noTelpon,
//       alasanRetur: dataRetur.alasanRetur,
//       alasanLainnya: dataRetur.alasanLainnya || null,
//       unggah_dokumen: dataRetur.unggah_dokumen,

//       extractedText: dataRetur.extractedText,
//       validationResult: dataRetur.validationResult, // ganti dari rbsResult

//       userId,
//       satkerId: Number(dataRetur.satkerId),

//       monitoring: {
//         create: {
//           status: statusMonitoring,
//           validationStatus: validationStatus,
//           userId,
//           satkerId: Number(dataRetur.satkerId)
//         }
//       }
//     },
//     include: { monitoring: true }
//   })
// }
