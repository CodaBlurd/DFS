const mongoose = require('mongoose')

const connectionUrl = process.env.MONGO_CONNECTION_STRING

mongoose.connect(connectionUrl)

if(connectionUrl){
    console.log(`Up and running mongodb server`)
} else {
    console.log('Connection problems')
}


