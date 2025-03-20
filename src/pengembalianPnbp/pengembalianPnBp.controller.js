const express = require("express")
const router = express.Router()

const pengembalianPnbpService = require("./pengembalianPnBp.service")


router.post("/create", async (req, res) => {
    try {
        const pengembalianPnBp = req.body
        const dataPnbp = await pengembalianPnbpService.createPengembalianPnbp(pengembalianPnBp)
        res.status(201).json({dataPnbp, message:"Berhasil dalam Mmembuat Pengembalian PNBP"})
    } catch (error) {
        res.status(400).send(error.message)   
    }
})

router.get("/", async (req,res) => {
    try {
        const pengembalianPnBp = await pengembalianPnbpService.getAllPengembalianPnbp()
        res.send(pengembalianPnBp)
    } catch (error) {
        res.status(500).send(error.message)  
    }
})

router.get("/:id", async (req, res) => {
    try {
        const pengembalianPnBpId = parseInt(req.params.id)
        const pengembalianPnBp = await pengembalianPnbpService.getPengembalianPnbpById(pengembalianPnBpId)
        res.status(200).json(pengembalianPnBp)
    } catch (error) {
        res.status(400).send(error.message)
    }  
})

router.patch("/:id", async (req, res) => {
    try {
        const pengembalianPnBpId = req.params.id
        const dataPnbp = req.body
        const updatePengembalianPnbp = await pengembalianPnbpService.editPengembalianPnbpById(pengembalianPnBpId, dataPnbp) 
        res.status(200).json({updatePengembalianPnbp, message:"berhasill"})
    } catch (error) {
        res.status(400).json({error: error.message})
    } 
})

router.delete("/:id", async (req, res) => {
    try {
        const pengembalianPnBpId = req.params.id
        await pengembalianPnbpService.deletePengembalianPnbpById(pengembalianPnBpId)
        res.status(200).json({message:"Berhasil"})
    } catch (error) {
        res.status(400).send(error.message)  
    }
    
})

module.exports = router;