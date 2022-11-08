const express = require('express')
const router = express.Router()

const {
  createClient,
  updateClient,
  removeClient,
  getClientDetail,
  getClientWithSearchAndPaging,
  createClientAccounts,
} = require('../controllers/clients')

router.route('/add').post(createClient)
router.route('/update').post(updateClient)
router.route('/:id').get(getClientDetail)
router.route('/remove/:id').get(removeClient)
router.route('/:page/:perPage/:searchStr').get(getClientWithSearchAndPaging)
router
  .route('/sorted/:page/:perPage/:searchStr')
  .get(getClientWithSearchAndPaging)
router.route('/accounts').post(createClientAccounts)

module.exports = router
