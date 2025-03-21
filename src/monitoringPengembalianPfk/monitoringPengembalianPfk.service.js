const { findMonitoringPengembalianPfk, findMonitoringPengembalianPfkById, deleteMonitoringPengembalianPfk, updateMonitoringPengembalianPfk } = require("./monitoringPengembalianPfk.repository");

async function getAllMonitoringPengembalianPfk() {
    return await findMonitoringPengembalianPfk()  
}

async function getMonitoringPengembalianPfkById(id) {
    const monitoring = await findMonitoringPengembalianPfkById(id)
    if (!monitoring) {
        throw new Error("Monitoring Pengembalian PFK Tidak Ditemukan");  
    }
    return monitoring 
}

async function editMonitoringPengembalianPfkById(id, dataMonitoring) {
    await getAllMonitoringPengembalianPfk(id)
    const updatedMonitoring = await updateMonitoringPengembalianPfk(id, dataMonitoring)
    return updatedMonitoring
}

async function deleteMonitoringPengembalianPfkById(id) {
    await getMonitoringPengembalianPfkById(id)
    await deleteMonitoringPengembalianPfk(id) 
}

module.exports = {
    getAllMonitoringPengembalianPfk,
    getMonitoringPengembalianPfkById,
    editMonitoringPengembalianPfkById,
    deleteMonitoringPengembalianPfkById
}