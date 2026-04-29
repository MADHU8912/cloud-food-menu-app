const router = require("express").Router();
const Order = require("../models/Order");

// PLACE ORDER
router.post("/", async (req, res) => {
  const order = await Order.create(req.body);
  res.json(order);
});

// GET ALL ORDERS (ADMIN)
router.get("/", async (req, res) => {
  const orders = await Order.find().sort({ createdAt: -1 });
  res.json(orders);
});

// UPDATE ORDER STATUS
router.put("/:id", async (req, res) => {
  const order = await Order.findByIdAndUpdate(req.params.id, req.body, {
    new: true
  });
  res.json(order);
});

module.exports = router;