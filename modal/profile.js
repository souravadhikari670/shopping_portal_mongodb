const mongoose = require('mongoose')
const Schema = mongoose.Schema

const ProfileSchema = new Schema({
    fullname:{
        type:String
    },
    mobileno: {
        type: Number
    },
    email:{
        type: String
    },
    address: {
        type: String
    },
    postalcode: {
        type:Number
    },
    password: {
        type: String
    }
})

const thisSchema = mongoose.model('Profile',ProfileSchema)
module.exports = thisSchema