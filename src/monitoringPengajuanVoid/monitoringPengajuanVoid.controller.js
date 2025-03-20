const express = require("express")
const router = express.Router()
const monitoringPengajuanVoidService = require("./monitoringPengajuanVoid.service")

router.get("/", async (req, res) => {
    try {
        const monitoringList = await monitoringPengajuanVoidService.getAllMonitoringPengajuanVoid()
        res.send(monitoringList)
    } catch (error) {
        res.status(500).send(error.message)
    }
})

router.get("/:id", async (req, res) => {
    try {
        const monitoringId = parseInt(req.params.id)
        const monitoring = await monitoringPengajuanVoidService.getMonitoringPengajuanVoidById(monitoringId)
        res.status(200).send(monitoring)
    } catch (error) {
        res.status(500).send(error.message)
    }
})

router.patch("/:id", async (req, res) => {
    try {
        const monitoringId = req.params.id
        const monitoringData = req.body
        const updatedMonitoring = await monitoringPengajuanVoidService.editMonitoringPengajuanVoidById(monitoringId, monitoringData)
        res.status(200).json({updatedMonitoring, message: "Status Pengajuan Void berhasil diubah"})
    } catch (error) {
        res.status(400).json({error:error.message})
    }
})

router.delete("/:id", async (req, res) => {
    try {
        const monitoringId = req.params.id
        await monitoringPengajuanVoidService.deleteMonitoringPengajuanVoidById(monitoringId)
        res.status(200).json({message: "Pengajuan Void Berhasil Dihapus"})
    } catch (error) {
        res.status(400).send(error.message)   
    }
})

module.exports = router