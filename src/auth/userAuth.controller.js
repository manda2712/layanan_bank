const express = require('express')
const router = express.Router()

const userAuthService = require('./userAuth.services')

router.post('/register', async (req, res, next) => {
  const { namaLengkap, email, noTelepon, password, satkerId } = req.body
  try {
    const newUser = await userAuthService.register(
      namaLengkap,
      email,
      noTelepon,
      satkerId,
      password
    )
    res.status(201).json({
      data: {
        namaLengkap: newUser.namaLengkap,
        email: newUser.email,
        noTelepon: newUser.noTelepon,
        role: newUser.role,
        satkerId: newUser.satkerId
      },
      message: 'Registration Success'
    })
  } catch (error) {
    res.status(400).json({ error: error.message })
  }
})

router.post('/login', async (req, res) => {
  const { email, password } = req.body

  if (!email || !password) {
    return res.status(400).json({ error: 'Email dan password wajib diisi' })
  }

  try {
    const user = await userAuthService.login(email, password)
    res.status(200).json({ data: user, message: 'Login berhasil' })
  } catch (error) {
    res.status(401).json({ error: error.message })
  }
})

module.exports = router
