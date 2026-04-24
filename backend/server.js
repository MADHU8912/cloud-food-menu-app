const express = require("express");
const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 5000;

const data = {
  restaurants: [
    {
      id: 1,
      name: "Hyderabadi Biryani House",
      location: "Perkit, Armoor",
      rating: 4.5,
      menu: [
        { item: "Chicken Biryani", price: 180 },
        { item: "Mutton Biryani", price: 250 }
      ]
    },
    {
      id: 2,
      name: "Domino's Pizza",
      location: "Nizamabad",
      rating: 4.1,
      menu: [
        { item: "Veg Pizza", price: 149 },
        { item: "Cheese Burst Pizza", price: 249 }
      ]
    }
  ]
};

app.use(cors());

// ✅ THIS LINE (important fix)
app.use(express.static("frontend"));

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/../frontend/index.html");
});

app.get("/api/restaurants", (req, res) => {
  res.json(data.restaurants);
});

app.listen(PORT, "0.0.0.0", () => {
  console.log("Server running on port " + PORT);
});