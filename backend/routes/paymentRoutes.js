const router = require("express").Router();
const Payment = require("../models/Payment");

// CREATE PAYMENT
router.post("/", async (req, res) => {
  const payment = await Payment.create(req.body);
  res.json(payment);
});

// GET PAYMENTS
router.get("/", async (req, res) => {
  const payments = await Payment.find();
  res.json(payments);
});

// UPDATE PAYMENT STATUS
router.put("/:id", async (req, res) => {
  const payment = await Payment.findByIdAndUpdate(req.params.id, req.body, {
    new: true
  });
  res.json(payment);
});

module.exports = router;