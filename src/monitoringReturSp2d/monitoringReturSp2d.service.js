const { findMonitoringReturSp2d, findMonitoringReturSp2dById, updatedMonitoringReturSp2d, deleteMonitoringReturSp2d } = require("./monitoringReturSp2d.repository");

async function getAllMonitoringReturSp2d() {
    return await findMonitoringReturSp2d()
}

async function getMonitoringReturSp2dById(id) {
    const monitoring = await findMonitoringReturSp2dById(id)
    if (!monitoring) {
        throw new Error("Monitoring Retur SP2D tidak ditemukan");   
    }
    return monitoring 
}

async function editMonitoringReturSp2dById(id, dataMonitoring) {
    await getMonitoringReturSp2dById(id)
    const updatedMonitoring = await updatedMonitoringReturSp2d(id, dataMonitoring)
    return updatedMonitoring
}

async function deleteMonitoringReturSp2dById(id) {
    await getMonitoringReturSp2dById(id)
    await deleteMonitoringReturSp2d(id)  
}

module.exports={
    getAllMonitoringReturSp2d,
    getMonitoringReturSp2dById,
    editMonitoringReturSp2dById,
    deleteMonitoringReturSp2dById
}