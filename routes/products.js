const express = require('express')
const router = express.Router()

const {
  createProduct,
  updateProduct,
  removeProduct,
  getProductDetail,
  getProductWithSearchAndPaging,
} = require('../controllers/products')

router.route('/add').post(createProduct)
router.route('/update').post(updateProduct)
router.route('/remove/:id').get(removeProduct)
router.route('/:id').get(getProductDetail)
router.route('/:page/:perPage/:searchStr').get(getProductWithSearchAndPaging)

module.exports = router
