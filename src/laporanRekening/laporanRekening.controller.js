const express = require("express")
const router = express.Router()
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const authorizeJWT = require("../middleware/authorizeJWT")
const laporanRekeningService = require("./laporanRekening.service")

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

router.post('/create', authorizeJWT, upload.single("unggahDokumen"), async (req, res) => {
    try {
        console.log("User Id dari Request:", req.userId)
        if (!req.userId) {
            return res.status(401).json({message: "User Tidak Terutentikasi"})  
        }

        const{kodeSatker, noTelpon, jenisLaporan} = req.body
        const unggahDokumen = req.file ? req.file.path : null; // Ambil path file
        if (!kodeSatker || !noTelpon || !jenisLaporan) {
            return res.status(400).json({ message: "Semua field wajib diisi!" });
        }

        if (!unggahDokumen) {
            return res.status(400).json({ message: "Dokumen wajib diunggah!" });
        }
        const dataLaporan = await laporanRekeningService.createLaporanRekening({
            kodeSatker, 
            noTelpon, 
            jenisLaporan, 
            unggahDokumen
        }, req.userId)
        res.status(201).json({dataLaporan, message:"Berhasil Membuat Laporan Rekening"})
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