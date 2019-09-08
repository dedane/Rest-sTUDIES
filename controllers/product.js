
const Product = require('../models/product')
const mongoose = require('mongoose');

exports.products_get_all = (req, res, next) => {
    Product.find()
    .select('name price _id productImage')
    .exec()
    .then(docs => {
        const response = {
            count: docs.length,
            products: docs.map(doc => {
                return {
                    name: doc.name,
                    price: doc.price,
                    productImage: doc.productImage,
                    _id: doc._id,
                    request: {
                        type: 'GET',
                        url: req.get('host')+'/products/'+ doc._id 
                    }
                };
            })
        };
        console.log(docs);
        //if (docs.length >= 0){
            res.status(200).json(response);
        //}
        //else {
            //res.status(404).json({ message: 'No entries found'});
        //}

    })
    .catch(err => {
        console.log(err);
        res.status(500).json({
            error: err
        });
    });
}

exports.Product_post_product = (req, res, next) => {
    const product = new Product({ //constructor function
        _id: new mongoose.Types.ObjectId(),
        name: req.body.name,
        price: req.body.price,
        productImage: req.file.path
    });

    product.save()
    .then(result => {
        console.log(result);
    
    res.status(201).json({
            message: 'Created product successfully'+result._id,
            createdProduct: {
                name: result.name,
                price: result.price,
                _id: result._id,
                request: {
                    type: 'GET',
                    URL: "HTTP://localhost:3000/products/"+ result._id
                }
            }
        });
    })
    .catch(err => {
        console.log(err);
        res.status(500).json({
            error: err
        });
    });
}