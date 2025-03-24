const express = require("express")
const router = express.Router()
const monitoringPengembalianPfkService = require("./monitoringPengembalianPfk.service")
const adminAuthorize = require("../middleware/adminAuthorizeJWT")

router.get("/", async (req, res) => {
    try {
        const monitoringList = await monitoringPengembalianPfkService.getAllMonitoringPengembalianPfk()
        res.send(monitoringList)
    } catch (error) {
        res.status(500).send(error.message) 
    }
})

router.get("/:id", async (req, res) => {
    try {
        const monitoringId = parseInt(req.params.id)
        const monitoring = await monitoringPengembalianPfkService.getMonitoringPengembalianPfkById(monitoringId)
        res.status(200).send(monitoring)
    } catch (error) {
        res.status(500).send(error.message)
    }
})


router.patch("/:id", adminAuthorize, async (req, res) => {
    try {
        const monitoringId = req.params.id
        const monitoringData = req.body
        const updatedMonitoring = await monitoringPengembalianPfkService.editMonitoringPengembalianPfkById(monitoringId, monitoringData)
        res.status(200).json({updatedMonitoring, message: "Berhasil Mengubah Status Pengembalian PFK"})
    } catch (error) {
        res.status(400).json({error:error.message}) 
    }
})

router.delete("/:id", adminAuthorize, async (req, res) => {
    try {
        const monitoringId = req.params.id
        await monitoringPengembalianPfkService.deleteMonitoringPengembalianPfkById(monitoringId)
        res.status(200).json({message: "Pengembalian PFK berhasil dihapus"})
    } catch (error) {
        res.status(400).send(error.message)
    }
})

module.exports = router