const express = require('express')
const router = express.Router()
const passport = require('passport')

const Profile = require('../../modal/profile')
const Product = require('../../modal/product')
const Cart = require('../../modal/Cart')
const Checkout = require('../../modal/checkout')

router.post('/addtocart/:pid',
    passport.authenticate('jwt',{session: false}),(req,res)=>{

    Profile.findById(req.user.id)
    .then((user)=>{
        Product.findById(req.params.pid)
        .then((product)=>{

            Cart.findOne({pid: req.params.pid})
            .then((cart)=>{

                if(cart){

                    Cart.findOneAndUpdate({pid: req.params.pid},
                        {$set:{price: cart.price+(product.productprice*req.body.qty), qty:cart.qty+Number(req.body.qty)}},{new: true})
                        .then(()=>{

                            Product.findByIdAndUpdate(req.params.pid, {$set:{productavailable: product.productavailable-req.body.qty}},{new:true})
                            .then((product)=>{
                          
                                if(product.productavailable == 0 ){
                                    Product.findByIdAndUpdate(req.params.pid, {$set:{status: false}},{new:true})
                                    .then(()=>{
                                        res.send({ success: true, qty:product.productavailable })
                                    })
                                    .catch((error)=>{
                                        console.log(error)
                                    })
                                }else{
                                    Product.findByIdAndUpdate(req.params.pid, {$set:{status: true}},{new:true})
                                    .then(()=>{
                                        res.send({ success: true, qty:product.productavailable })
                                    })
                                    .catch((error)=>{
                                        console.log(error)
                                    })
                                }
                            })
                            .catch((error)=>{
                                console.log(error)
                            })
                        })
                        .catch((error)=>{
                            console.log(error)
                        })

                }else{
                const newCartProduct = new Cart({
                    user: req.user.id,
                    pid: product._id,
                    name: product.productname,
                    des: product.productdes,
                    price: product.productprice*req.body.qty,
                    qty: req.body.qty
                })
        
            newCartProduct.save()
            .then((cart)=>{
                Product.findByIdAndUpdate(req.params.pid, {$set:{productavailable: product.productavailable-req.body.qty}},{new:true})
                .then((product)=>{
                    if(product.productavailable == 0 ){
                        Product.findByIdAndUpdate(req.params.pid, {$set:{status: false}},{new:true})
                        .then(()=>{
                            res.send({ success: true, qty:product.productavailable })
                        })
                        .catch((error)=>{
                            console.log(error)
                        })
                    }else{
                        Product.findByIdAndUpdate(req.params.pid, {$set:{status: true}},{new:true})
                        .then(()=>{
                            res.send({ success: true, qty:product.productavailable })
                        })
                        .catch((error)=>{
                            console.log(error)
                        })
                    }
                   
                })
                .catch((error)=>{
                    console.log(error)
                })

            })
            .catch((error)=>{
                console.log(errro)
            })
                }

            })
            .catch((error)=>{
                console.log(error)
            })
        })
        .catch((error)=>{
            console.log(error)
        })
    })
    .catch((error)=>{
        console.log(error)
    })

})

//get product from cart

router.get('/mycart', passport.authenticate('jwt',{session:false,failureRedirect:'/sessionexpire'}),(req, res)=>{

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
        Profile.findById(req.user.id)
        .then((user)=>{
            res.render('cart',{cartArray, total, user})
        })
        .catch((error)=>{
            console.log(error)
        })
    })
    .catch((error)=>{
        console.log(error)
    })
})

router.post('/deleteproduct/:pid',passport.authenticate('jwt',{session: false,failureRedirect:'/sessionexpire'}),(req, res)=>{

    Cart.findOne({pid:req.params.pid})
    .then((cart)=>{

        Product.findById(req.params.pid)
        .then((product)=>{
            console.log(product.productavailable)
            Product.findByIdAndUpdate(req.params.pid,{$set:{productavailable:(Number(product.productavailable)+Number(cart.qty)),status:true}},{new:true})
            .then((product)=>{

                Cart.findOneAndRemove({pid:req.params.pid})
                .then(()=>{
                    res.redirect('/api/cart/mycart')
                })
                .catch((error)=>{
                    console.log(error)
                })
            })
            .catch((error)=>{
                console.log(error)
            })
        })
        .catch((error)=>{
            console.log(error)
        })

    })
    .catch((error)=>{
        console.log(error)
    })
})

module.exports = router