const mongoose = require('mongoose')
const ledgerModel = require('../model/ledger.model')

// creat user account Schema
const accountSchema = new mongoose.Schema({

  // account kaya user nu chhe teno refrenc
  user:{
    type:mongoose.Schema.Types.ObjectId,
    ref:'user',
    required:[true, 'Account must be associated with a user'],
    index:true // serching
  },
  // account corent status
  status:{
    type:String,
    enum:{
      values:['ACTIVE', 'FROZEN', 'CLOSED'],
      message:'Status can be either ACTIVE, FROZEN, CLOSED',
    },
    default:'ACTIVE'
  },
    currency:{
      type:String,
      required:[true, "currency is requied for creating an account"],
      default:'INR'
    },

},{
  timestamps:true
})

// create compaund index
accountSchema.index({user: 1, status: 1})

// create method get balance (balance calculat kareva mate ) (using ledger Model)
accountSchema.methods.getBalance = async function(){

  const ledgers = await ledgerModel.find({
    account: this._id
  });

  // balance data calculation
  const balanceData = await ledgerModel.aggregate([
    { $match: { account: this._id } },
    {
      $group: {
        _id: null,
        totalDebit: {
          $sum: {
            $cond: [
              { $eq: ['$type', 'DEBIT'] },
              '$amount',
              0
            ]
          }
        },
        totalCredit: {
          $sum: {
            $cond: [
              { $eq: ['$type', 'CREDIT'] },
              '$amount',
              0
            ]
          }
        }
      }
    },
    {
      $project: {
        _id: 0,
        balance: {
          $subtract: ['$totalCredit', '$totalDebit']
        }
      }
    }
  ]);


  if(balanceData.length === 0){
    return 0;
  }

  return balanceData[0].balance;
}
// create acount Model
const accountModel = mongoose.model('account', accountSchema)

module.exports = accountModel