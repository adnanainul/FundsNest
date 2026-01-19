const express = require('express');
const router = express.Router();
const Startup = require('../models/Startup');

// Get all startups with optional filtering and pagination  
router.get('/', async (req, res) => {
    try {
        const { industry, stage, status, page = 1, limit = 10 } = req.query;
        const filter = {};

        if (industry && industry !== 'all') filter.industry = industry;
        if (stage && stage !== 'all') filter.stage = stage;
        if (status) filter.status = status;
        else filter.status = 'approved'; // By default, only show approved startups

        const skip = (Number(page) - 1) * Number(limit);
        const startups = await Startup.find(filter)
            .sort({ submittedDate: -1 })
            .skip(skip)
            .limit(Number(limit));

        const total = await Startup.countDocuments(filter);

        res.json({
            startups,
            pagination: {
                page: Number(page),
                limit: Number(limit),
                total,
                pages: Math.ceil(total / Number(limit))
            }
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Get a single startup by ID
router.get('/:id', async (req, res) => {
    try {
        const startup = await Startup.findById(req.params.id);
        if (!startup) {
            return res.status(404).json({ error: 'Startup not found' });
        }
        res.json(startup);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Submit a new startup
router.post('/', async (req, res) => {
    try {
        const newStartup = new Startup(req.body);
        const savedStartup = await newStartup.save();
        res.status(201).json({
            success: true,
            message: 'Startup submitted successfully! Our team will review it within 24 hours.',
            startup: savedStartup
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
