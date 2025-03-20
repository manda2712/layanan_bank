const { findMonitoringPenerbitanNota, findMonitoringPenerbitanNotaById, updatedMonitoringPenerbitanNota, deleteMonitoringPenerbitanNota } = require("./monitoringPenerbitanNota.repository");


async function getAllMonitoringPenerbitanNota() {
    return await findMonitoringPenerbitanNota()
}

async function getMonitoringPenerbitanNotaById(id) {
    const monitoring = await findMonitoringPenerbitanNotaById(id)
    if (!monitoring) {
        throw new Error("Monitoring Penerbitan Nota Berhasil Dibuat");  
    }
    return monitoring
}

async function editMonitoringPenerbitanNotaById(id, dataMonitoring) {
    await getMonitoringPenerbitanNotaById(id)
    const updatedMonitoring = await updatedMonitoringPenerbitanNota(id, dataMonitoring)
    return updatedMonitoring   
}

async function deleteMonitoringPenerbitanNotaById(id) {
    await getMonitoringPenerbitanNotaById(id)
    await deleteMonitoringPenerbitanNota(id)
}

module.exports = {
    getAllMonitoringPenerbitanNota,
    getMonitoringPenerbitanNotaById,
    editMonitoringPenerbitanNotaById,
    deleteMonitoringPenerbitanNotaById
}