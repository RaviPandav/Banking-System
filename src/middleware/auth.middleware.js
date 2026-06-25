// chack token (mate use)
const userModel = require('../model/user.model') // userModel
const jwt = require('jsonwebtoken') // jsonwebtoken
const tokenBlackListModel = require('../model/blackList.model') // tokenblacklist model

// create auth Middleware 
const authMiddleware = async (req,res,next)=> {

  // chack token cookies (user login chhe ke nai)
  const token = req.cookies.token || req.headers.authorization?.split(" ")[1]

  if(!token){
    return res.status(401).json({
      message:"user is not login"
    })
  }

  // chack black list token
  const isBlacklisted = await tokenBlackListModel.findOne({
    token
  })
  if(isBlacklisted){
    return res.status(401).json({
      message:'Token is Black listed'
    })
  }

  // varify token (true and false)

  try {

    const decoded = jwt.verify(token, process.env.JWT_SECRET)

    // save data user
    const user = await userModel.findById(decoded.userId)
    req.user = user
    next()
    
  } catch (err) {
    return res.status(401).json({
      message:'token is Invalid'
    })
    
  }
}

// create system auth Middleware
const authSystemUserMiddleware = async (req,res,next) => {

  // check token cookie
  const token = req.cookies.token || req.headers.authorization?.split(" ")[1]

  if(!token){
    return res.status(401).json({
      message:'token is missing'
    })
  }

  // chack black list token
  const isBlacklisted = await tokenBlackListModel.findOne({
    token
  })
  if(isBlacklisted){
    return res.status(200).json({
      message:'Token is Black Listed'
    })
  }

  // verify token (sacho chhe ke khoto)
  try {

    const decoded = jwt.verify(token, process.env.JWT_SECRET)

    //chack system user
    const user =  userModel.findById(decoded.userId).select('+systemUser')
    if(!user.systemUser){
      return res.status(403).json({
        message:'not a system user'
      })
    }
    req.user = user

    return next()
    
  } catch (err) {
    console.log(err);
    
    return res.status(401).json({
      message:'token is invalide'
    })
    
  }
}


module.exports = {authMiddleware, authSystemUserMiddleware }