const { 
    findMonitoringPembukaanRekening, 
    findMonitoringPembukaanRekeningById, 
    updateMonitoringPembukaanRekening, 
    deleteMonitoringPembukaanRekening 
} = require("./monitoringPembukaanRekening.repository");


async function getAllMonitoringPembukaanRekening() {
    return await findMonitoringPembukaanRekening();
}

async function getMonitoringPembukaanRekeningById(id) {
    const monitoring = await findMonitoringPembukaanRekeningById(id);
    if (!monitoring) {
        throw new Error("Monitoring tidak ditemukan");
    }
    return monitoring;
}

async function editMonitoringPembukaanRekeningById(id, dataMonitoring) {
    await getMonitoringPembukaanRekeningById(id); 
    const updatedMonitoring = await updateMonitoringPembukaanRekening(id, dataMonitoring);
    return updatedMonitoring;
}

async function deleteMonitoringPembukaanRekeningById(id) {
    await getMonitoringPembukaanRekeningById(id); 
    await deleteMonitoringPembukaanRekening(id);
}

module.exports = {
    getAllMonitoringPembukaanRekening,
    getMonitoringPembukaanRekeningById,
    editMonitoringPembukaanRekeningById,
    deleteMonitoringPembukaanRekeningById
};