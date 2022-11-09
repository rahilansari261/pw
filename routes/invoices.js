const express = require('express')
const router = express.Router()

const {
  createInvoice,
  getInvoiceDetail,
  cancelInvoice,
  getInvoiceWithSearchAndPaging,
} = require('../controllers/clients')

router.route('/add').post(createInvoice)
router.route('/:id').get(getInvoiceDetail)
router.route('/cancel/:id').get(cancelInvoice)
router.route('/:page/:perPage/:searchStr').get(getInvoiceWithSearchAndPaging)

module.exports = router
