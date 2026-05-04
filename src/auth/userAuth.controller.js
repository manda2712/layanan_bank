const express = require('express')
const router = express.Router()

const userAuthService = require('./userAuth.services')

router.post('/register', async (req, res, next) => {
  const { namaLengkap, email, noTelepon, password, satkerId, role } = req.body
  try {
    const newUser = await userAuthService.register(
      namaLengkap,
      email,
      noTelepon,
      satkerId,
      password,
      role
    )
    res.status(201).json({
      data: {
        namaLengkap: newUser.namaLengkap,
        email: newUser.email,
        noTelepon: newUser.noTelepon,
        satkerId: newUser.satkerId,
        role: newUser.role
      },
      message: 'Registration Success'
    })
  } catch (error) {
    res.status(400).json({ error: error.message })
  }
})

router.post('/login', async (req, res) => {
  const { email, satkerId, password } = req.body

  if (!email || !satkerId || !password) {
    return res
      .status(400)
      .json({ error: 'Email, Kode Satker dan password wajib diisi' })
  }

  try {
    const user = await userAuthService.login(email, satkerId, password)
    res.status(200).json({ data: user, message: 'Login berhasil' })
  } catch (error) {
    res.status(401).json({ error: error.message })
  }
})

module.exports = router
