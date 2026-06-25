const userModel = require('../model/user.model') // usermodel
const jwt = require('jsonwebtoken') // jwt
const emailService = require('../services/email.service')
const tokenBlackListModel = require('../model/blackList.model')

//create user Register controler
const userRegisterController = async (req,res) => {

  //data
  const {email, password, name} = req.body

  // chack user Exist 
  const isExist = await userModel.findOne({
    email:email 
  })
  if(isExist){
    return res.status(422).json({
      message:'email alarady Axist is Email',
      status:"faild"
    })
  }

  // create user
  const user = await userModel.create({
    email, password, name
  })

  // create jwt (jsonwebtoen) (npm i jsonwebtoken)
  const token = jwt.sign({userId:user._id}, process.env.JWT_SECRET)

  // save token cookie
  res.cookie('token', token)

  // res data register user
  res.status(201).json({
    user:{
      _id:user._id,
      email:user.email,
      name:user.name
    },
    token
  })

  // send email 
  await emailService.sendRegistrationEmail(user.email, user.name)

}

// create user Login controller
const userLoginController = async (req,res) => {

  // data
  const {email, password} = req.body

  // chcak user email 
  // check user email
const user = await userModel.findOne({
  email
}).select('+password');

if (!user) {
  return res.status(401).json({
    message: "Invalid email"
  });
}

// compare password
const isValidPassword = await user.comparePassword(password);

if (!isValidPassword) {
  return res.status(401).json({
    message: "Invalid password"
  });
}
  // create token
  const token = jwt.sign({userId:user._id}, process.env.JWT_SECRET)

  // save token cookid
  res.cookie('token', token)

  // res data
  res.status(200).json({
    user:{
      _id:user._id,
      email:user.email,
      name:user.name
    },
    token
  })
}

// create user Logout controller
const userLogoutController = async (req,res) => {

  // token 
  const token  = req.cookies.token || req.headers.authorization?.split(" ")[1]

  // chack token (chhe ke nai)
  if(!token){
    return res.status(200).json({
      message:'Token is not Found'
    })
  }

  await tokenBlackListModel.create({
    token:token
  })

  // clear cookie
  res.clearCookie('token')

  res.status(200).json({
    message:'User Logout successfully'
  })

}


module.exports = {userRegisterController,userLoginController,userLogoutController }