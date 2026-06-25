const mongoose = require('mongoose')

// create Schema Structur Logint Api
const tokenBlackListSchema = mongoose.Schema({
  token:{
    type:String,
    required: [true, 'Token is required to black list '],
    unique: [true, 'Token is already blacklisted ']
  }
},{
  timestamps:true
})

// token black list (3 day) expair token day
tokenBlackListSchema.index({createAt: 1}, {
  expireAfterSeconds: 60 * 60 * 24 * 3 // 3 day
})



// create model
const tokenBlackListModel = mongoose.model('tokenBlackList', tokenBlackListSchema)

module.exports = tokenBlackListModel
