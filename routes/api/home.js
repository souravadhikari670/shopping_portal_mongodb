const express = require('express')
const router = express.Router()
const passport = require('passport')

const Product = require('../../modal/product')
const Profile = require('../../modal/profile')
//home route
router.get('/',
 passport.authenticate('jwt',{session: false,successRedirect: '/shoppingportal/auth/home', failureRedirect: "/shoppingportal/home"}),
(req, res)=>{
})

router.get('/shoppingportal/auth/home',
passport.authenticate('jwt',{session: false,failureRedirect: "/sessionexpire"}), 
(req, res)=>{
    Product.find()
    .then((product)=>{
        Profile.findById(req.user.id)
        .then((user)=>{
            res.render('home',{product,user,auth:true})
        })
    })
    .catch((error)=>{
        console.log(error)
    })
})
router.get('/shoppingportal/home',(req, res)=>{
    Product.find()
    .then((product)=>{
        res.render('home',{product, auth: false})
    })
    .catch((error)=>{
        console.log(error)
    })
})

router.get('/sessionexpire',(req, res)=>{
    res.clearCookie('token')
    res.redirect('/shoppingportal/home')
})
router.post('/logout',(req, res)=>{
    res.clearCookie('token')
    res.redirect('/')
})
module.exports = router