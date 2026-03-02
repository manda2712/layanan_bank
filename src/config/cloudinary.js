// // const cloudinary = require('cloudinary').v2

// // cloudinary.config({
// //   cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
// //   api_key: process.env.CLOUDINARY_API_KEY,
// //   api_secret: process.env.CLOUDINARY_API_SECRET
// // })

// // module.exports = cloudinary

// // src/services/cloudinaryService.js
// const cloudinary = require('cloudinary').v2
// const fs = require('fs')

// // Konfigurasi Cloudinary
// cloudinary.config({
//   cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
//   api_key: process.env.CLOUDINARY_API_KEY,
//   api_secret: process.env.CLOUDINARY_API_SECRET
// })

// // Fungsi helper untuk upload file
// async function uploadToCloudinary (file) {
//   try {
//     const result = await cloudinary.uploader.upload(file.path, {
//       resource_type: 'auto' // otomatis deteksi PDF, image, dll
//     })

//     // Hapus file lokal setelah upload
//     fs.unlink(file.path, err => {
//       if (err) console.error('Gagal hapus file lokal:', err)
//     })

//     return result.secure_url // URL HTTPS valid
//   } catch (error) {
//     console.error('Error upload ke Cloudinary:', error)
//     throw new Error('Gagal upload file ke Cloudinary')
//   }
// }

// module.exports = {
//   cloudinary, // untuk akses instance Cloudinary langsung jika perlu
//   uploadToCloudinary // helper cepat upload
// }

// src/services/cloudinaryService.js
const cloudinary = require('cloudinary').v2
const fs = require('fs')

// Konfigurasi Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
})

// Upload dari file disk
async function uploadFromFile (file) {
  try {
    const result = await cloudinary.uploader.upload(file.path, {
      resource_type: 'auto'
    })

    fs.unlink(file.path, err => {
      if (err) console.error('Gagal hapus file lokal:', err)
    })

    return result.secure_url
  } catch (error) {
    console.error('Error upload ke Cloudinary:', error)
    throw new Error('Gagal upload file ke Cloudinary')
  }
}

// Upload dari buffer (memoryStorage)
async function uploadFromBuffer (buffer) {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { resource_type: 'auto' },
      (error, result) => {
        if (error) reject(error)
        else resolve(result.secure_url)
      }
    )
    stream.end(buffer)
  })
}

module.exports = {
  cloudinary,
  uploadFromFile,
  uploadFromBuffer
}
