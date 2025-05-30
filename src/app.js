const express = require('express')
const app = express()
const path = require('path')
const dotenv = require('dotenv')
const port = 3000
const fs = require('fs')
const cors = require('cors')
app.use(express.json())
app.use(cors())
dotenv.config()

// Setup static file serving
const uploadDir = path.join(__dirname, 'uploads') // kalau app.js ada di root project
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true })
}
app.use('/uploads', express.static(uploadDir)) // <-- Serve folder uploads

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})

//userAuth
const userAuthController = require('./auth/userAuth.controller')
app.use('/api/auth', userAuthController)

//user
const userController = require('./user/user.controller')
app.use('/api/user', userController)

//retur
const returController = require('./returSp2d/returSp2d.controller')
app.use('/api/retur', returController)
//monitoring retur
const monitoringReturSp2dController = require('./monitoringReturSp2d/monitoringReturSp2d.controller')
app.use('/api/monitoringRetur', monitoringReturSp2dController)

//penerbitan Bukti
const penerbitanController = require('./penerbitanBukti/penerbitanBukti.controller')
app.use('/api/penerbitanBukti', penerbitanController)
//penerbitan Bukti
const monitoringPenerbitanBuktiController = require('./monitoringPenerbitanBukti/monitoringPenerbitanBukti.controller')
app.use('/api/monitoringPenerbitanBukti', monitoringPenerbitanBuktiController)

//penerbitan Nota
const penerbitanNotaController = require('./penerbitanNota/penerbitanNota.controller')
app.use('/api/nota', penerbitanNotaController)
//monitoring Nota
const monitoringPenerbitanNotaController = require('./monitoringPenerbitanNota/monitoringPenerbitanNota.controller')
app.use('/api/monitoringNota', monitoringPenerbitanNotaController)

//pengajuan pnpb
const pengembalianPnBpController = require('./pengembalianPnbp/pengembalianPnBp.controller')
app.use('/api/pengembalianPnbp', pengembalianPnBpController)
//monitoring Pnbp
const monitoringPengembalianPnbpController = require('./monitoringPengembalianPnbp/monitoringPengembalianPnbp.controller')
app.use('/api/monitoringPnbp', monitoringPengembalianPnbpController)

//penerimaan Koreksi
const koreksiPenerimaanController = require('./koreksiPenerimaan/koreksiPenerimaan.controller')
app.use('/api/koreksiPenerimaan', koreksiPenerimaanController)
//monitoring Penerimaan Koreksi
const monitoringPenerimaanKoreksiController = require('./monitoringKoreksiPenerimaan/monitoringKoreksiPenerimaan.controller')
app.use('/api/monitoringKoreksi', monitoringPenerimaanKoreksiController)

//pengajuan Void
const pengajuanVoidController = require('./pengajuanVoid/pengajuanVoid.controller')
app.use('/api/pengajuanVoid', pengajuanVoidController)
//monitoring Pengajuan Void
const monitoringPengajuanVoidController = require('./monitoringPengajuanVoid/monitoringPengajuanVoid.controller')
app.use('/api/monitoringVoid', monitoringPengajuanVoidController)

//pembukaan Rekening
const pembukaanRekeningController = require('./pembukaanRekening/pembukaanRekening.controller')
app.use('/api/pembukaanRekening', pembukaanRekeningController)
//monitoring
const monitoringPembukaanRekeningController = require('./monitoringPembukaanRekening/monitoringPembukaanRekening.controller')
app.use(
  '/api/monitoringPembukaanRekening',
  monitoringPembukaanRekeningController
)

//laporan Rekening
const laporanRekeningController = require('./laporanRekening/laporanRekening.controller')
app.use('/api/laporanRekening', laporanRekeningController)
//monitoring Laporan Rekening
const monitoringLaporanRekeningController = require('./monitoringLaporanRekening/monitoringLaporanRekening.controller')
app.use('/api/monitoringLaporan', monitoringLaporanRekeningController)

//pengembalian PFK
const pengembalianPfkController = require('./pengembalianPfk/pengembalianPfk.controller')
app.use('/api/pengembalianPfk', pengembalianPfkController)
//monitoring PFK
const monitoringPengembalianPfkController = require('./monitoringPengembalianPfk/monitoringPengembalianPfk.controller')
app.use('/api/monitoringPfk', monitoringPengembalianPfkController)

const notificationController = require('./notifikasi/notifikasi.controller')
app.use('/api/notifikasi', notificationController)

// export default app
