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
  const Invoice = mongoose.model(`${req.doc._id}-invoices`, require('../models/Invoice'))
  // prettier-ignore
  const ChartSale = mongoose.model(`${req.doc._id}-chartsale`, require('../models/ChartSale'))
  // prettier-ignore
  const Account = mongoose.model(`${req.doc._id}-accounts`, require('../models/Account'))
  // prettier-ignore
  const Client = mongoose.model(`${req.doc._id}-clients`, require('../models/Client'))

  User.findById(req.doc._id, function (err, userDoc) {
    // console.log(userDoc.user_settings.user_invoice_number);
    invoiceData.invoice_data.date = new Date(invoiceData.invoice_data.date)
    // var localTime = invoiceData.invoice_data.date.getTime();
    // var localOffset = invoiceData.invoice_data.date.getTimezoneOffset() * 60000;
    // var utc = localTime + localOffset;
    // var offset = 5.5;
    // invoiceData.invoice_data.date = new Date(utc + (3600000*offset));
    var invoice = new invoiceSchema({
      'client_data.client_company_name':
        invoiceData.client_data.client_company_name,
      'client_data.client_name': invoiceData.client_data.client_name,
      'client_data.client_tin': invoiceData.client_data.client_tin,
      'client_data.client_stn': invoiceData.client_data.client_stn,
      'client_data.client_address': invoiceData.client_data.client_address,
      'client_data.client_phone': invoiceData.client_data.client_phone,
      'client_data.client_email': invoiceData.client_data.client_email,
      'client_data.client_id': invoiceData.client_data.client_id,

      'user_data.user_company_name': invoiceData.user_data.user_company_name,
      'user_data.user_tin': invoiceData.user_data.user_tin,
      'user_data.user_stn': invoiceData.user_data.user_stn,
      'user_data.user_address': invoiceData.user_data.user_address,
      'user_data.user_phone': invoiceData.user_data.user_phone,
      'user_data.user_logo': invoiceData.user_data.user_logo,
      'user_data.user_tc': invoiceData.user_data.user_tc,
      product_data: [],
      'invoice_data.number': invoiceData.invoice_data.number,
      'invoice_data.taxTotal': invoiceData.invoice_data.taxTotal,
      'invoice_data.grand_total': invoiceData.invoice_data.grand_total,
      'invoice_data.balance': invoiceData.invoice_data.grand_total,
      'invoice_data.sub_total': invoiceData.invoice_data.subtotal,
      'invoice_data.discount': invoiceData.invoice_data.discount,
      'invoice_data.date': invoiceData.invoice_data.date,
      'invoice_data.tax_summary': [],
      'invoice_data.status': true,
    })
    // TODO apply loop to save all the tax summary in the array.
    for (var i = 0; i < invoiceData.invoice_data.tax_summary.length; i++) {
      invoice.invoice_data.tax_summary.push({
        tax_name: invoiceData.invoice_data.tax_summary[i].tax_name,
        tax_amount: invoiceData.invoice_data.tax_summary[i].tax_amount,
      })
    }

    for (var i = 0; i < invoiceData.product_data.length; i++) {
      invoice.product_data.push({
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
    invoice.invoice_data.sub_total = invoiceData.invoice_data.subtotal

    if (!userDoc.user_settings.user_invoice_number) {
      invoice.invoice_data.number = 1
    } else {
      invoice.invoice_data.number =
        userDoc.user_settings.user_invoice_number + 1
    }
    // console.log(invoice.invoice_data.number);
    // console.log(invoice.invoice_data.tax_summary);
    // console.log("Invoice Body to be added", invoice);

    invoice.save(function (err, doc) {
      if (err) {
        console.log('Error  in Creating invoice', err)
        var error = getErrorMessgae(err)
        res.status(200).json({
          message: error,
          data: null,
          success: false,
        })
      } else {
        user
          .findOneAndUpdate(
            { _id: req.doc._id },
            { $inc: { 'user_settings.user_invoice_number': 1 } }
          )
          .exec(function (err, db_res) {
            if (err) {
              var error = getErrorMessgae(err)
              res.status(200).json({
                message: error,
                data: null,
                success: false,
              })
            } else {
              // console.log(db_res);
              // console.log("invoice Added Successfully")
              saleChart(
                invoice.invoice_data.date,
                invoice.invoice_data.grand_total,
                chartSalesData
              )
              updateAccounts(
                invoice,
                accounts,
                clients,
                invoiceData.invoice_data.advancePayment,
                invoiceSchema
              )

              res.status(200).json({
                message: 'invoice Added Successfully',
                data: doc,
                success: true,
              })
            }
          })
      }
    })
  })
}

module.exports = {
  createInvoice,
  updateInvoice,
  getInvoiceDetail,
  cancelInvoice,
  getInvoiceWithSearchAndPaging,
}
