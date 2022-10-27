const express = require('express')
const router = express.Router()

const {
  createAccount,
  loginAccount,
  forgotAccount,
  verifyAccount,
  resetAccount,
  updateAccount,
  passwordchangeAccount,
  addtaxAccount,
  removetaxAccount,
} = require('../controllers/accounts')

router.route('/register2').post(createAccount)
router.route('/login').post(loginAccount)
router.route('/forgot').post(forgotAccount)
router.route('/verify/:c').get(verifyAccount)
router.route('/reset/:c').post(resetAccount)
router.route('/update').post(updateAccount)
router.route('/passwordchange').post(passwordchangeAccount)
router.route('/settings/addtax').post(addtaxAccount)
router.route('/settings/removetax/:taxId').get(removetaxAccount)
module.exports = router
