const express = require('express');
const router = express.Router();
const Pitch = require('../models/Pitch');
const analysisService = require('../services/analysisService');
const matchingService = require('../services/matchingService');
const blockchainService = require('../services/blockchainService');

router.post('/analyze', async (req, res) => {
    try {
        const { content, type } = req.body;
        const analysis = await analysisService.analyzePitch(content);
        res.json(analysis);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.post('/submit', async (req, res) => {
    try {
        const { userId, content, type, analysis } = req.body;
        const pitch = new Pitch({ userId, content, type, analysis });
        await pitch.save();

        // Record on Blockchain
        await blockchainService.createRecord({ pitchId: pitch._id, userId }, 'PITCH_SUBMISSION');

        // Find Matches
        const matches = await matchingService.matchInvestors(analysis);

        res.json({ pitch, matches });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
