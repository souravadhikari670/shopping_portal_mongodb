
const mongoose = require('mongoose')
const Schema = mongoose.Schema

const newSchema = new Schema({
    user:{
        type:Schema.Types.ObjectId,
        ref:'Profile'
    },
    pid:{
        type: Schema.Types.ObjectId,
        ref: 'Product'
    },
    cartid:{
        type: Schema.Types.ObjectId,
        ref: 'Cart'
    },
    name: {
        type: String
    },
    des: {
        type: String
    },
    price:{
        type: Number
    },
    qty: {
        type: Number
    },
    date:{
        type: String
    },
    uname:{
        type: String
    },
    uaddress:{
        type: String
    },
    umobile:{
        type:String
    }
})

const ProductSchema = mongoose.model('checkout',newSchema)
module.exports = ProductSchema