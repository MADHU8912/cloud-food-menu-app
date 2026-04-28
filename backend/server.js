const express = require('express');
const app = express();

const PORT = process.env.PORT || 5000;

// ✅ Health API (pipeline depends on this)
app.get('/api/restaurants', (req, res) => {
  res.json([
    { name: "Hyderabadi Biryani House", rating: 4.5 },
    { name: "Domino's Pizza", rating: 4.1 },
    { name: "KFC", rating: 4 }
  ]);
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});