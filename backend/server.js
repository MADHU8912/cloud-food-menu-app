const express = require("express");
const cors = require("cors");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());

// ✅ Serve frontend
app.use(express.static(path.join(__dirname, "../frontend")));

// ✅ API
app.get("/api/restaurants", (req, res) => {
  res.json([
    { id: 1, name: "Biryani House", price: 180 },
    { id: 2, name: "Dominos", price: 150 }
  ]);
});

// ✅ Home route (IMPORTANT)
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "../frontend/index.html"));
});

// ✅ KEEP SERVER ALIVE
app.listen(PORT, "0.0.0.0", () => {
  console.log("Server running on port " + PORT);
});