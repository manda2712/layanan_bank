const express = require("express");
const router = express.Router();
const penerbitanNotaService = require("./penerbitanNota.services");
const authorizeJWT = require("../middleware/authorizeJWT");
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

router.post("/create", authorizeJWT, upload.single("unggahDokumen"), async (req, res) => {
    try {
        console.log("User Id dari Request:", req.userId)

        if (!req.userId) {
            return res.status(401).json({message:"User Tidak Terautentikasi"})   
        }

        const{kodeSatker, noTelpon, tahunSteoran} = req.body
        const unggahDokumen = req.file ? req.file.path : null; // Ambil path file

        if (!kodeSatker || !noTelpon || !tahunSteoran) {
            return res.status(400).json({ message: "Semua field wajib diisi!" });
        }

        if (!unggahDokumen) {
            return res.status(400).json({ message: "Dokumen wajib diunggah!" });
        }

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
