const Account = require('../models/Account')
const passwordHash = require('password-hash')
require('dotenv').config()
var jwt = require('jsonwebtoken')
// const asyncWrapper = require('../middleware/async')
// const { createCustomError } = require('../errors/custom-error')

const createAccount = async (req, res) => {}

const loginAccount = async (req, res) => {}
const forgotAccount = async (req, res) => {}
const verifyAccount = async (req, res) => {}
const resetAccount = async (req, res) => {}
const updateAccount = async (req, res) => {}
const passwordchangeAccount = async (req, res) => {}
const addtaxAccount = async (req, res) => {}
const removetaxAccount = async (req, res) => {}
module.exports = {
  createAccount,
  loginAccount,
  forgotAccount,
  verifyAccount,
  resetAccount,
  updateAccount,
  passwordchangeAccount,
  addtaxAccount,
  removetaxAccount,
}
