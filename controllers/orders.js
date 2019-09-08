const Order = require('../models/order');
const Product = require('../models/product');
const mongoose = require('mongoose');

exports.orders_get_all = (req, res ,next) => {
    Order.find()
    .select('product quantity _id')
    .populate('product')
    .exec()
    .then(docs => {
        res.status(200).json({
            count: docs.length,
            orders: docs.map(doc => {
                return {
                    id: doc._id,
                    product: doc.product,
                    quantity: doc.quantity
                };
            })
            
        });
    })
    .catch(err =>{
            res.status(500).json({
                error: err
            });
        });
};

exports.orders_create_order = (req, res, next) => {
    product.findById(req.body.productId)
    .then(product => {
        if (!product){
            return res.status(404).json({
                message: 'Product was not found'
            });
        }
        const order = new Order({
            _id: mongoose.Types.ObjectId(),
            quantity: req.body.quantity,
            product: req.body.productId
        }); 
        return order.save();
    })
    //.exec()
    .then(result => {
        console.log(result);
        res.status(201).json({
            message: "order stored",
            createdOrder: {
                _id: result._id,
                product: result.product,
                quantity: result.quantity
            },
            request:{
                type: 'GET',
                url: 'http://localhost:3000/orders/' + result._id
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

exports.orders_get_order =  (req, res, next) => {
    Order.findById(req.params.orderId)
    .populate('Product')
    .exec()
    .then(order => {
        res.status(201).json({
            order: order,
            request: {
                type: 'GET',
                url: "http://localhost:3000/orders"
            }
        });
    })
    .catch(err =>{
        res.status(500).json({
            error:err
        });
    });
}

exports.Orders_delete_order = (req, res, next) => {
    Order.remove({
        _id: req.params.orderId
    })
    .exec()
    .then( result => {
        res.status(200).json({
            message: 'order Deleted',
            request: {
                type: 'POST',
                url: "http://localhost:3000/orders",
                body: { productId: 'ID', quantity: 'Number'}
            }
        });
    })
    .catch(err =>{
        res.status(500).json({
            error:err
        });
    });
}