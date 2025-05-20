const jwt = require('jsonwebtoken')
const userAuthRepository = require('./userAuth.repository')
const bcrypt = require('bcrypt')

function generateToken (user) {
  return jwt.sign(
    { id: user.id, email: user.email, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: '1h' }
  )
}

async function register (namaLengkap, email, noTelepon, password) {
  try {
    const hashedPassword = await bcrypt.hash(password, 10)
    const user = {
      namaLengkap,
      email,
      noTelepon,
      password: hashedPassword,
      role: 'user'
    }
    const newUser = await userAuthRepository.createUser(user)
    return newUser
  } catch (error) {
    throw new Error('Failed Register User')
  }
}

async function login (email, password) {
  const user = await userAuthRepository.findUserAuth(email)
  if (!user) {
    throw new Error('Username Tidak Cocok')
  }

  const isValidPassword = await bcrypt.compare(password, user.password)

  if (!isValidPassword) {
    throw new Error('Password Tidak Cocok')
  }
  console.log('✅ User login:', user)
  const token = generateToken(user)
  return { user, token }
}

module.exports = {
  register,
  login
}
