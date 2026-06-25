const express = require('express')
const authController = require('../controllers/auth.controller') // controller


const router = express.Router()

// create register Api
router.post('/register', authController.userRegisterController)

// create login api
router.post('/login', authController.userLoginController)

// create Logout api
router.post('/logout', authController.userLogoutController)


module.exports = router