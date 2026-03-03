// ocrService.js
const axios = require('axios')
const FormData = require('form-data')
const fs = require('fs')

async function extractTextFromPDF (filePath) {
  // Ganti nama di sini
  const form = new FormData()
  form.append('file', fs.createReadStream(filePath))

  const response = await axios.post('http://localhost:5000/ocr', form, {
    headers: form.getHeaders()
  })

  // Pastikan return hanya teksnya saja agar konsisten dengan logika KMP kamu
  return response.data.text
}

module.exports = { extractTextFromPDF } // Ekspor dengan nama baru
