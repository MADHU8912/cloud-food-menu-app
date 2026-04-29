const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");

dotenv.config(); // MUST BE BEFORE DB CONNECT

const connectDB = require("./config/db");

const app = express();

app.use(cors());
app.use(express.json());

// Routes
app.use("/api/menu", require("./routes/menuRoutes"));
app.use("/api/orders", require("./routes/orderRoutes"));
app.use("/api/payments", require("./routes/paymentRoutes"));

app.get("/", (req, res) => {
  res.send("Cloud Food Menu API Running 🚀");
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});