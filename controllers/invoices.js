const Invoice = require('../models/Invoice')
const User = require('../models/User')
const passwordHash = require('password-hash')
require('dotenv').config()
const jwt = require('jsonwebtoken')
// const asyncWrapper = require('../middleware/async')
// const { createCustomError } = require('../errors/custom-error')

const createInvoice = async (req, res) => {
  var invoiceData = req.body.invoiceData
  // prettier-ignore
  if (!invoiceData) return res.status(200).json({message: ' Data Not Provided',data: null,success: false,})
  // prettier-ignore
  const InvoiceCollection = mongoose.model(`${req.doc._id}-invoices`, require('../models/Invoice'))
  // prettier-ignore
  const ChartSaleCollection = mongoose.model(`${req.doc._id}-chartsale`, require('../models/ChartSale'))
  // prettier-ignore
  const AccountCollection = mongoose.model(`${req.doc._id}-accounts`, require('../models/Account'))
  // prettier-ignore
  const ClientCollection = mongoose.model(`${req.doc._id}-clients`, require('../models/Client'))

  const userDoc = await User.findById(req.doc._id)
  const newInvoice = {
    client_data: {
      client_company_name: invoiceData.client_data.client_company_name,
      client_name: invoiceData.client_data.client_name,
      client_tin: invoiceData.client_data.client_tin,
      client_stn: invoiceData.client_data.client_stn,
      client_address: invoiceData.client_data.client_address,
      client_phone: invoiceData.client_data.client_phone,
      client_email: invoiceData.client_data.client_email,
      client_id: invoiceData.client_data.client_id,
    },
    user_data: {
      user_company_name: invoiceData.user_data.user_company_name,
      user_tin: invoiceData.user_data.user_tin,
      user_stn: invoiceData.user_data.user_stn,
      user_address: invoiceData.user_data.user_address,
      user_phone: invoiceData.user_data.user_phone,
      user_logo: invoiceData.user_data.user_logo,
      user_tc: invoiceData.user_data.user_tc,
    },
    invoice_data: {
      number: invoiceData.invoice_data.number,
      taxTotal: invoiceData.invoice_data.taxTotal,
      grand_total: invoiceData.invoice_data.grand_total,
      balance: invoiceData.invoice_data.grand_total,
      sub_total: invoiceData.invoice_data.subtotal,
      discount: invoiceData.invoice_data.discount,
      date: new Date(invoiceData.invoice_data.date),
      tax_summary: [],
      status: true,
    },
    product_data: [],
  }
  // TODO apply loop to save all the tax summary in the array.
  for (var i = 0; i < invoiceData.invoice_data.tax_summary.length; i++) {
    newInvoice.invoice_data.tax_summary.push({
      tax_name: invoiceData.invoice_data.tax_summary[i].tax_name,
      tax_amount: invoiceData.invoice_data.tax_summary[i].tax_amount,
    })
  }

  for (var i = 0; i < invoiceData.product_data.length; i++) {
    newInvoice.product_data.push({
      product_name: invoiceData.product_data[i].product_name,
      product_desc: invoiceData.product_data[i].product_desc,
      qty: invoiceData.product_data[i].qty,
      product_price: invoiceData.product_data[i].product_price,
      product_unit: invoiceData.product_data[i].product_unit,
      discount: invoiceData.product_data[i].discount,
      tax_name: invoiceData.product_data[i].tax_name,
      tax_rate: invoiceData.product_data[i].tax_rate,
      tax_amount: invoiceData.product_data[i].tax_amount,
      row_total: invoiceData.product_data[i].row_total,
    })
  }

  if (!userDoc.user_settings.user_invoice_number) {
    newInvoice.invoice_data.number = 1
  } else {
    newInvoice.invoice_data.number =
      userDoc.user_settings.user_invoice_number + 1
  }
  const createdInvoice = await InvoiceCollection.create(newInvoice)
  // prettier-ignore
  if (!createdInvoice) return res.status(200).json({ message: error, data: null, success: false })

  // prettier-ignore
  const userData = await User.findOneAndUpdate({ _id: req.doc._id },{ $inc: { 'user_settings.user_invoice_number': 1 } })
  // prettier-ignore
  if (!userData) return res.status(200).json({ message: error, data: null, success: false })
  // prettier-ignore
  saleChart(newInvoice.invoice_data.date, newInvoice.invoice_data.grand_total, ChartSaleCollection)
  // prettier-ignore
  updateAccounts(newInvoice, AccountCollection, ClientCollection, invoiceData.invoice_data.advancePayment, InvoiceCollection)
  // prettier-ignore
  res.status(200).json({message: 'invoice Added Successfully',data: doc, success: true,})
}

module.exports = {
  createInvoice,
  updateInvoice,
  getInvoiceDetail,
  cancelInvoice,
  getInvoiceWithSearchAndPaging,
}
