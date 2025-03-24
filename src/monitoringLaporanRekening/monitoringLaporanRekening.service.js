const { findMonitoringLaporanRekening, findMonitoringLaporanRekeningById, deletedMonitoringLaporanRekening, updateMonitoringLaporanRekening } = require("./monitoringLaporanRekening.repository");


async function getAllMonitoringLaporanRekening() {
    return await findMonitoringLaporanRekening()   
}

async function  getMonitoringLaporanRekeningById(id) {
    const monitoring = await findMonitoringLaporanRekeningById(id)
    if (!monitoring) {
        throw new Error("Monitoring Laporan Rekenig Tidak Ditemukan");  
    }
    return monitoring
}

async function editMonitoringLpaoranRekeningById(id, dataMonitoring) {
    await getMonitoringLaporanRekeningById(id)
    const updatedMonitoring = await updateMonitoringLaporanRekening(id, dataMonitoring)
    return updatedMonitoring
}

async function deletedMonitoringLaporanRekeningById(id) {
    await getMonitoringLaporanRekeningById(id)
    await deletedMonitoringLaporanRekening(id)
}

module.exports ={
    getAllMonitoringLaporanRekening,
    getMonitoringLaporanRekeningById,
    editMonitoringLpaoranRekeningById,
    deletedMonitoringLaporanRekeningById
}