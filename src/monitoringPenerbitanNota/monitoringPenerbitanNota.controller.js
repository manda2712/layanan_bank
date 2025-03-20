const express = require("express")
const router = express.Router()
const monitoringPenerbitanNotaService = require("./monitoringPenerbitanNota.service")

router.get("/", async (req, res) => {
    try {
        const monitoringList = await monitoringPenerbitanNotaService.getAllMonitoringPenerbitanNota()
        res.send(monitoringList)
    } catch (error) {
        res.status(500).send(error.message) 
    }
})

router.get("/:id", async (req, res) => {
    try {
        const monitoringId = parseInt(req.params.id)
        const monitoring = await monitoringPenerbitanNotaService.getMonitoringPenerbitanNotaById(monitoringId)
        res.status(200).send(monitoring)
    } catch (error) {
        res.status(400).send(error.message)
    }
})

router.patch("/:id", async (req, res) => {
    try {
        const monitoringId = req.params.id
        const monitoringData = req.body
        const updatedMonitoring = await monitoringPenerbitanNotaService.editMonitoringPenerbitanNotaById(monitoringId, monitoringData)
        res.status(200).json({updatedMonitoring, message: "Monitoring Penerbitan Nota Berhasil Diubah"})
    } catch (error) {
        res.status(400).json({error: error.message})   
    }
})

router.delete("/:id", async (req, res) => {
    try {
        const monitoringId = req.params.id
        await monitoringPenerbitanNotaService.deleteMonitoringPenerbitanNotaById(monitoringId)
        res.status(200).json({message: "Monitoring Penerbitan Nota Berhasil Dihapus"})
    } catch (error) {
        res.status(400).send(error.message)
    } 
})

module.exports = router