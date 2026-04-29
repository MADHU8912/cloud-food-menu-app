const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
  {
    items: Array,
    totalAmount: Number,
    status: {
      type: String,
      default: "Pending"
    },
    paymentStatus: {
      type: String,
      default: "Pending"
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Order", orderSchema);