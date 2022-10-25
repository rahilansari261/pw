const express = require('express')
const router = express.Router()

const {
  createUser,
  loginUser,
  forgotUser,
  verifyUser,
  resetUser,
  updateUser,
  passwordchangeUser,
  addtaxUser,
  removetaxUser,
} = require('../controllers/users')

router.route('/register2').post(createUser)
router.route('/login').post(loginUser)
router.route('/forgot').post(forgotUser)
router.route('/verify/:c').get(verifyUser)
router.route('/reset/:c').post(resetUser)
router.route('/update').post(updateUser)
router.route('/passwordchange').post(passwordchangeUser)
router.route('/settings/addtax').post(addtaxUser)
router.route('/settings/removetax/:taxId').get(removetaxUser)
module.exports = router
