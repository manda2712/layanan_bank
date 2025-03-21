const { findMonitoringPengajuanVoid, findMonitoringPengujuanVoidById, updateMonitoringPengajuanVoid, deleteMonitoringPengajuanVoid } = require("./monitoringPengajuanVoid.repository");

async function getAllMonitoringPengajuanVoid() {
    return await findMonitoringPengajuanVoid() 
}

async function getMonitoringPengajuanVoidById(id) {
    const monitoring = await findMonitoringPengujuanVoidById(id)
    if (!monitoring) {
        throw new Error("Monitoring Pengajuan Void Tidak Ditemukan"); 
    }
    return monitoring
}

async function editMonitoringPengajuanVoidById(id, dataMonitoring) {
    await getMonitoringPengajuanVoidById(id)
    const updatedMonitoring = await updateMonitoringPengajuanVoid(id, dataMonitoring)
    return updatedMonitoring
}

async function deleteMonitoringPengajuanVoidById(id) {
    await getMonitoringPengajuanVoidById(id)
    await deleteMonitoringPengajuanVoid(id)
}

module.exports={
    getAllMonitoringPengajuanVoid,
    getMonitoringPengajuanVoidById,
    editMonitoringPengajuanVoidById,
    deleteMonitoringPengajuanVoidById
}