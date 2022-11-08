const Product = require('../models/Product')
const passwordHash = require('password-hash')
require('dotenv').config()
const jwt = require('jsonwebtoken')
// const asyncWrapper = require('../middleware/async')
// const { createCustomError } = require('../errors/custom-error')

// <!-- sorting condition will be added later -->

const createClient = async (req, res) => {}

const updateClient = async (req, res) => {}

const getClientDetail = async (req, res) => {}

const removeClient = async (req, res) => {}

const getClientWithSearchAndPaging = async (req, res) => {}

const createClientAccounts = async (req, res) => {}
module.exports = {
  createClient,
  updateClient,
  getClientDetail,
  removeClient,
  getClientWithSearchAndPaging,
  createClientAccounts,
}
