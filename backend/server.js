const express = require('express');
const app = express();

app.use(express.json());

// ================= SAMPLE DATA =================

let restaurants = [
    { id: 1, name: "Pizza Hub", location: "Hyderabad" },
    { id: 2, name: "Biryani House", location: "Nizamabad" },
    { id: 3, name: "Food Palace", location: "Bangalore" }
];

// ================= ROUTES =================

// Health Check API (IMPORTANT for Jenkins)
app.get('/api/restaurants', (req, res) => {
    res.json({
        success: true,
        data: restaurants
    });
});

// Add new restaurant
app.post('/api/restaurants', (req, res) => {
    const { name, location } = req.body;

    const newRestaurant = {
        id: restaurants.length + 1,
        name,
        location
    };

    restaurants.push(newRestaurant);

    res.status(201).json({
        success: true,
        message: "Restaurant added",
        data: newRestaurant
    });
});

// Version API (Dashboard + DevOps)
app.get('/version', (req, res) => {
    res.json({
        version: process.env.VERSION || "dev",
        status: "running",
        time: new Date()
    });
});

// Root route
app.get('/', (req, res) => {
    res.send("🚀 Cloud Food Menu App Running");
});

// ================= SERVER =================

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});