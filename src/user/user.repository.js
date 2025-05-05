const prisma = require('../db')

async function insertUser (user) {
  const newUser = await prisma.user.create({
    data: {
      namaLengkap: user.namaLengkap,
      email: user.email,
      noTelepon: user.noTelepon,
      password: user.password,
      role: user.role
    }
  })
  return newUser
}

async function findUser () {
  const user = await prisma.user.findMany({
    select: {
      id: true,
      namaLengkap: true,
      email: true,
      noTelepon: true,
      role: true
    }
  })
  return user
}

async function findUserById (id) {
  const user = await prisma.user.findUnique({
    where: {
      id: parseInt(id)
    },
    select: {
      id: true,
      namaLengkap: true,
      email: true,
      noTelepon: true,
      role: true
    }
  })
  return user
}

async function findAllAdminUsers () {
  return prisma.user.findMany({
    where: {
      role: 'admin'
    }
  })
}

async function editUser (id, user) {
  const updateUser = await prisma.user.update({
    where: {
      id: parseInt(id)
    },
    data: {
      id: user.id,
      namaLengkap: user.namaLengkap,
      email: user.email,
      noTelepon: user.noTelepon,
      password: user.password,
      role: user.role
    }
  })
  return updateUser
}

async function deleteUser (id) {
  await prisma.user.delete({
    where: {
      id: parseInt(id)
    }
  })
}

module.exports = {
  insertUser,
  findUser,
  findUserById,
  editUser,
  deleteUser,
  findAllAdminUsers
}
