const express = require("express");
const router = express.Router();

// dummy orders database
let orders = [];

// CREATE ORDER
router.post("/create", (req, res) => {
    const order = {
        id: Date.now(),
        items: req.body.items,
        status: "PLACED"
    };
    orders.push(order);
    res.json(order);
});

// GET ALL ORDERS
router.get("/", (req, res) => {
    res.json(orders);
});

// UPDATE STATUS
router.put("/:id", (req, res) => {
    const order = orders.find(o => o.id == req.params.id);
    if (order) {
        order.status = req.body.status;
    }
    res.json(order);
});

module.exports = router;