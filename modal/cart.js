
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
})

const ProductSchema = mongoose.model('cart',newSchema)
module.exports = ProductSchema