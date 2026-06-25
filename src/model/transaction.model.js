const mongoose = require('mongoose')

// create transaction Shema (structur)
const transactionShema = new mongoose.Schema({

  // Paisa kaya account mathi gaya te store karse
  fromAcoount:{
    type:mongoose.Schema.Types.ObjectId,
    ref:'account',
    required:[true,'Transaction must be associated with a from account'],
    index:true
  },
  //Paisa kaya account ma gaya te store karse
  toAccount:{
    type:mongoose.Schema.Types.ObjectId,
    ref:'account',
    required:[true, 'Tranction must be associated with a to account'],
    index:true,
  },
  // Transaction ni current status (panding , complet , faild , reversed)
  status:{
    type:String,
    enum:{
      values:['COMPLETED','PANDING', 'FAILD', 'REVERSED'],
      message:'Status can be either PENDING, COMPLETED, FAILED, REVESED',
    },
    default:'PANDING'
  },
  // Ketla paisa transfer thaya
  amount:{
    type:Number,
    required:[true, 'Amountfor redied tranction '],
    min:[0, 'Transaction amount cannot be negative']
  },
  
  // Same transaction be vaar execute na thay tena mate
  idempotencyKey:{
    type:String,
    require:[true, 'Identpotency key is requied to transaction'],
    unique:true
  }
},{
  timestamps:true
})

// create tramctionMOdel
const transactionModel = mongoose.model('transaction', transactionShema)

module.exports = transactionModel