const bcrypt = require('bcrypt')
const {
  insertUser,
  findUser,
  findUserById,
  editUser,
  deleteUser
} = require('./user.repository')

async function createUser (newData) {
  const hashedPassword = await bcrypt.hash(newData.password, 10)

  newData.password = hashedPassword
  const newUser = await insertUser(newData)
  return newUser
}

async function getAllUser () {
  const user = findUser()
  return user
}

async function getUserById (id) {
  console.log('Fetching user with ID:', id)
  const user = await findUserById(id)
  if (!user) {
    throw new Error('cannot Find User By Id')
  }
  return user
}

async function editUserById (id, user) {
  if (user.password) {
    const hashedPassword = await bcrypt.hash(user.password, 10)
    user.password = hashedPassword
  }
  await getUserById(id)
  const updateUser = await editUser(id, user)
  return updateUser
}

async function deleteUserById (id) {
  await getUserById(id)
  await deleteUser(id)
}

module.exports = {
  createUser,
  getAllUser,
  getUserById,
  editUserById,
  deleteUserById
}
