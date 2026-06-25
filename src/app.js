const express = require('express')
const cookieParser = require('cookie-parser')

// routes requird
const authRouter = require('./routes/auth.routes') // outhroutes
const accountRouter = require('../src/routes/account.routes') // account 
const transactionRouter = require('./routes/transaction.routes')


const app = express()

//middel ware
app.use(express.json())
app.use(cookieParser())

// demo api test
app.get('/', (req,res)=> {
  res.send('Ledger Service is up and running')
})

// (register api)
app.use('/api/auth', authRouter)

// user account api
app.use('/api/account', accountRouter)

// transaction Api
app.use('/api/transaction', transactionRouter)



module.exports = app