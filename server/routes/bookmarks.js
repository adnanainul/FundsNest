const express = require('express');
const router = express.Router();
const Bookmark = require('../models/Bookmark');

// Get user's bookmarks
router.get('/', async (req, res) => {
    try {
        const { user_id, item_type } = req.query;
        const filter = { user_id };

        if (item_type && item_type !== 'all') filter.item_type = item_type;

        const bookmarks = await Bookmark.find(filter).sort({ created_at: -1 });
        res.json(bookmarks);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Add bookmark
router.post('/', async (req, res) => {
    try {
        const { user_id, item_type, item_id, notes } = req.body;

        // Check if already bookmarked
        const existing = await Bookmark.findOne({ user_id, item_id });
        if (existing) {
            return res.status(400).json({ error: 'Already bookmarked' });
        }

        const bookmark = new Bookmark({ user_id, item_type, item_id, notes });
        await bookmark.save();

        res.status(201).json({
            success: true,
            message: 'Bookmarked successfully',
            bookmark
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Remove bookmark
router.delete('/:id', async (req, res) => {
    try {
        const bookmark = await Bookmark.findByIdAndDelete(req.params.id);
        if (!bookmark) {
            return res.status(404).json({ error: 'Bookmark not found' });
        }
        res.json({ success: true, message: 'Bookmark removed' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Check if item is bookmarked
router.get('/check', async (req, res) => {
    try {
        const { user_id, item_id } = req.query;
        const bookmark = await Bookmark.findOne({ user_id, item_id });
        res.json({ bookmarked: !!bookmark, bookmark });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
