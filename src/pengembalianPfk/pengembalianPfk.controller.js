const express = require("express")
const router = express.Router()

const pengembalianPfkService = require("./pengembalianPfk.service")
const { pengembalianPfk } = require("../db")

router.post("/create", async (req, res) => {
    try {
        const pengembalianPfk = req.body
        const dataPfk = await pengembalianPfkService.createPengembalianPfk(pengembalianPfk)
        res.status(201).json({dataPfk, message: "Pengembalian PFK Berhasil diunggah"})
    } catch (error) {
        res.status(400).send(error.message)   
    } 
})

router.get("/", async (req, res) => {
    try {
        const pengembalianPfk = await pengembalianPfkService.getAllPengembalianPfk()
        res.send(pengembalianPfk)
    } catch (error) {
        res.status(500).send(error.message)
    } 
})

router.get("/:id", async (req, res) => {
    try {
        const pengembalianPfkId = parseInt(req.params.id)
        const dataPfk = await pengembalianPfkService.getPengembalianPfkById(pengembalianPfkId)
        res.status(200).send(dataPfk)
    } catch (error) {
        res.status(400).send(error.message)
    }  
})

router.patch("/:id", async (req, res) => {
    try {
        const pengembalianPfkId = req.params.id
        const dataPfk = req.body
        const updatePengembalianPfk = await pengembalianPfkService.updatePengembalianPfkById(pengembalianPfkId, dataPfk)
        res.status(200).json({updatePengembalianPfk, message:"Pengembalian PFK berhasil diubah" })
    } catch (error) {
        res.status(400).json({error: error.message})  
    }
    
})

router.delete("/:id", async (req, res) => {
    try {
        const pengembalianPfk = req.params.id
        await pengembalianPfkService.deletePengembalianPfkById(pengembalianPfk)
        res.status(200).json({message:"Pengembalian PFK Berhasil dihapus"})
    } catch (error) {
        res.status(400).send(error.message) 
    }
})

module.exports = router