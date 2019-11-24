const mongoose = require('mongoose')
const Schema = mongoose.Schema

const mySchema = new Schema({

    email:{
        type: String,
        default:"admin@gmail.com"
    },
    password:{
        type: String,
        default:"admin"
    },
    name:{
        type: String,
        default:"admin"
    },

})

const thisSchema = mongoose.model('Admin', mySchema)
module.exports = thisSchema