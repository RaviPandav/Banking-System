const transactionModel = require('../model/transaction.model')
const ledgerModel = require('../model/ledger.model')
const accountModel = require('../model/account.model')
const emailService = require('../services/email.service')
const mongoose = require('mongoose')
const services = require('../services/email.service')
const userModel = require('../model/user.model')
const { promises } = require('nodemailer/lib/xoauth2')

/** 
 * ==== create a new transaction 
 * 1. validate request
 * 2. validate idempotencyKey
 * 3. chack accountsatatus
 * 4. Derive sener balance from ledger
 * 5. create transaction (PENDING)
 * 6. create DEBIT ledger entry
 * 7. create CREDIT ledger entry
 * 8. Make tarnsaction COMPLETED 
 * 9. commit mongoDB session
 * 10. send email notifiction
*/

//1. validate request

// create to create Transaction
const createTransaction = async (req,res) => {

  // data
  const {fromAcoount, toAccount, amount, idempotencyKey} = req.body

  // chack user transaction method
  if(!fromAcoount || !toAccount || !amount || !idempotencyKey){
    return res.status(400).json({
      message:'FromAccoutn, toAccount, Amount, idempotencyKey are required'
    })
  }

  // chack axist (che ke nai ) fromAccount or toAccount
  const fromUserAccount = await accountModel.findOne({
    _id:fromAcoount, 
  })

  const toUserAccount = await accountModel.findOne({
    _id:toAccount,
  })

  if(!fromUserAccount || !toUserAccount){
    return res.status(400).json({
      message:'Invalide user fromAccount and toAccount'
    })
  }


  // 2.validate idempotencyKey (transaction)
  
  // chack axist transaction (check transaction)
  const isTransactionAlradyExists = await transactionModel.findOne({
    idempotencyKey:idempotencyKey
  })
  if(isTransactionAlradyExists){
    if(isTransactionAlradyExists.status === 'COMPLETED'){
      return res.status(200).json({
        message:'Transaction is Alra  dy completed',
        transaction:isTransactionAlradyExists
      })
    }

    if(isTransactionAlradyExists.status === 'PANDING'){
      return res.status(200).json({
        message:'Transaction is painding'
      })
    }

    if(isTransactionAlradyExists.status === 'FAILD'){
      return res.status(500).json({
        message:'Transaction is Faild'
      })
    }

    if(isTransactionAlradyExists.status === 'REVERSED'){
      return res.status(200).json({
        message:'Transaction is revesed , please teray '
      })
    }
  }

  //3. chack account satatus

  // chacke Accoutn satatus (Active chhe ke nai)
  if(fromUserAccount.status !== 'ACTIVE' || toUserAccount.status !== 'ACTIVE'){
    return res.status(400).json({
      message:'from user Account and To user Account not be Active'
    })
  }
  // get current balance
  const balance = await fromUserAccount.getBalance();
  // chack balance 
  if(balance < amount){
    return res.status(400).json({
      message:`Insufficient balance. Current balace is ${balance}. Requested amount is ${amount}`
    })
  }

  let transaction

  try {
    
  
  // 5. create transaction (PENDING)

  // create session Staer Transaction ( required mongooes)

  const session = await mongoose.startSession()
  session.startTransaction()

  // create transaction  (6)
  transaction = (await transactionModel.create([{
    fromAcoount,
    toAccount,
    amount,
    idempotencyKey,
    status:'PANDING'
  }], {session})) [ 0 ]
  
  // create debit Transaction Entry (ledger entry) (7)
  const debitTransactionEntry = await ledgerModel.create([{
    account:fromAcoount,
    amount: amount,
    transaction: transaction._id,
    type:'DEBIT',
  }],{session})

  // time
  await(()=> {
    return new Promise((resolve)=> setTimeout(resolve, 15 * 1000));
  })()

  // create credit Transaction Entry (ledger Entry) (8)
  const creditTransactionEntry = await ledgerModel.create([{
    account:toAccount,
    amount: amount,
    transaction: transaction._id,
    type:'CREDIT'
  }], {session})

  // update transaxction (COMPLETEd)
  await transactionModel.findByIdAndUpdate(
    {_id: transaction._id},
    {status:'COMPLETED'},
    {session}
  )

  // session end
  await session.commitTransaction()
  session.endSession()

  } catch (error) {
    return res.status(400).json({
      message:'Transaction is Pending due to some issue, please retry after somtime'
    })
  }


  // 10. send email Transaction
  await services.sendTransactionEamil(req.user.email, req.user.name, amount , toAccount)

  return res.status(201).json({
    message:'Transaction is Completed successfully'
  })
}

// create initialFundsTransaction
const createInitialFundsTransaction  = async (req,res) =>{
  
  const {toAccount , amount, idempotencyKey} = req.body 

  // check Account , amount, idempotencyKey
  if(!toAccount || !amount || !idempotencyKey){
    return res.status(400).json({
      message:'toAccount, amount and idempotencyKey are required'
    })
  }

  // chack user axist toAccoutn
  const toUserAccount = await accountModel.findOne({
    _id:toAccount,
  })
  if(!toUserAccount){
    return res.status(400).json({
      message:'Invalide toAccount'
    })
  }

  // chack axist fromAccount
  const fromUserAccount = await accountModel.findOne({
    user: req.user._id
  })

  if(!fromUserAccount){
    return res.status(400).json({
      message:'System user Account Not Found'
    })
  }

  // start session
  const session = await mongoose.startSession()
  session.startTransaction()

  // create transaction
  const transaction = new transactionModel({
  fromAcoount: fromUserAccount._id,
  toAccount,
  amount,
  idempotencyKey,
  status:'PANDING'
})

// create debit  ledger entry
await ledgerModel.create([{
  account: fromUserAccount._id,
  amount,
  transaction: transaction._id,
  type:'DEBIT'
}], { session })

// create credit
await ledgerModel.create([{
  account: toAccount,
  amount,
  transaction: transaction._id,
  type:'CREDIT'
}], { session })

// save
transaction.status = 'COMPLETED'
await transaction.save({ session })

// commit
await session.commitTransaction()

  // commit Transaction (endSession)
  await session.commitTransaction()
  session.endSession()

  return res.status(201).json({
    message:'Transaction completed.',
    transaction: transaction
  })
}  

module.exports = {createTransaction, createInitialFundsTransaction}