const express = require('express');
const router = express.Router();

router.post('/', (req, res, next) => {
    const order = {
        productId: req.body.productID,
        quantity: req.body.quantity
    };
    res.status(201).json({
        message: 'Order was created',
        order: order
    });
});
router.get('/:orderID', (req, res, next) => {
    res.status(200).json({
        message: 'order was created',
        orderID: req.params.orderID
    });
});

router.delete('/', (req, res, next) => {
    res.status(201).json({
        message: 'Order was deleted'
    });
});
module.exports = router;
    
