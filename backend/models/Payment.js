const mongoose = require("mongoose");

const paymentSchema = new mongoose.Schema(
  {
    orderId: String,
    amount: Number,
    status: {
      type: String,
      default: "Pending"
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Payment", paymentSchema);