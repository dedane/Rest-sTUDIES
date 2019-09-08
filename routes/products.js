const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const multer = require('multer');
const checkAuth = require('../middleware/check-auth');

const ProductController = require('../controllers/product');

const storage = multer.diskStorage({
  destination: function(req, file, cb){
    cb(null, './uploads/');
  },
  filename: function(req, file, cb) {
    cb(null, new Date().toISOString() + file.originalname);
  }
});
const upload = multer({storage: storage });
const Product = require('../models/product');

router.get('/', ProductController.products_get_all);

router.post('/', upload.single('productImage'), ProductController.Product_post_product);


router.get("/:productId", (req, res, next) => {
    const id = req.params.productId;
    Product.findById(id)
    .select('name price _id productImage')
    .exec()
    .then(doc => {
        console.log("From database",doc);
        if (doc) {
            res.status(200).json({
                product: doc,
                request: {
                    type: "GET",
                    description: 'Get all Products',
                    url: 'Http://localhost:3000/products'
                }
            });
        }
        else{
            res.status(404).json({message: "No valid entry found for provided ID"});
        }
    })
    .catch(err => {
    console.log(err);
    res.status(500).json({error: err});
   });
});
//This is for changing data in the database
   router.patch('/:productId', checkAuth,(req, res, next) => {
    const id = req.params.productId;  
    const updateOps = {};
    for (const ops of req.body) {
        updateOps[ops.propName] = ops.value;
    }
    Product.update({_id: id},{ $set: updateOps})
    .exec()
    .then(result => {
        console.log(res);
        res.status(200).json({
            message: 'Product Updated',
            request: {
                type: 'GET',
                url: 'http://localhost:3000/products/' + id
            }
        });
    })
    .catch(err => {
        console.log(err);
        res.status(500).json({error: err});
    });
});

   router.delete('/:productId', checkAuth, (req, res, next) => {
    const id = req.params.productId;    
    Product.remove({_id: id})
    .exec()
    .then(result => {
        res.status(200).json({
            message: 'Product Deleted',
            request: {
                type: 'POST',
                URL: 'HTTP://localhost:3000/product',
                body: { name: 'String', price: 'Number'}
            }
        });
    })
    .catch(err => {
        console.log(err);
        res.status(500).json({error: err});
    });
   });
module.exports = router;
    