const { findMonitoringPenerbitanBukti, findMonitoringPenerbitanBuktiById, updatedMonitoringPenerbitanBukti, deleteMonitoringPenerbitanBukti } = require("./monitoringPenerbitanBukti.repository");


async function getAllMonitoringPenerbitanBukti() {
    return await findMonitoringPenerbitanBukti()  
}

async function getMonitoringPenerbitanBuktiById(id) {
    const monitoring = await findMonitoringPenerbitanBuktiById(id)
    if (!monitoring) {
        throw new Error("Monitoring Penerbitan Bukti Tidak Ditemukan"); 
    }
    return monitoring 
}

async function editMonitoringPenerbitanBuktiById(id, dataMonitoring) {
    await getMonitoringPenerbitanBuktiById(id)
    const updatedMonitoring = await updatedMonitoringPenerbitanBukti(id, dataMonitoring)
    return updatedMonitoring  
}

async function deleteMonitoringPenerbitanBuktiById(id) {
    await getMonitoringPenerbitanBuktiById(id)
    await deleteMonitoringPenerbitanBukti(id)   
}

module.exports = {
    getAllMonitoringPenerbitanBukti,
    getMonitoringPenerbitanBuktiById,
    editMonitoringPenerbitanBuktiById,
    deleteMonitoringPenerbitanBuktiById
}