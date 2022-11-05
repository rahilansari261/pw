const Account = require('../models/Account')
const passwordHash = require('password-hash')
require('dotenv').config()
const jwt = require('jsonwebtoken')
// const asyncWrapper = require('../middleware/async')
// const { createCustomError } = require('../errors/custom-error')
const updateInvoices = async (accountData, Invoice) => {
  for (const i = 0; i < accountData.invoice_list.length; i++) {
    await Invoice.updateOne(
      { _id: accountData.invoice_list[i]._id },
      {
        $inc: {
          'invoice_data.balance': accountData.invoice_list[i].amount * -1,
        },
        $push: {
          'invoice_data.paymentHistory': {
            dated: new Date(),
            amount: accountData.invoice_list[i].amount,
            remark: accountData.entry_transaction_number,
          },
        },
      }
    )
  }
}

const createAccount = async (req, res) => {
  const accountData = req.body.accountData
  // prettier-ignore
  if (!accountData) return res.status(200).json({ message: ' Data Not Found', data: null, success: false })
  // prettier-ignore
  const Account = mongoose.model(`${req.doc._id}-accounts`,require('../models/Account'))
  // prettier-ignore
  const Client = mongoose.model(`${req.doc._id}-clients`,require('../models/Client'))
  // prettier-ignore
  const Invoice = mongoose.model(`${req.doc._id}-invoices`,require('../models/Invoice'))
  try {
    const newAccount = {
      client_id: accountData.client_id,
      client_name: accountData.client_name,
      client_company: accountData.client_company,
      entry_date: new Date(accountData.entry_date),
      entry_remarks: accountData.entry_remarks,
      entry_transaction_number: accountData.entry_transaction_number,
      entry_type: accountData.entry_type,
      entry_amount_in: accountData.entry_amount_in,
      entry_amount_out: accountData.entry_amount_out,
      // "entry_balance": accountData.entry_balance
    }
    const doc = await Account.create(newAccount)
    if (!doc)
      return res
        .status(200)
        .json({ message: error, data: null, success: false })
    else {
      // prettier-ignore
      await Client.updateOne({ _id: accountData.client_id },{ $inc: { client_balance: accountData.entry_amount_in * -1 } })
    }
    if (accountData.entry_amount_in > 0)
      await updateInvoices(accountData, Invoice)
    // prettier-ignore
    return res.status(200).json({message: 'Account Update Successfully',data: doc,success: true})
  } catch (error) {
    // prettier-ignore
    res.status(200).json({message: error,success: false,})
  }
}

const loginAccount = async (req, res) => {}
const forgotAccount = async (req, res) => {}
const verifyAccount = async (req, res) => {}
const resetAccount = async (req, res) => {}
const updateAccount = async (req, res) => {}
const passwordChangeAccount = async (req, res) => {}
const addtaxAccount = async (req, res) => {}
const removetaxAccount = async (req, res) => {}
module.exports = {
  createAccount,
  loginAccount,
  forgotAccount,
  verifyAccount,
  resetAccount,
  updateAccount,
  passwordChangeAccount,
  addtaxAccount,
  removetaxAccount,
}
