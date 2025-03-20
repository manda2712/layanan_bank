const express = require("express")
const router = express.Router()

const pengajuanVoidService = require("./pengajuanVoid.service")
const authorizeJWT = require("../middleware/authorizeJWT")

router.post("/create", authorizeJWT, async (req, res) => {
    try {
        console.log("User ID dari Request:", req.userId)

        if (!req.userId) {
            return res.status(401).json({message: "User Belum Terautentikasi"})  
        }

        const {kodeSatker,noTelpon,alasanVoid,unggahDokumen} = req.body
        const dataVoid = await pengajuanVoidService.creatPengajuanVoid({
            kodeSatker ,
            noTelpon ,
            alasanVoid ,
            unggahDokumen,
        }, req.userId);

        res.status(201).json({dataVoid, message: "Berhasil Membuat Pengajuan Void"})
    } catch (error) {
        res.status(400).send(error.message) 
    } 
})

router.get("/", async (req, res) => {
    try {
        const pengajuanVoid = await pengajuanVoidService.getAllPengajuanVoid()
        res.send(pengajuanVoid)
    } catch (error) {
        res.status(500).send(error.message)
    }
})

router.get("/:id", async (req, res) => {
    try {
        const pengajuanVoidId = parseInt(req.params.id)
        const pengajuanVoid = await pengajuanVoidService.getPengajuanVoidById(pengajuanVoidId)
        res.status(200).json(pengajuanVoid)
    } catch (error) {
        res.status(400).send(error.message)  
    }
})

router.patch("/:id", async (req, res) => {
    try {
        const pengajuanVoidId = req.params.id
        const dataVoid = req.body
        const updatePengajuanVoid = await pengajuanVoidService.editPengajuanVoidById(pengajuanVoidId, dataVoid)
        res.status(200).json({updatePengajuanVoid, message:"Pengajuan Void Berhasil Diubah"})
    } catch (error) {
        res.status(400).json({error: error.message})
    }  
})

router.delete("/:id", async (req, res) => {
    try {
        const pengajuanVoidId = req.params.id
        await pengajuanVoidService.deletePengajuanVoidById(pengajuanVoidId)
        res.status(200).json({message:"Pengajuan Void Berhasil Dihapus"})
    } catch (error) {
        res.status(400).send(error.message)  
    }
})

module.exports = router