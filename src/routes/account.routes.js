const express = require('express')
const userMiddleware = require('../middleware/auth.middleware') // userMiddleware
const accountController = require('../controllers/account.controller') // accountController

const router = express.Router()

// create user new account api
router.post('/', userMiddleware.authMiddleware, accountController.createAccountController)

// get find all Account user login
router.get('/', userMiddleware.authMiddleware, accountController.getUserAccoutnController)

// get Account balance
router.get('/balance/:accountId', userMiddleware.authMiddleware, accountController.getAccountBalanceController)


module.exports = router