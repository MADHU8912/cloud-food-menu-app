const express = require("express");
const cors = require("cors");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());

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

app