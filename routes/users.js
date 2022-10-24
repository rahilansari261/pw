const express = require('express')
const router = express.Router()

const { createUser } = require('../controllers/users')

router.route('/register2').post(createUser)

module.exports = router
