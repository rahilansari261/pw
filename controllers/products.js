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
    const id = req.params.id
    // prettier-ignore
    if (!id) return res.status(200).json({message: 'Id not provided',data: null,success: false,})
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
const getProductDetail = async (req, res) => {
  try {
    const id = req.params.id
    // prettier-ignore
    if (!id) return res.status(200).json({message: 'Product id not provided',data: null,success: false,})
    // prettier-ignore
    const Product = mongoose.model(`${req.doc._id}-products`, require('../models/Product'))
    // prettier-ignore
    const doc = await Product.findById({ _id: id },{ product_status: false })
    // prettier-ignore
    if (!doc) return res.status(200).json({ message: error, data: null, success: false })
    // prettier-ignore
    res.status(200).json({ message: 'Product Information ', data: doc, success: true })
  } catch (error) {
    // prettier-ignore
    res.status(200).json({message: error,success: false,})
  }
}

const getProductWithSearchAndPaging = async (req, res) => {
  try {
    // prettier-ignore
    let {page, perPage } = req.params
    let findOptions = {}
    // prettier-ignore
    if (isNaN(page) || isNaN(perPage)) return res.status(200).json({message: 'Pagin Error',data: null,success: false,})
    page = parseInt(page)
    perPage = parseInt(perPage)
    const startingPageForSort = (page - 1) * perPage
    // prettier-ignore
    const Product = mongoose.model(`${req.doc._id}-products`, require('../models/Product' ) )
    if (req.params.searchStr) {
      const searchStr = req.params.searchStr
      findOptions = {
        $and: [
          {
            $or: [
              { product_name: new RegExp(searchStr, 'i') },
              { product_code: new RegExp(searchStr, 'i') },
              { product_description: new RegExp(searchStr, 'i') },
            ],
          },
          { product_status: true },
        ],
      }
    }
    // prettier-ignore
    const products = await Product.find(findOptions).exec()
    // prettier-ignore
    if(!products) return res.status(200).json({message: 'Something went wrong',count: null,data: null,success: false,})
    const totalProducts = products.length()
    // prettier-ignore
    const query =  Product.find(findOptions).skip(startingPageForSort).limit(perPage)
    const docs = await query.exec()
    // prettier-ignore
    if(!docs) return res.status(200).json({message: 'Something went wrong',count: null,data: null,success: false,})
    // prettier-ignore
    res.status(200).json({message: 'Products after search',count: totalProducts,data: docs,success: true,})
  } catch (error) {
    // prettier-ignore
    res.status(400).json({message: error,success: false})
  }
}
module.exports = {
  createProduct,
  updateProduct,
  removeProduct,
  getProductDetail,
  getProductWithSearchAndPaging,
}
