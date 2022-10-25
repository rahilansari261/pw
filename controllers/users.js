const User = require('../models/User')
const passwordHash = require('password-hash')
var jwt = require('jsonwebtoken')
require('dotenv').config()
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
    res.status(500).json({ msg: error })
  }
}

const loginUser = async (req, res) => {
  try {
    const docs = await User.findOne({ user_email: req.body.user_email })
    if (!docs) {
      return res.json({
        success: false,
        message: 'Sorry, Email is not registered',
      })
    } else {
      if (!docs.user_subscriptionStatus) {
        return res.json({
          success: false,
          message: 'Authentication failed. Account Disabled',
        })
      }
      // user subscritionStatus is still valid
      if (!docs.user_verification) {
        return
        res.json({
          success: false,
          message: 'Authentication failed. Account not yet verified',
        })
      }
      // user have verified email account
      if (!passwordHash.verify(req.body.user_password, docs.user_password)) {
        return
        res.json({
          success: false,
          message: 'Authentication failed. Wrong Password',
        })
      } else {
        const now = new Date()
        const payLoad = {
          _id: docs._id,
          email: docs.user_email,
          name: docs.user_name,
          compnay_name: docs.user_company_name,
          subscription: docs.user_subscriptionEndDate,
          create_time: now,
        }

        if (docs.user_subscriptionEndDate >= now) {
          // lastLogin
          const conditions = { _id: docs._id },
            update = { $set: { lastLogin: new Date() } },
            options = { multi: false }
          await User.updateOne(conditions, update, options)

          const token = jwt.sign(payLoad, process.env.SECRET, {
            expiresIn: '12h', // expires in 12 hours
          })
          docs.user_password = 'YOU ARE LOOKING AT THE WRONG PLACE'
          // req.brute.reset(function () {}) // login Successful
          res.json({
            success: true,
            message: 'Login Successful',
            token: token,
            data: docs,
          })
        } else {
          const token = jwt.sign(payLoad, process.env.SECRET, {
            expiresIn: '5m', // expires in 12 hours
          })
          res.json({
            success: false,
            message: 'Subscription expired.',
            code: 132,
            token: token,
          })
        }
      }
    }
  } catch (error) {
    res.status(500).json({ msg: error })
  }
}
const forgotUser = async (req, res) => {}
const verifyUser = async (req, res) => {}
const resetUser = async (req, res) => {}
const updateUser = async (req, res) => {}
const passwordchangeUser = async (req, res) => {
  const passwordData = req.body.passwordData
  if (!passwordData) {
    // prettier-ignore
    return res.status(200).json(getFailureResponse('User Data is missing', false))
  }
  if (passwordData.newPassword != passwordData.newPassword2) {
    // prettier-ignore
    return res.json({ success: false, message: 'Password do not match', })
  }
  try {
    const data = await User.findOne({ _id: req.doc._id })
    if (!passwordHash.verify(passwordData.oldPassword, data.user_password)) {
      // prettier-ignore
      return res.json({ success: false, message: 'Wrong  Old Password' })
    } else {
      data.user_password = passwordHash.generate(passwordData.newPassword)
      data.save()
      // prettier-ignore
      res.status(200).json({message: 'Password Has Change, Use your new password to login',success: true,})
    }
  } catch (error) {
    // prettier-ignore
    res.status(500).json({ msg: error })
  }
}
const addtaxUser = async (req, res) => {}
const removetaxUser = async (req, res) => {}
module.exports = {
  createUser,
  loginUser,
  forgotUser,
  verifyUser,
  resetUser,
  updateUser,
  passwordchangeUser,
  addtaxUser,
  removetaxUser,
}
