const express = require('express')
const router = express.Router()
const bcryptjs = require('bcryptjs')
const jsonwt = require('jsonwebtoken')
const mySecretkey = require('../../key/database').secret

//bring required Schema
const Profile = require('../../modal/profile')
const Admin = require('../../modal/admin')
//Register Route
router.get('/register', (req, res)=>{
    res.render('register')
})
//login Route
router.get('/login', (req, res)=>{
    res.render('login')
})

//post route
//register route
router.post('/register',(req, res)=>{
    Profile.findOne({email: req.body.email})
    .then((profile)=>{
        if(! profile){
            const newUser = new Profile({
                fullname: req.body.fullname,
                mobileno: req.body.mobile,
                email: req.body.email,
                address: req.body.address,
                postalcode: req.body.postalcode,
                password: req.body.password
            })
            //encrypt password
            bcryptjs.genSalt(10, function(error,salt){
                bcryptjs.hash(newUser.password, salt, (error, hash)=>{
                    if(error) throw error
                    newUser.password = hash
                    newUser.save()
                    .then((profile)=>{
                        const data = {
                            id: profile._id,
                            fullname: profile.fullname,
                            mobileno: profile.mobileno,
                            email: profile.email,
                            address: profile.address,
                            postalcode: profile.postalcode
                        }
                        jsonwt.sign(
                            data,
                            mySecretkey,
                            {expiresIn:86400},
                            (error, token)=>{
                                res.cookie('token', token)
                                res.send({success: true})
                            }
                        )
                    })
                })
            })
            
        }else{
            res.send({email: "exist"})
        }
    })
})

//post route
//this is for login
router.post('/login',(req, res)=>{
   if(req.body.email === "admin@gmail.com"){
       if(req.body.password === "admin"){
            Admin.findOne({email:"admin@gmail.com"})
            .then((admin)=>{
                if(admin){
                    const data = {
                        id: admin._id,
                        email: admin.email,
                    }
                    jsonwt.sign(
                        data,
                        mySecretkey,
                        {expiresIn: 86400},
                        (error, token)=>{
                            res.cookie('token', token)
                            res.send({success: true, admin:"admin"})
                        }
                    )
                }else{
                    const newAnswer = new Admin({
                        email:"admin@gmail.com",
                        password:"admin",
                        name:"admin"
                    })
                  newAnswer.save()
                  .then((admin)=>{
                    const data = {
                        id:admin._id,
                        email: admin.email,
                    }
                    jsonwt.sign(
                        data,
                        mySecretkey,
                        {expiresIn: 86400},
                        (error, token)=>{
                            res.cookie('token', token)
                            res.send({success: true, admin:"admin"})
                        }
                    )
                  })
                  .catch((error)=>{
                      console.log(error)
                  })
                }
            })
            .catch((error)=>{
                console.log(error)
            })
        
       }else{
        res.send({password: "notcorrect"})
       }
   }else{
    Profile.findOne({email: req.body.email})
    .then((profile)=>{
        if(! profile){
            res.send({email: "notexist"})
        }else{
            bcryptjs.compare(req.body.password, profile.password)
            .then((authuser)=>{
                if(authuser){
                    const data = {
                        id: profile._id,
                        fullname: profile.fullname,
                        mobileno: profile.mobileno,
                        email: profile.email,
                        address: profile.address,
                        postalcode: profile.postalcode
                    }
                    jsonwt.sign(
                        data,
                        mySecretkey,
                        {expiresIn: 86400},
                        (error, token)=>{
                            res.cookie('token', token)
                            res.send({success: true})
                        }
                    )
                }else{
                    res.send({password: "notcorrect"})
                }
            }).catch((error)=>{
                console.log(error)
            })
            
        }
    })
   }
})


module.exports = router