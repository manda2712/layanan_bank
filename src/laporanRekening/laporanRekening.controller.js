const express = require("express")
const router = express.Router()

const laporanRekeningService = require("./laporanRekening.service")

router.post('/create', async (req, res) => {
    try {
        const laporanRekening = req.body
        const dataRekening = await laporanRekeningService.createLaporanRekening(laporanRekening)
        res.status(201).json({dataRekening, message:"Berhasil Membuat Laporan Rekening"})
    } catch (error) {
        res.status(400).send(error.message) 
    }
})

router.get('/', async (req, res) => {
    try {
        const laporanRekening = await laporanRekeningService.getAllLaporanRekening()
        res.send(laporanRekening)
    } catch (error) {
        res.status(400).send(error.message)
    } 
})

router.get('/:id', async (req, res) => {
    try {
        const laporanRekeningId = parseInt(req.params.id)
        const laporanRekening = await laporanRekeningService.getLaporanRekeningById(laporanRekeningId)
        res.status(200).send(laporanRekening)
    } catch (error) {
        res.status(400).send(error.message)  
    }
})


router.patch('/:id', async (req, res) => {
    try {
        const laporanRekeningId = req.params.id
        const dataRekening = req.body
        const updateLaporanRekening = await laporanRekeningService.updateLaporanRekeningById(laporanRekeningId, dataRekening)
        res.status(200).json({updateLaporanRekening, message: "berhasil diubah"})    
    } catch (error) {
        res.status(400).json({error: error.message})   
    } 
})

router.delete('/:id', async (req, res) => {
    try {
        const laporanRekeningId = req.params.id
        await laporanRekeningService.deleteLaporanRekeningById(laporanRekeningId)
        res.status(200).json({message: "Berhasil Dihapus"})
    } catch (error) {
        res.status(400).send(error.message)
    } 
})

module.exports= router