const { findMonitoringPengembalianPfk } = require("../monitoringPengembalianPfk/monitoringPengembalianPfk.repository");
const { findMonitoringPengembalianPnbp, findMonitoringPengembalianPnbpById, updateMonitoringPengembalianPnbp, deleteMonitoringPengembalianPnbp } = require("./monitoringPengembalianPnbp.repository");

async function getAllMonitoringPengembalianPnbp() {
    return await findMonitoringPengembalianPnbp()
}

async function getMonitoringPengembalianPnbpById(id) {
    const monitoring = await findMonitoringPengembalianPnbpById(id)
    if (!monitoring) {
        throw new Error(" Minitoring Pengembalian PNBP tidak ditemukan");  
    }
    return monitoring  
}

async function editMonitoringPengembalianPnbpById(id, dataMonitoring) {
    await getAllMonitoringPengembalianPnbp(id)
    const updatedMonitoring = await updateMonitoringPengembalianPnbp(id, dataMonitoring)
    return updatedMonitoring
}

async function  deleteMonitoringPengembalianPnbpById(id) {
    await getMonitoringPengembalianPnbpById(id)
    await deleteMonitoringPengembalianPnbp(id)
    
}

module.exports = {
    getAllMonitoringPengembalianPnbp,
    getMonitoringPengembalianPnbpById,
    editMonitoringPengembalianPnbpById,
    deleteMonitoringPengembalianPnbpById
}