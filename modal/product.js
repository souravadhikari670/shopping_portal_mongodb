const mongoose = require('mongoose')
const Schema = mongoose.Schema

const newSchema = new Schema({
    productname: {
        type: String
    },
    productdes: {
        type: String
    },
    productprice:{
        type: Number
    },
    productavailable: {
        type: Number
    },
    status:{
        type: Boolean,
        default: true
    }
})

const ProductSchema = mongoose.model('product',newSchema)
module.exports = ProductSchema
