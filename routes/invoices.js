const express = require('express')
const router = express.Router()

const {
  createInvoice,
  getInvoiceDetail,
  getRecentInvoiceDetail,
  cancelInvoice,
  getUnpaidInvoice,
  getInvoiceAccoToType,
} = require('../controllers/clients')

router.route('/add').post(createInvoice)
router.route('/:id').get(getInvoiceDetail)
router.route('/recent').get(getRecentInvoiceDetail)
router.route('/cancel/:id').get(cancelInvoice)
router.route('/unpaid/:client_id').get(getUnpaidInvoice)
router.route('/:page/:perPage/:type').get(getInvoiceAccoToType)

module.exports = router
