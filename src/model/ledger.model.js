const mongoose = require('mongoose')

// create ledger Shema Strucutr
const ledgerSchema = new mongoose.Schema({

  // kaya account ma entry thai che
  account:{
    type: mongoose.Schema.Types.ObjectId,
    ref:'account',
    required:[true, 'Ledger must be association with an account'],
    index:true,
    immutable:true,
  },

   // ketli amount credit/debit thai
  amount:{
    type:Number,
    required:[true, 'Amount is Requied'],
    immutable:true,
  },

  // kai transaction thi aa entry create thai
  transaction:{
    type:mongoose.Schema.Types.ObjectId,
    ref:'transaction',
    required:[true, 'Transaction is required'],
    index:true,
    immutable:true,
  },

   // credit che ke debit
  type:{
    type:String,
    enum:{
      values:["CREDIT", "DEBIT"],
      message:'Type is CREDIT or DEBIT', 
    },
    required:[true],
    immutable:true,
  }

})

// no modifiction antry (badlai nai sake)
const priventLedgerModifiction = () => {
  throw new Error('Ledger entries are immutable and cannot be midified or deleted')
}

ledgerSchema.pre('updateOne', priventLedgerModifiction);
ledgerSchema.pre('deleteOne', priventLedgerModifiction);
ledgerSchema.pre('remove', priventLedgerModifiction);
ledgerSchema.pre('deleteMany', priventLedgerModifiction);
ledgerSchema.pre('updateMany', priventLedgerModifiction);
ledgerSchema.pre('findOneAndUpdate', priventLedgerModifiction);
ledgerSchema.pre('findOneAndDelete', priventLedgerModifiction);
ledgerSchema.pre('findOneAndReplace', priventLedgerModifiction);

const ledgerModel = mongoose.model('ledger', ledgerSchema)

module.exports = ledgerModel