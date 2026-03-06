const jwt = require('jsonwebtoken')

const authorizationAdmin = (req, res, next) => {
  const authHeader = req.headers.authorization
  console.log('🔍 Header Authorization:', authHeader)

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    console.log('❌ Token tidak diberikan atau salah format')
    return res
      .status(401)
      .json({ message: 'Token tidak diberikan atau salah format' })
  }

  try {
    const token = authHeader.split(' ')[1]
    console.log('🔎 Token yang diterima:', token) // Debugging

    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    console.log('✅ Decoded Token:', decoded)

    // Debugging: Cek apakah role adalah 'admin'
    console.log('✅ Role yang diterima:', decoded.role)

    if (decoded.role && decoded.role.toLowerCase() !== 'admin') {
      console.log('❌ Role bukan admin atau tidak tersedia:', decoded.role)
      return res
        .status(403)
        .json({ message: 'Tidak dapat diotorisasi, bukan admin' })
    }

    req.user = decoded
    next()
  } catch (error) {
    console.error('❌ Authorization error:', error.message)
    return res.status(401).json({ message: 'Token tidak valid atau expired' })
  }
}

module.exports = authorizationAdmin
