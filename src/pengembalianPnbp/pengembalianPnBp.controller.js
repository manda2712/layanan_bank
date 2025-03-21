const express = require("express")
const router = express.Router()
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const pengembalianPnbpService = require("./pengembalianPnBp.service")
const authorizeJWT = require("../middleware/authorizeJWT");

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
            return res.status(401).json({message: "User Belum Terautentikasi"})
        }

        const{pihakMengajukan ,kodeSatker ,noTelpon } = req.body
        const unggahDokumen = req.file ? req.file.path : null; // Ambil path file
        if (!pihakMengajukan ||!kodeSatker || !noTelpon) {
            return res.status(400).json({ message: "Semua field wajib diisi!" });
        }

        if (!unggahDokumen) {
            return res.status(400).json({ message: "Dokumen wajib diunggah!" });
        }


        const dataPnbp = await pengembalianPnbpService.createPengembalianPnbp({
            pihakMengajukan,
            kodeSatker,
            noTelpon, 
            unggahDokumen
        }, req.userId)
        res.status(201).json({dataPnbp, message:"Berhasil dalam Mmembuat Pengembalian PNBP"})
    } catch (error) {
        res.status(400).json({error:error.message})  
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