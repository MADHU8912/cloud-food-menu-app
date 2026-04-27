const express = require("express");
const app = express();

app.use(express.static("frontend"));

app.get("/api/restaurants", (req, res) => {
  res.json([
    { name: "Biryani House" },
    { name: "Dominos" }
  ]);
});

app.listen(5050, () => {
  console.log("Server running on port 5050");
});