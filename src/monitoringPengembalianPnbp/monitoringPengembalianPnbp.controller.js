const express = require("express")
const router = express.Router()
const monitoringPengembalianPnbpServicer= require ("./monitoringPengembalianPnbp.service")
const adminAuthorize = require("../middleware/adminAuthorizeJWT")

router.get("/", async (req, res) => {
    try {
        const monitoringList = await monitoringPengembalianPnbpServicer.getAllMonitoringPengembalianPnbp()
        res.send(monitoringList)
    } catch (error) {
        res.status(500).send(error.message)  
    }
})

router.get("/:id", async (req, res) => {
    try {
        const monitoringId = parseInt(req.params.id)
        const monitoring = await monitoringPengembalianPnbpServicer.getMonitoringPengembalianPnbpById(monitoringId)
        res.status(200).send(monitoring)
    } catch (error) {
        res.status(500).send(error.message)  
    }
})

router.patch("/:id", adminAuthorize, async (req, res) => {
    try {
        const monitoringId = req.params.id
        const monitoringData = req.body
        const updatedMonitoring = await monitoringPengembalianPnbpServicer.editMonitoringPengembalianPnbpById(monitoringId, monitoringData)
        res.status(200).json({updatedMonitoring, message: "Berhasil Mengubah status pengembalian PNBP"})
    } catch (error) {
        res.status(400).json({error: error.message})
    } 
})

router.delete("/:id", async (req, res) => {
    try {
        const monitoringId = req.params.id
        await monitoringPengembalianPnbpServicer.deleteMonitoringPengembalianPnbpById(monitoringId)
        res.status(200).json({message: "Pengembalian PNBP Berhasil Dihapus"})
    } catch (error) {
        res.status(400).send(error.message)
        
    }
    
})

module.exports = router