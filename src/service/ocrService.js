const axios = require('axios')
const FormData = require('form-data')
const fs = require('fs')

async function sendToOCR (filePath) {
  const form = new FormData()
  form.append('file', fs.createReadStream(filePath))

  const response = await axios.post('http://localhost:5000/ocr', form, {
    headers: form.getHeaders()
  })

  return response.data
}

module.exports = { sendToOCR }
