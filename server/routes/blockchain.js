const express = require('express');
const router = express.Router();
const BlockchainRecord = require('../models/BlockchainRecord');

router.get('/', async (req, res) => {
    try {
        const records = await BlockchainRecord.find().sort({ timestamp: -1 });
        res.json(records);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
