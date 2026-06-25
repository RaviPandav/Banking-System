const {Router} = require('express') // express
const authMiddleware = require('../middleware/auth.middleware'); // aouthMiddelware
const transactionController = require('../controllers/transaction.controller') // controller tra

const transactionRouter = Router()

// create transaction Api
transactionRouter.post('/', authMiddleware.authMiddleware, transactionController.createTransaction)

// create system api
transactionRouter.post('/system/initial-funds', authMiddleware.authSystemUserMiddleware, transactionController.createInitialFundsTransaction)

module.exports = transactionRouter