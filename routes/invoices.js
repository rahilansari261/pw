const express = require('express')
const router = express.Router()

const {
  createInvoice,
  getInvoiceDetail,
  getRecentInvoiceDetail,
  cancelInvoice,
  getUnpaidInvoice,
  getPaginatedInvoicesAccoToType,
  getPaginatedInvoicesAccoToTypeAndSearch,
  getInvoicesReportWithDateFilter,
  getPaginatedInvoicesWithDateFilter,
  getAllInvoices,
  getAllCancelledInvoices,
  getAllInvoicesAccoToSearch,
} = require('../controllers/clients')

router.route('/add').post(createInvoice)
router.route('/:id').get(getInvoiceDetail)
router.route('/recent').get(getRecentInvoiceDetail)
router.route('/cancel/:id').get(cancelInvoice)
router.route('/unpaid/:client_id').get(getUnpaidInvoice)
router.route('/:page/:perPage/:type').get(getPaginatedInvoicesAccoToType)
router
  .route('/:page/:perPage/:type/:searchStr')
  .get(getPaginatedInvoicesAccoToTypeAndSearch)
router
  .route('/report/:start_date/:end_date')
  .get(getInvoicesReportWithDateFilter)
router
  .route('/:page/:perPage/:start_date/:end_date')
  .get(getPaginatedInvoicesWithDateFilter)
router.route('/getall').get(getAllInvoices)
router.route('/cancelled').get(getAllCancelledInvoices)
router.route('/:searchStr').get(getAllInvoicesAccoToSearch)
module.exports = router
