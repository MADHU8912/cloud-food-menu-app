const express = require("express");
const jwt = require("jsonwebtoken");
const path = require("path");

const app = express();
const PORT = 5000;

app.use(express.json());

// serve frontend
app.use(express.static(path.join(__dirname, "../frontend")));

// test route
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "../frontend/index.html"));
});

// users (default)
const users = [
  { username: "nikhil", password: "123" }
];

const SECRET = "mysecretkey";

// REGISTER
app.post("/api/register", (req, res) => {
  const { username, password } = req.body;
  users.push({ username, password });
  res.json({ message: "User registered" });
});

// LOGIN
app.post("/api/login", (req, res) => {
  const { username, password } = req.body;

  const user = users.find(
    u => u.username === username && u.password === password
  );

  if (!user) return res.status(401).json({ message: "Invalid login" });

  const token = jwt.sign({ username }, SECRET, { expiresIn: "1h" });

  res.json({ token });
});

// RESTAURANTS
app.get("/api/restaurants", (req, res) => {
  res.json([
    { name: "Hyderabadi Biryani House", rating: 4.5 },
    { name: "Domino's Pizza", rating: 4.1 },
    { name: "KFC", rating: 4.0 }
  ]);
});

app.listen(PORT, () => {
  console.log("Server running on port " + PORT);
});