const express = require('express')
const router = express.Router()

const { createProduct, getProductDetails } = require('../controllers/products')

router.route('/register2').post(createProduct)
router
  .route('/products/:id/:searchString/:page/:perPage/:start_date/:end_date')
  .get(getProductDetails)

module.exports = router
