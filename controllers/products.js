const Product = require('../models/Product')
const passwordHash = require('password-hash')
require('dotenv').config()
const jwt = require('jsonwebtoken')
// const asyncWrapper = require('../middleware/async')
// const { createCustomError } = require('../errors/custom-error')

const createProduct = async (req, res) => {
  try {
    const productData = req.body.productData
    // prettier-ignore
    if (!productData) return res.status(200).json({message: 'Product Data Not Found',data: null,success: false,})
    // prettier-ignore
    const Product = mongoose.model(`${req.doc._id}-products`, require('../models/Product'))

    const newProduct = {
      product_name: productData.product_name,
      product_code: productData.product_code,
      product_description: productData.product_description,
      product_status: true,
      product_price: parseFloat(productData.product_price).toFixed(2),
      product_tax: productData.product_tax,
      product_unit: productData.product_unit || 'Nos',
    }

    const doc = await Product.create(newProduct)
    // prettier-ignore
    if (!doc) return res.status(200).json({ message: error, data: null, success: false })
    // prettier-ignore
    res.status(200).json({ message: 'Product Added Successfully', data: doc, success: true })
  } catch (error) {
    // prettier-ignore
    res.status(200).json({message: error,success: false,})
  }
}

const updateProduct = async (req, res) => {
  try {
    const productData = req.body.productData
    // prettier-ignore
    if (!productData) return res.status(200).json({message: 'Product Data Not Found',data: null,success: false,})
    // prettier-ignore
    const Product = mongoose.model(`${req.doc._id}-products`, require('../models/Product'))
    const doc = await Product.findOne({ _id: productData._id })
    // prettier-ignore
    if (!doc) return res.status(200).json({message: 'Product Data Not Found',data: null,success: false,})

    else {
     doc.product_name = productData.product_name,
     doc.product_code = productData.product_code,
     doc.product_description = productData.product_description,
     doc.product_price = parseFloat(productData.product_price).toFixed(2),
     doc.product_unit = productData.product_unit,
     doc.product_tax = productData.product_tax

    await doc.save()
    // prettier-ignore
    res.status(200).json({ message: 'Product Updated Successfully', data: doc, success: true })
   }
  } catch (error) {
    // prettier-ignore
    res.status(200).json({message: error,success: false})
  }
}

const removeProduct = async (req, res) => {
  try {
    const productData = req.body.productData
    // prettier-ignore
    if (!productData) return res.status(200).json({message: 'Product Data Not Found',data: null,success: false,})
    // prettier-ignore
    const Product = mongoose.model(`${req.doc._id}-products`, require('../models/Product'))
    // prettier-ignore
    const doc = await Product.findOneAndUpdate({ _id: req.params.id },{ product_status: false })
    // prettier-ignore
    if (!doc) return res.status(200).json({ message: error, data: null, success: false })
    // prettier-ignore
    res.status(200).json({ message: 'Product Deleted Successfully', data: doc, success: true })
  } catch (error) {
    // prettier-ignore
    res.status(200).json({message: error,success: false,})
  }
}
module.exports = {
  createProduct,
  updateProduct,
  removeProduct,
}
