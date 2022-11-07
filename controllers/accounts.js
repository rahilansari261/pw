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
const getFindAndSortOptionsAccoToParams = async (
  client_id,
  searchString,
  start_date,
  end_date
) => {
  let findAndSortOptions = {}
  let startDate
  let endDate
  if (start_date != 'no-start-date' && end_date != 'no-end-date') {
    startDate = new Date(start_date)
    endDate = new Date(end_date)
    startDate.setHours(0, 0, 0, 0)
    endDate.setHours(23, 59, 59, 999)
  }
  // 1-> getting accounts with date filter and paging
  if (
    client_id === 'no-id' &&
    searchString === 'no-search' &&
    start_date != 'no-start-date' &&
    end_date != 'no-end-date'
  ) {
    findAndSortOptions.findOptions = {
      entry_date: {
        $gte: startDate,
        $lt: endDate,
      },
    }
    findAndSortOptions.sortOptions = {
      _id: -1,
    }
  }
  // 2-> getting accounts of a client(client_id) and with search string and paging
  else if (
    start_date === 'no-start-date' &&
    end_date === 'no-end-date' &&
    client_id != 'no-id' &&
    searchString != 'no-search'
  ) {
    findAndSortOptions.findOptions = {
      $and: [
        { entry_remarks: new RegExp(req.params.searchString, 'i') },
        { client_id: id },
      ],
    }
    findAndSortOptions.sortOptions = { entry_date: -1 }
  }
  // 3-> getting accounts of a client(client_id) and paging
  else if (
    start_date === 'no-start-date' &&
    end_date === 'no-end-date' &&
    client_id != 'no-id'
  ) {
    findAndSortOptions.findOptions = { client_id: id }
    findAndSortOptions.sortOptions = { entry_date: -1 }
  }
  // 4-> getting accounts of a client(client_id) with date filter and paging  (TYPICAL)
  // else if (
  //   start_date != 'no-start-date' &&
  //   end_date != 'no-end-date' &&
  //   client_id != 'no-id' &&
  //   searchString === 'no-search'
  // ) {
  //   findAndSortOptions.findOptions = {
  //     $and: [
  //       { entry_date: { $gte: startDate, $lt: endDate } },
  //       { client_id: id },
  //     ],
  //   }
  //   findAndSortOptions.sortOptions = { entry_date: -1 }
  // }

  // 5-> getting accounts with search filter and paging
  else if (
    start_date === 'no-start-date' &&
    end_date === 'no-end-date' &&
    client_id === 'no-id' &&
    searchString != 'no-search'
  ) {
    findAndSortOptions.findOptions = {
      $and: [
        {
          $or: [
            {
              account_name: new RegExp(req.params.searchStr, 'i'),
            },
            {
              account_company: new RegExp(req.params.searchStr, 'i'),
            },
          ],
        },
      ],
    }
    findAndSortOptions.sortOptions = { entry_date: -1 }
  }

  // 6-> getting accounts of a client(client_id) with search and date filter and paging
  else if (
    start_date != 'no-start-date' &&
    end_date != 'no-end-date' &&
    client_id != 'no-id' &&
    searchString != 'no-search'
  ) {
    findAndSortOptions.findOptions = {
      $and: [
        {
          $or: [{ entry_remarks: new RegExp(req.params.searchString, 'i') }],
        },
        { entry_date: { $gte: startDate, $lte: endDate } },
        { client_id: id },
      ],
    }
    findAndSortOptions.sortOptions = { entry_date: -1 }
  }
  return findAndSortOptions
}
const getAccountDetails = async (req, res) => {
  // prettier-ignore
  let { client_id, searchString, page, perPage, start_date, end_date } = req.params
  // prettier-ignore
  if (isNaN(page) || isNaN(perPage)) return res.status(200).json({message: 'Pagin Error',data: null,success: false,})
  page = parseInt(page)
  perPage = parseInt(perPage)
  const startingPageForSort = (page - 1) * perPage
  // prettier-ignore
  const Account = mongoose.model(`${req.doc._id}-accounts`, require('../models/Account' ) )
  // prettier-ignore
  const { findOptions, sortOptions } = await getFindAndSortOptionsAccoToParams(client_id,searchString,start_date,end_date)
  // prettier-ignore
  const query =  Account.find(findOptions).sort(sortOptions).skip(startingPageForSort).limit(perPage)
  const docs = await query.exec()
  // prettier-ignore
  if(!docs) return res.status(200).json({message: 'Something went wrong',count: null,data: null,success: false,})
  // prettier-ignore
  res.status(200).json({message: 'Accounts after search',count: docs.length,data: docs,success: true,})
}

module.exports = {
  createAccount,
  getAccountDetails,
}
