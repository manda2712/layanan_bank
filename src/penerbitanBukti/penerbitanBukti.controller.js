const express = require("express");
const router = express.Router();

const PenerbitanBukstiService = require("./penerbitanBukti.services")
const authorizeJWT = require("../middleware/authorizeJWT");
const { penerbitanBukti } = require("../db");

router.post('/create', authorizeJWT, async (req, res) => {
    try {
        console.log("User Id dari Request:", req.userId)

        if (!req.userId) {
            return res.status(401).json({message:"User tidak teruatentikasi"}) 
        }

        const{kodeSatker ,
            noTelpon ,
            alasanRetur ,
            unggah_dokumen
        } = req.body

        const dataBukti = await PenerbitanBukstiService.createPenerbitanBukti({
            kodeSatker ,
            noTelpon ,
            alasanRetur ,
            unggah_dokumen
        }, req.userId)
        res.status(201).json({dataBukti, message :"Penerbitan Bukti Berhasil dibuat"})
    } catch (error) {
        console.error("Error di controller:", error);
        res.status(400).json({error: error.message}) 
    }  
})

router.get("/", async (req, res) => {
    try {
        const penerbitanBukti = await PenerbitanBukstiService.getAllPenerbitanBukti()
        res.send(penerbitanBukti)
    } catch (error) {
        res.status(500).send(error.message)
        
    } 
})

router.get("/:id", async (req, res) => {
    try {
        const penerbitanBuktiId = parseInt(req.params.id)
        const dataBukti = await PenerbitanBukstiService.getPenerbitanBuktiById(penerbitanBuktiId)
        res.status(200).send(dataBukti)
    } catch (error) {
        res.status(400).send(error.message) 
    } 
})

router.patch("/:id", async (req, res) => {
    try {
        const penerbitanBuktiId = req.params.id
        const dataBukti = req.body
        const updateBukti = await PenerbitanBukstiService.editPenerbitanBuktiById(penerbitanBuktiId, dataBukti)
        res.status(200).json({updateBukti, message: "Update Penerbitan Bukti Berhasil"})
    } catch (error) {
        res.status(400).json({error: error.message})
    }
    
})

router.delete("/:id", async (req, res) => {
    try {
        const penerbitanBuktiId = req.params.id
        await PenerbitanBukstiService.deletePenerbitanBuktiById(penerbitanBuktiId)
        res.status(200).json({message: "Pengajuan Penerbitan Bukti Berhasil"});
    } catch (error) {
        res.status(400).send(error.message);   
    }
});

module.exports = router