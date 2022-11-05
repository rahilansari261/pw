const express = require('express')
const router = express.Router()

const { createAccount, getAccountDetails } = require('../controllers/accounts')

router.route('/register2').post(createAccount)
router
  .route('/accounts/:id/:searchString/:page/:perPage/:start_date/:end_date')
  .get(getAccountDetails)

module.exports = router
