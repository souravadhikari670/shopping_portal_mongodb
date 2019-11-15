const express = require('express')
const router = express.Router()
const passport = require('passport')

const Profile = require('../../modal/profile')
const Product = require('../../modal/product')
const Cart = require('../../modal/Cart')
const Checkout = require('../../modal/checkout')

router.get('/mycheckout', passport.authenticate('jwt',{session:false,failureRedirect:'/sessionexpire'}),(req, res)=>{

    const cartArray = []
    var total = 0
    Cart.find()
    .then((cart)=>{
        
    for( i=0;i<cart.length;i++ ){
        if( cart[i].user == req.user.id ){
            cartArray.push(cart[i])
            total = total + cart[i].price
        }
    }
        res.render('checkout',{cartArray, total})

    })
    .catch((error)=>{
        console.log(error)
    })
})


router.post('/checkout',passport.authenticate('jwt',{session: false,failureRedirect:'/sessionexpire'}),(req, res)=>{

    Cart.find()
    .then((cart)=>{
        for( i=0;i<cart.length;i++ ){

            if( cart[i].user == req.user.id ){
                var date = new Date
                var newCheckoutProduct = new Checkout({
                    user: req.user.id,
                    pid: cart[i].pid,
                    cartid: cart[i]._id,
                    name: cart[i].name,
                    des: cart[i].des,
                    price: cart[i].price,
                    qty: cart[i].qty,
                    date: date.toLocaleDateString() +" "+date.toLocaleTimeString(),
                    uname:req.user.fullname,
                    uaddress: req.user.address,
                    umobile: req.user.mobileno
                })
                newCheckoutProduct.save()
                .then(()=>{
                    Cart.findOneAndRemove({user: req.user.id})
                    .then(()=>{

                    })
                    .catch((error)=>{
                        console.log(error)
                    })
                })
                .catch((error)=>{
                    console.log(error)
                })
            }
        }
        res.redirect('/')
    })
    .catch((error)=>{
        console.log(error)
    })
})

module.exports = router