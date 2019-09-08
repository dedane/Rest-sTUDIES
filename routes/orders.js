const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

const Order = require('../models/order');
const product = require('../models/product');

const OrdersController = require ('../controllers/orders');


//Handles incoming GET request from orders
router.get("/",OrdersController.orders_get_all );

//Handles outgoing post request to the data
router.post('/',OrdersController.orders_create_order);

//Handles incoming Get request for a single order
router.get('/:orderId', OrdersController.orders_get_order);

//handles removal of orders

router.delete('/:orderId', OrdersController.Orders_delete_order );

module.exports = router;
    
