const express = require("express")
const router = express.Router()
const monitoringReturSp2dService = require("./monitoringReturSp2d.service")
const adminAuthorize = require("../middleware/adminAuthorizeJWT")


router.get("/", async (req, res) => {
    try {
        const monitoringList = await monitoringReturSp2dService.getAllMonitoringReturSp2d()
        res.send(monitoringList)
    } catch (error) {
        res.status(500).send(error.message)   
    }  
})

router.get("/:id", async (req, res) => {
    try {
        const monitoringId = parseInt(req.params.id)
        const monitoring = await monitoringReturSp2dService.getMonitoringReturSp2dById(monitoringId)
        res.status(200).send(monitoring)
    } catch (error) {
        res.status(400).send(error.message)
    }
})

router.patch("/:id", adminAuthorize, async (req, res) => {
    try {
        const monitoringId = req.params.id
        const monitoringData = req.body
        const updatedMonitoring = await monitoringReturSp2dService.editMonitoringReturSp2dById(monitoringId, monitoringData)
        res.status(200).json({updatedMonitoring, message: "Monitoring Retur SP2D berhasil diubah"})
    } catch (error) {
        res.status(400).json({error: error.message})
    } 
})

router.delete("/:id", adminAuthorize, async (req, res) => {
    try {
        const monitoringId = req.params.id
        await monitoringReturSp2dService.deleteMonitoringReturSp2dById(monitoringId)
        res.status(200).json({message: "Monitoring Retur SP2D Berhasil dihapus"})
    } catch (error) {
        res.status(400).send(error.message)  
    }
})

module.exports = router