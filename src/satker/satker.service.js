const satkerRepo = require('./satker.repository')

async function createSatker (newDataSatker) {
  const newSatker = await satkerRepo.insertSatker(newDataSatker)
  return newSatker
}

async function getAllSatker () {
  const satker = satkerRepo.findSatker()
  return satker
}

async function getSatkerById (id) {
  const satker = await satkerRepo.findSatkerById(id)
  if (!satker) {
    throw new Error('cannot Find User By Id')
  }
  return satker
}

async function editSatkerById (id, satker) {
  await getSatkerById(id)
  const updateSatker = await satkerRepo.editSatker(id, satker)
  return updateSatker
}

async function deleteSatkerid (id) {
  await getSatkerById(id)
  await satkerRepo.deleteSatker(id)
}

module.exports = {
  createSatker,
  getAllSatker,
  getSatkerById,
  editSatkerById,
  deleteSatkerid
}
