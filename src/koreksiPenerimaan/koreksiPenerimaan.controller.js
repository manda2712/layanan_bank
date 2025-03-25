const express = require("express");
const router = express.Router()
const authorizeJWT = require("../middleware/authorizeJWT")
const koreksiPenerimaanService = require("./koreksiPenerimaan.service");
const { pengajuanNota } = require("../db");
const multer = require("multer");
const path = require("path");
const fs = require("fs");

const uploadDir = "uploads";
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir);
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
      cb(null, "uploads/"); // Simpan file di folder uploads/
  },
  filename: function (req, file, cb) {
    const ext = path.extname(file.originalname); // Ambil ekstensi asli
    const uniqueSuffix = Date.now(); // Gunakan timestamp agar unik
    cb(null, `file_${uniqueSuffix}${ext}`); // Format nama file
    }
});

const upload = multer({ storage });

router.post('/create', authorizeJWT, upload.single("unggahDokumem"), async (req, res) => {
    try {
       console.log("User ID dari request:", req.userId)

       if (!req.userId) {
        return res.status(401).json({message:"User Tidak Terautentikasi"})
       }

       const {kodeSatker, noTelpon, tahunSteoran} = req.body
       const unggahDokumem = req.file ? req.file.path : null; // Ambil path file
       if (!kodeSatker || !noTelpon || !tahunSteoran) {
           return res.status(400).json({ message: "Semua field wajib diisi!" });
       }

       if (!unggahDokumem) {
           return res.status(400).json({ message: "Dokumen wajib diunggah!" });
       }

       const dataKoreksi = await koreksiPenerimaanService.createKoreksiPenerimaan({
            kodeSatker, 
            noTelpon, 
            tahunSteoran, 
            unggahDokumem
       }, req.userId)
        res.status(201).json({dataKoreksi, message: "Koreksi Penerimaan Berhasil Dibuat"})
    } catch (error) {
        res.status(400).send(error.message)  
    } 
})

router.get("/", async (req, res) => {
    try {
        const koreksiPenerimaan = await koreksiPenerimaanService.getAllKoreksiPenerimaan()
        res.send(koreksiPenerimaan)
    } catch (error) {
        res.status(500).send(error.message)
    } 
})

router.get("/:id", async (req, res) => {
    try {
        const koreksiPenerimaanId = parseInt(req.params.id)
        const koreksiPenerimaan = await koreksiPenerimaanService.getKoreksiPenerimaanById(koreksiPenerimaanId)
        res.status(200).send(koreksiPenerimaan)
    } catch (error) {
        res.status(400).send(error.message) 
    } 
})

router.patch("/:id", async (req, res) => {
    try {
        const koreksiPenerimaanId = req.params.id
        const dataBukti = req.body
        const updateKoreksiPenerimaan = await koreksiPenerimaanService.editKoreksiPenerimaanById(koreksiPenerimaanId, dataBukti)
        res.status(200).json({updateKoreksiPenerimaan, message: "Koreksi Penermaan Berhasil Diubah"})
    } catch (error) {
        res.status(400).json({error: error.message})  
    }  
})

router.delete("/:id", async (req, res) => {
    try {
        const koreksiPenerimaanId = req.params.id
        await koreksiPenerimaanService.deleteKoreksiPenerimaanById(koreksiPenerimaanId)
        res.status(200).json({message:"Koreksi Penerimaan Berhasil Dihapus"})
    } catch (error) {
        res.status(400).send(error.message)
        
    }
    
})

module.exports = router