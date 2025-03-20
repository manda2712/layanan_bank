const express = require("express")
const router = express.Router()

const pembukaanRekeningService = require("./pembukaanRekening.service");
const authorizeJWT = require("../middleware/authorizeJWT")



router.post("/create", authorizeJWT,async (req, res) => {
    try {
        console.log("User ID dari request:", req.userId); // Debugging

        if (!req.userId) {
            return res.status(401).json({ message: "User tidak terautentikasi!" });
        }

        const { kodeSatker, noTelpon, jenisRekening, unggahDokumen } = req.body;

        const dataRekening = await pembukaanRekeningService.createPembukaanRekening({
            kodeSatker,
            noTelpon,
            jenisRekening,
            unggahDokumen
        }, req.userId); // User ID dari token

        res.status(201).json({ dataRekening, message: "Pembukaan Rekening Berhasil!" });
    } catch (error) {
        console.error("Error di controller:", error);
        res.status(400).json({ error: error.message });
    }
});


router.get("/", async (req, res) => {
    try {
        const pembukaanRekening = await pembukaanRekeningService.getAllPembukaanRekening()
        res.send(pembukaanRekening)
    } catch (error) {
        res.status(500).send(error.message)
    }
})

router.get("/:id", async (req, res) => {
    try {
        const pembukaanRekeningById = parseInt(req.params.id)
        const pembukaanRekening = await pembukaanRekeningService.getPembukaanRekeningById(pembukaanRekeningById)
        res.status(200).send(pembukaanRekening)
    } catch (error) {
        res.status(400).send(error.message)
    }
})

router.patch("/:id", async (req, res) => {
    try {
        const pembukaanRekeningId = req.params.id
        const dataRekening = req.body
        const updatePembukaanRekening = await pembukaanRekeningService.editPembukaanRekeningById(pembukaanRekeningId, dataRekening)
        res.status(200).json({updatePembukaanRekening, message: "Pembukaan Rekening Berhasil Diubah"})
    } catch (error) {
        res.status(400).json({error: error.message})  
    }
})

router.delete("/:id", async (req, res) => {
    try {
        const pembukaanRekeningId = req.params.id
        await pembukaanRekeningService.deletePembukaanRekeningById(pembukaanRekeningId)
        res.status(200).json({message:"Pembukaan Rekening Berhasil Dihapus"})
    } catch (error) {
        res.status(400).send(error.message)
        
    }
    
})

module.exports= router