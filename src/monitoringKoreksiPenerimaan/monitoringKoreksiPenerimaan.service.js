const {
  findMonitoringKoreksiPenerimaan,
  findMonitoringKoreksiPenerimaanById,
  updateMonitoringKoreksiPenerimaan,
  deletedMonitoringKoreksiPenerimaan
} = require('./monitoringKoreksiPenerimaan.repository')

async function getAllMonitoringKoreksiPenerimaan () {
  return await findMonitoringKoreksiPenerimaan()
}

async function getMonitoringKoreksiPenerimaanById (id) {
  const monitoring = await findMonitoringKoreksiPenerimaanById(id)
  if (!monitoring) {
    throw new Error('Monitoring Koreksi Penerimaan Tidak Ditemukan ')
  }
  return monitoring
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
  getMonitoringKoreksiPenerimaanById,
  editMonitoringKoreksiPenerimaan,
  deletedMonitoringKoreksiPenerimaanById
}
