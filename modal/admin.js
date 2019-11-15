const mongoose = require('mongoose')
const Schema = mongoose.Schema

const mySchema = new Schema({

    fullname:{
        type: String
    },
    username:{
        type:String
    },
    email:{
        type: String
    },
    password:{
        type: String
    },
    date:{
        type: Date,
        default: Date.now()
    },
    profilepic:{
        type: String,
        default:'https://cdn.pixabay.com/photo/2013/07/13/10/07/man-156584_1280.png'
    }

})

const thisSchema = mongoose.model('Admin', mySchema)
module.exports = thisSchema