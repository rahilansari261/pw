const mongoose = require('mongoose')
const Schema = mongoose.Schema

const ReloginSchema = new mongoose.Schema({
  _id: Schema.Types.ObjectId,
  timestamp: Date,
})
module.exports = mongoose.model('Relogin', 'ReloginSchema')
