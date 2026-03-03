// const prisma = require('../db')

// async function findMonitoringReturSp2d () {
//   const monitoring = await prisma.monitoringReturSp2d.findMany({
//     select: {
//       id: true,
//       returSp2dId: true,
//       status: true,
//       catatan: true,
//       returSp2d: {
//         select: {
//           userId: true,
//           noTelpon: true,
//           alasanRetur: true,
//           alasanLainnya: true,
//           unggah_dokumen: true,
//           user: {
//             select: {
//               namaLengkap: true
//             }
//           }
//         }
//       }
//     },
//     orderBy: {
//       id: 'asc' // atau 'desc' kalau ingin terbaru di atas
//     }
//   })
//   return monitoring
// }

// async function findMonitoringForAdmin () {
//   return await prisma.monitoringReturSp2d.findMany({
//     select: {
//       id: true,
//       returSp2dId: true,
//       status: true,
//       catatan: true, // Pesan Admin ke User
//       hasilKmp: true,
//       createdAt: true,
//       returSp2d: {
//         select: {
//           noTelpon: true,
//           alasanRetur: true,
//           alasanLainnya: true,
//           extractedText: true,
//           unggah_dokumen: true,
//           user: { select: { namaLengkap: true } }
//         }
//       }
//     },
//     orderBy: { createdAt: 'desc' }
//   })
// }

// async function findMonitoringReturSp2dById (id) {
//   const monitoring = await prisma.monitoringReturSp2d.findUnique({
//     where: { id: parseInt(id) },
//     select: {
//       id: true,
//       returSp2dId: true,
//       status: true,
//       catatan: true,
//       returSp2d: {
//         select: {
//           kodeSatker: true,
//           noTelpon: true,
//           alasanRetur: true,
//           alasanLainnya: true,
//           unggah_dokumen: true,
//           user: {
//             select: {
//               namaLengkap: true
//             }
//           }
//         }
//       }
//     }
//   })
//   return monitoring
// }

// async function updatedMonitoringReturSp2d (id, dataMonitoring) {
//   console.log('DATA MASUK PATCH:', dataMonitoring)

//   const monitoringId = parseInt(id)
//   if (isNaN(monitoringId)) throw new Error('ID Monitoring tidak valid')

//   const updatedMonitoring = await prisma.monitoringReturSp2d.update({
//     where: { id: monitoringId },
//     data: {
//       ...(dataMonitoring.status && { status: dataMonitoring.status }),
//       ...(dataMonitoring.hasOwnProperty('catatan') && {
//         catatan: dataMonitoring.catatan
//       })
//     },
//     include: {
//       returSp2d: {
//         include: {
//           user: {
//             select: {
//               namaLengkap: true
//             }
//           },
//           satker: {
//             // PERBAIKAN: Pilih field asli yang ada di tabel Satker
//             select: {
//               kodeSatker: true, // Pastikan nama field di schema.prisma adalah kodeSatker
//               namaInstansi: true
//             }
//           }
//         }
//       }
//     }
//   })

//   return updatedMonitoring
// }

// async function deleteMonitoringReturSp2d (id) {
//   return await prisma.$transaction(async prisma => {
//     // Hapus monitoring dulu
//     const deletedMonitoring = await prisma.monitoringReturSp2d.delete({
//       where: { id: parseInt(id) }
//     })

//     // Hapus returSp2d yang terkait
//     await prisma.returSp2d.delete({
//       where: { id: deletedMonitoring.returSp2dId }
//     })

//     return deletedMonitoring
//   })
// }

// module.exports = {
//   findMonitoringReturSp2d,
//   findMonitoringReturSp2dById,
//   updatedMonitoringReturSp2d,
//   findMonitoringForAdmin,
//   deleteMonitoringReturSp2d
// }

const prisma = require('../db')

// 1. GET ALL (Untuk User)
async function findMonitoringReturSp2d () {
  return await prisma.monitoringReturSp2d.findMany({
    select: {
      id: true,
      returSp2dId: true,
      status: true,
      catatan: true,
      returSp2d: {
        select: {
          userId: true,
          noTelpon: true,
          alasanRetur: true,
          alasanLainnya: true,
          unggah_dokumen: true,
          user: { select: { namaLengkap: true } },
          satker: { select: { kodeSatker: true, namaInstansi: true } } // Tambahkan relasi satker
        }
      }
    },
    orderBy: { id: 'desc' }
  })
}

// 2. GET ALL (Untuk Admin)
async function findMonitoringForAdmin () {
  return await prisma.monitoringReturSp2d.findMany({
    select: {
      id: true,
      returSp2dId: true,
      status: true,
      catatan: true,
      hasilKmp: true,
      createdAt: true,
      returSp2d: {
        select: {
          noTelpon: true,
          alasanRetur: true,
          alasanLainnya: true,
          extractedText: true,
          unggah_dokumen: true,
          user: { select: { namaLengkap: true } },
          satker: { select: { kodeSatker: true, namaInstansi: true } } // Perbaikan relasi satker
        }
      }
    },
    orderBy: { createdAt: 'desc' }
  })
}

// 3. GET BY ID (PENTING: Perbaikan Error kodeSatker)
async function findMonitoringReturSp2dById (id) {
  return await prisma.monitoringReturSp2d.findUnique({
    where: { id: parseInt(id) },
    select: {
      id: true,
      returSp2dId: true,
      status: true,
      catatan: true,
      returSp2d: {
        select: {
          id: true,
          noTelpon: true,
          alasanRetur: true,
          alasanLainnya: true,
          unggah_dokumen: true,
          userId: true,
          // PERBAIKAN: kodeSatker diambil dari relasi satker
          satker: {
            select: {
              kodeSatker: true,
              namaInstansi: true
            }
          },
          user: { select: { namaLengkap: true } }
        }
      }
    }
  })
}

// 4. UPDATE STATUS (ADMIN)
async function updatedMonitoringReturSp2d (id, dataMonitoring) {
  const monitoringId = parseInt(id)
  if (isNaN(monitoringId)) throw new Error('ID Monitoring tidak valid')

  return await prisma.monitoringReturSp2d.update({
    where: { id: monitoringId },
    data: {
      ...(dataMonitoring.status && { status: dataMonitoring.status }),
      ...(dataMonitoring.hasOwnProperty('catatan') && {
        catatan: dataMonitoring.catatan
      })
    },
    include: {
      returSp2d: {
        include: {
          user: { select: { namaLengkap: true } },
          satker: { select: { kodeSatker: true, namaInstansi: true } }
        }
      }
    }
  })
}

// 5. DELETE (TRANSACTION)
async function deleteMonitoringReturSp2d (id) {
  return await prisma.$transaction(async tx => {
    const deletedMonitoring = await tx.monitoringReturSp2d.delete({
      where: { id: parseInt(id) }
    })

    await tx.returSp2d.delete({
      where: { id: deletedMonitoring.returSp2dId }
    })

    return deletedMonitoring
  })
}

module.exports = {
  findMonitoringReturSp2d,
  findMonitoringReturSp2dById,
  updatedMonitoringReturSp2d,
  findMonitoringForAdmin,
  deleteMonitoringReturSp2d
}
