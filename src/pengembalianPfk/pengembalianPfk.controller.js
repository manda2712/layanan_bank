const express = require("express")
const router = express.Router()
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const pengembalianPfkService = require("./pengembalianPfk.service")
const authorizeJWT = require("../middleware/authorizeJWT")

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
        console.log("User ID dari Request:", req.userId)

        if (!req.userId) {
            return res.status(401).json({message:"user tidak terautentikasi"})  
        }

        const {pihakMengajukan, kodeSatker, noTelpon} = req.body
        const unggahDokumen = req.file ? req.file.path : null; // Ambil path file
        if (!pihakMengajukan ||!kodeSatker || !noTelpon) {
            return res.status(400).json({ message: "Semua field wajib diisi!" });
        }

        if (!unggahDokumen) {
            return res.status(400).json({ message: "Dokumen wajib diunggah!" });
        }

        const dataPfk = await pengembalianPfkService.createPengembalianPfk({
            pihakMengajukan, 
            kodeSatker, 
            noTelpon,
            unggahDokumen
        }, req.userId)

        res.status(201).json({dataPfk, message: "Pengembalian PFK Berhasil Dibuat"})
    } catch (error) {
        res.status(400).json({ error: error.message });  
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