const User = require('../models/User')
const passwordHash = require('password-hash')
// const asyncWrapper = require('../middleware/async')
// const { createCustomError } = require('../errors/custom-error')

const createUser = async (req, res) => {
  try {
    const hashedPassword = passwordHash.generate(req.body.user_password)
    const myDate = new Date()
    myDate.setDate(myDate.getDate() + 14)

    const newUser = {
      _id: require('mongoose').Types.ObjectId(),
      user_company_name: req.body.user_company_name,
      user_name: req.body.user_name,
      user_tin: '',
      user_stn: '',
      user_address: '',
      user_phone: '',
      user_password: hashedPassword,
      user_email: req.body.user_email,
      user_lastModified: new Date(),
      user_subscriptionStatus: true,
      user_verification: false,
      user_subscriptionEndDate: myDate,
      user_settings: {
        user_logo: req.body.user_logo || 'default.jpg',
        user_template: req.body.user_template || 'default.html',
        user_tc: req.body.user_tc || '',
        user_tax: [
          {
            _id: require('mongoose').Types.ObjectId(),
            type: 'VAT',
            rate: 14.5,
          },
          {
            _id: require('mongoose').Types.ObjectId(),
            type: 'VAT',
            rate: 5.5,
          },
          {
            _id: require('mongoose').Types.ObjectId(),
            type: 'CST',
            rate: 2,
          },
          {
            _id: require('mongoose').Types.ObjectId(),
            type: 'No Tax',
            rate: 0,
          },
        ],
      },
      user_account: [
        {
          entry_remarks: '',
          entry_amount: 0,
        },
      ],
    }
    console.log('hello')
    const doc = await User.create(newUser)
    res.status(200).json({ doc })
  } catch (error) {
    console.log(error)
    res.status(500).json({ msg: error })
  }
}

module.exports = {
  createUser,
}
