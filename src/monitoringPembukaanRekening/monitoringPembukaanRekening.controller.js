const express = require("express");
const router = express.Router();
const monitoringPembukaanRekeningService = require("./monitroingPembukaanRekening.service");
const adminAuthorize = require("../middleware/adminAuthorizeJWT")


// Ambil semua monitoring
router.get("/", async (req, res) => {
    try {
        const monitoringList = await monitoringPembukaanRekeningService.getAllMonitoringPembukaanRekening();
        res.send(monitoringList);
    } catch (error) {
        res.status(500).send(error.message);
    }
});

// Ambil monitoring berdasarkan ID
router.get("/:id", async (req, res) => {
    try {
        const monitoringId = parseInt(req.params.id);
        const monitoring = await monitoringPembukaanRekeningService.getMonitoringPembukaanRekeningById(monitoringId);
        res.status(200).send(monitoring);
    } catch (error) {
        res.status(400).send(error.message);
    }
});

// Edit monitoring berdasarkan ID
router.patch("/:id", adminAuthorize, async (req, res) => {
    try {
        const monitoringId = req.params.id;
        const monitoringData = req.body;
        const updatedMonitoring = await monitoringPembukaanRekeningService.editMonitoringPembukaanRekeningById(monitoringId, monitoringData);
        res.status(200).json({ updatedMonitoring, message: "Monitoring pembukaan rekening berhasil diperbarui" });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Hapus monitoring berdasarkan ID
router.delete("/:id",adminAuthorize, async (req, res) => {
    try {
        const monitoringId = req.params.id;
        await monitoringPembukaanRekeningService.deleteMonitoringPembukaanRekeningById(monitoringId);
        res.status(200).json({ message: "Monitoring pembukaan rekening berhasil dihapus" });
    } catch (error) {
        res.status(400).send(error.message);
    }
});

module.exports = router;
