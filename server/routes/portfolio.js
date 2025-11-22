const express = require('express');
const router = express.Router();
const Portfolio = require('../models/Portfolio');

router.get('/:userId', async (req, res) => {
    try {
        const portfolio = await Portfolio.find({ userId: req.params.userId }).populate('fundId');
        // Map to match frontend expectation (renaming fundId to fund)
        const mapped = portfolio.map(p => ({
            ...p.toObject(),
            fund: p.fundId
        }));
        res.json(mapped);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
