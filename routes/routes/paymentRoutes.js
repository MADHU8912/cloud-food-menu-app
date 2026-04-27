const express = require('express');
const router = express.Router();

// Demo Payment API
router.post('/', (req, res) => {
    res.json({
        status: "SUCCESS",
        paymentId: Date.now()
    });
});

module.exports = router;