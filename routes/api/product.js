const express = require('express')
const router = express.Router()
const passport = require('passport')
const multer = require('multer')

// // configuration multer
// var storage = multer.diskStorage({
//     destination: function (req, file, cb) {
//       cb(null, './routes/public/product')
//     },
//     filename: function (req, file, cb) {
//         cb(null, Date.now() + file.originalname)
//     }
//   })
   
//   var upload = multer({ storage: storage })

//schema
const Product = require('../../modal/product')
const Checkout = require('../../modal/checkout')
const Profile = require('../../modal/profile')

//add product panel
router.get('/addproduct',(req,res)=>{
    res.render('addproduct')
})

router.post('/addproduct',(req, res)=>{

    const newProduct = new Product({
        productname:req.body.productname,
        productdes: req.body.productdes,
        productprice: req.body.productprice,
        productavailable: req.body.productavailable,
    })
    newProduct.save()
    .then((product)=>{
        res.send({success:true})
    })
    .catch((error)=>{
        console.log(error)
    })

    
})

//view products
router.get('/viewproduct',(req, res)=>{
        Product.find()
        .then((product)=>{
                res.render('products',{product})
        })
        .catch((error)=>{
            console.log(error)
        })
})

router.post('/deleteproduct/:pid',(req, res)=>{

    Product.findByIdAndRemove(req.params.pid)
    .then((product)=>{
        res.send({success: true})
    })
    .catch((error)=>{
        console.log(error)
    })

})
router.post('/editproduct/:pid',(req, res)=>{

    Product.findById(req.params.pid)
    .then((product)=>{
        if( product.productavailable != 0 ){
            Product.findByIdAndUpdate(req.params.pid, {$set:{status: true}},{new:true})
            .then((product)=>{
                res.send({success: true, product})
            })
            .catch((error)=>{
                console.log(error)
            })
        }else{
            Product.findByIdAndUpdate(req.params.pid, {$set:{status: false}},{new:true})
            .then((product)=>{
                res.send({success: true, product})
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
router.post('/saveproduct/:pid',(req, res)=>{

    Product.findByIdAndUpdate(req.params.pid, req.body, {new: true})
    .then((product)=>{
        res.send({success: true})
    })
    .catch((error)=>{
        console.log(error)
    })

})

// function checkProduct(){
//     Product.find()
//     .then((product)=>{

//         for( i=0;i<product.length;i++ ){
            
//             if( product[i].productavailable == 0 ){

//                 Product.findOneAndUpdate({_id: product[i]._id}, {$set:{status: false}}, {new: true})
//                 .then((product)=>{
//                     setInterval(checkProduct,1000)
//                 })
//                 .catch((error)=>{
//                     console.log(error)
//                 })
//             }else{
                
//                 Product.findOneAndUpdate({_id: product[i]._id}, {$set:{status: true}}, {new: true})
//                 .then((product)=>{
//                     setInterval(checkProduct,1000)
//                 })
//                 .catch((error)=>{
//                     console.log(error)
//                 })
//             }

//         }

//     })
//     .catch((error)=>{
//         console.log(error)
//     })
// }
// checkProduct()


//confirm order
router.get('/confirm', (req, res)=>{
    
    var checkoutArray = []
    Checkout.find()
    .then((checkout)=>{

        for( i=0;i<checkout.length;i++ ){

            var userid = checkout[i].user
        
            // Profile.findOne({_id:userid})
            // .then((user)=>{
                var newConfirm = {

                    pid: checkout[i]._id,
                    pname: checkout[i].name,
                    pqty: checkout[i].qty,
                    pprice: checkout[i].price,
                    pdate: checkout[i].date,
                    uname: checkout[i].uname,
                    uaddress: checkout[i].uaddress,
                    umobile: checkout[i].umobile,
                }
                checkoutArray.push(newConfirm)
            // })
            // .catch((error)=>{
            //     console.log(error)
            // })
        }
        res.render('confirm',{checkoutArray})
    })
    .catch((error)=>{
        console.log(error)
    })

})

module.exports = router