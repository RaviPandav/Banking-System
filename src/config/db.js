const mongoose = require('mongoose')

// connect database
const connectToDB = () => {

  mongoose.connect(process.env.MONGO_URI)

  .then(()=>{
    console.log('server is connectToDB');
  })
  .catch(err=> {
    console.log('error connection to DB');
    process.exit(1) // server stop
  
  })
}

module.exports = connectToDB