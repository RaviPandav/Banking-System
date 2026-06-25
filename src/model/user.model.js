const mongoose = require('mongoose')
const bcryp = require('bcryptjs')

// create User Schema (structur)
const userShema = new mongoose.Schema({
  email:{
    type:String,
    required:[true, 'email is requird for creating a user'],
    trim:true,
    Lowercase:true,
    // email (regex)
    match:[/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/, 'Invslide email address'],
    unique:true
  },

  name:{
    type:String,
    required:[true, 'Name is requied']
  },

  password:{
    type:String,
    required:[true,'password is requied'],
    minlength:[6,'password should more then 6 cherectur'],
    select:false
  },
  // create system User  
  systemUser:{
    type:Boolean,
    default: false,
    immutable: true,
    select:false
  }
},{
  timestamps:true
})

// save data
userShema.pre('save', async function () {

  // password modifiy chak
  if(!this.isModified('password')){
    return
  }

  // modify thayo hash password
  const hash = await bcryp.hash(this.password, 10)
  this.password = hash;
  return 
})

// create method compare Password
  userShema.methods.comparePassword = async function (password) {
    return await bcryp.compare(password, this.password)
  }


// create userModel
const userModel = mongoose.model('user', userShema)

module.exports = userModel


