const express = require('express');
const router = express.Router();
const Idea = require('../models/Idea');

// Get all ideas with optional filtering and pagination
router.get('/', async (req, res) => {
    try {
        const { category, stage, featured, page = 1, limit = 10 } = req.query;
        const filter = {};

        if (category && category !== 'all') filter.category = category;
        if (stage && stage !== 'all') filter.stage = stage;
        if (featured === 'true') filter.featured = true;

        const skip = (Number(page) - 1) * Number(limit);
        const ideas = await Idea.find(filter)
            .sort({ postedDate: -1 })
            .skip(skip)
            .limit(Number(limit));

        const total = await Idea.countDocuments(filter);

        res.json({
            ideas,
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

// Get a single idea by ID
router.get('/:id', async (req, res) => {
    try {
        const idea = await Idea.findById(req.params.id);
        if (!idea) {
            return res.status(404).json({ error: 'Idea not found' });
        }

        // Increment views
        idea.views += 1;
        await idea.save();

        res.json(idea);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Create a new idea
router.post('/', async (req, res) => {
    try {
        const newIdea = new Idea(req.body);
        const savedIdea = await newIdea.save();
        res.status(201).json({
            success: true,
            message: 'Idea submitted successfully!',
            idea: savedIdea
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Like an idea
router.post('/:id/like', async (req, res) => {
    try {
        const idea = await Idea.findById(req.params.id);
        if (!idea) {
            return res.status(404).json({ error: 'Idea not found' });
        }

        idea.likes += 1;
        await idea.save();

        res.json({ success: true, likes: idea.likes });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Update idea
router.put('/:id', async (req, res) => {
    try {
        const updatedIdea = await Idea.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        );

        if (!updatedIdea) {
            return res.status(404).json({ error: 'Idea not found' });
        }

        res.json(updatedIdea);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
