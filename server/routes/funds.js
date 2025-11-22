const express = require('express');
const router = express.Router();
const Fund = require('../models/Fund');

router.get('/', async (req, res) => {
    try {
        const funds = await Fund.find().sort({ name: 1 });
        res.json(funds);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
