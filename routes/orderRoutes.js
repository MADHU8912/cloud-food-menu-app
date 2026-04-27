const express = require('express');
const router = express.Router();

let orders = [];

// Create Order
router.post('/', (req, res) => {
    const order = {
        id: Date.now(),
        items: req.body.items,
        status: "PLACED"
    };
    orders.push(order);
    res.json(order);
});

// Get All Orders
router.get('/', (req, res) => {
    res.json(orders);
});

module.exports = router;