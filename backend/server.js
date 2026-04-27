const express = require("express");
const cors = require("cors");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// ----------------------
// Existing Routes (Restaurants)
// ----------------------
app.get("/api/restaurants", (req, res) => {
    res.json([
        { name: "Hyderabadi Biryani House", rating: 4.5 },
        { name: "Domino's Pizza", rating: 4.1 },
        { name: "KFC", rating: 4.0 }
    ]);
});

// ----------------------
// NEW: Order Routes
// ----------------------
const orderRoutes = require("./routes/orderRoutes");
app.use("/api/orders", orderRoutes);

// ----------------------
// Server Start
// ----------------------
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
});