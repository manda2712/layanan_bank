const express = require("express");
const router = express.Router();

const returService = require("./retusSp2d.services")
const authorizeJWT = require("../middleware/authorizeJWT")

router.post('/create', authorizeJWT, async (req, res) => {
    try {
       console.log("user Id dari request:", req.userId)

       if (!req.userId) {
        return res.status(401).json({message: "User Belum Terautentikasi"})  
       }

       const {kodeSatker, noTelpon, alasanRetur, unggah_dokumen } = req.body

       const dataRetur = await returService.createRetur({
        kodeSatker,
        noTelpon,
        alasanRetur,
        unggah_dokumen
       }, req.userId)

       res.status(201).json({dataRetur, message: "Pembuatan Retur SP2D berhasil!"})
    } catch (error) {
        console.error("Error di Controller:", error)
        res.status(400).send(error.message)  
    } 
})

router.get("/", async(req, res) =>{
    try {
        const user = await returService.getAllRetur();
        res.send(user);
    } catch (error) {
        res.status(500).send(error.message)
        
    }
});

router.get("/:id", async (req, res) => {
    try {
        const returId = parseInt(req.params.id)
        const dataRetur = await returService.getAllReturById(returId)
        res.status(200).send(dataRetur)
    } catch (error) {
        res.status(400).send(error.message)   
    }
})

router.patch("/:id", async (req, res) => {
    try {
        const returId = req.params.id;
        const dataRetur = req.body;
        const updateRetur = await returService.editReturById(returId, dataRetur);
        res.status(200).json({updateRetur, message : "Retur SP2D berhasil diubah"});
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

router.delete("/:id", async (req, res) => {
    try {
        const returId = req.params.id
        await returService.deleteReturById(returId)
        res.status(200).json({massage: "Pengajuan Retur SP2D berhasil dihapus"});
    } catch (error) {
        res.status(400).send(error.message);   
    }
});


module.exports = router;