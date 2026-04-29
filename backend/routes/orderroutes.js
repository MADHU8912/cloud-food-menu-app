const express = require('express');
const router = express.Router();

// 🔹 GET all orders
router.get('/', (req, res) => {
    res.json({
        success: true,
        message: "All orders fetched",
        orders: [
            { id: 1, item: "Pizza", price: 200 },
            { id: 2, item: "Burger", price: 120 }
        ]
    });
});

// 🔹 GET single order
router.get('/:id', (req, res) => {
    const id = req.params.id;

    res.json({
        success: true,
        message: `Order ${id} details`,
        order: { id, item: "Pizza", price: 200 }
    });
});

// 🔹 CREATE order
router.post('/', (req, res) => {
    const data = req.body;

    res.json({
        success: true,
        message: "Order created",
        order: data
    });
});

// 🔹 UPDATE order
router.put('/:id', (req, res) => {
    const id = req.params.id;

    res.json({
        success: true,
        message: `Order ${id} updated`,
        updatedData: req.body
    });
});

// 🔹 DELETE order
router.delete('/:id', (req, res) => {
    const id = req.params.id;

    res.json({
        success: true,
        message: `Order ${id} deleted`
    });
});

module.exports = router;