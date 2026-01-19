const express = require('express');
const router = express.Router();
const InvestorProfile = require('../models/InvestorProfile');
const riskService = require('../services/riskService');

router.post('/profile', async (req, res) => {
    try {
        const { userId, preferences, portfolio } = req.body;
        let profile = await InvestorProfile.findOne({ userId });

        if (profile) {
            profile.preferences = preferences;
            profile.portfolio = portfolio;
        } else {
            profile = new InvestorProfile({ userId, preferences, portfolio });
        }

        await profile.save();
        res.json(profile);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

const portfolioService = require('../services/portfolioService');

// ... existing profile route ...

router.get('/:userId/risk', async (req, res) => {
    try {
        const analytics = await portfolioService.analyzePortfolio(req.params.userId);
        res.json(analytics);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.post('/opportunity-score', async (req, res) => {
    try {
        const { userId, startupAnalysis } = req.body;
        const profile = await InvestorProfile.findOne({ userId });
        if (!profile) return res.status(404).json({ error: 'Profile not found' });

        const score = portfolioService.calculateOpportunityScore(profile, startupAnalysis);
        res.json({ score });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
