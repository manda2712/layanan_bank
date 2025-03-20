const express = require("express");
const router = express.Router();
const penerbitanNotaService = require("./penerbitanNota.services");
const authorizeJWT = require("../middleware/authorizeJWT");

router.post("/create", authorizeJWT, async (req, res) => {
    try {
        console.log("User Id dari Request:", req.userId)

        if (!req.userId) {
            return res.status(401).json({message:"User Tidak Terautentikasi"})   
        }

        const{kodeSatker, noTelpon, tahunSteoran,unggahDokumen} = req.body

        const dataNota = await penerbitanNotaService.createPenerbitanNota({
            kodeSatker, 
            noTelpon, 
            tahunSteoran,
            unggahDokumen
        }, req.userId)
        res.status(201).json({dataNota, message: "Penerbitan Nota Berhasil Dibuat"})
    } catch (error) {
        console.error("Error di Controller:", error)
        res.status(400).send(error.message);
    }
});

router.get("/", async (req, res) => {
    try {
        const penerbitanNota = await penerbitanNotaService.getAllPenerbitanNota()
        res.send(penerbitanNota)
    } catch (error) {
        res.status(500).send(error.message) 
    } 
})

router.get("/:id", async (req, res) => {
    try {
       const penerbitanNotaId = parseInt(req.params.id) 
       const dataNota = await penerbitanNotaService.getPenerbitanNotaById(penerbitanNotaId)
       res.status(200).send(dataNota)
    } catch (error) {
        res.status(400).send(error.message)
    }
    
})

router.patch("/:id", async (req, res) => {
    try {
        const penerbitanNotaId = req.params.id
        const dataNota = req.body
        const updatePenerbitanNota = await penerbitanNotaService.editPenerbitanNotaById(penerbitanNotaId, dataNota)
        res.status(200).json({updatePenerbitanNota, message : "Penerbitan Nota Bershasil Diubah"})
    } catch (error) {
        res.status(400).json({error: error.message})
    } 
})

router.delete("/:id", async (req, res) => {
    try {
        const penerbitanNotaId = req.params.id
        await penerbitanNotaService.deletePenerbitanNotaById(penerbitanNotaId)
        res.status(200).json({message: "pengajuan Penerbitan Nota Berhasil Dihapus"})
    } catch (error) {
        res.status(400).send(error.message)
    }
    
})

module.exports = router; // ✅ PENTING
