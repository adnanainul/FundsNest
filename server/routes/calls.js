const express = require('express');
const router = express.Router();
const Call = require('../models/Call');
const User = require('../models/User');

// Create a new call
router.post('/', async (req, res) => {
    try {
        let { participants, scheduledAt, topic, createdBy } = req.body;
        const roomId = Math.random().toString(36).substring(7); // Simple random room ID

        // Resolve participants (handle emails if provided)
        const resolvedParticipants = await Promise.all(participants.map(async (p) => {
            if (p && typeof p === 'string' && p.includes('@')) {
                const user = await User.findOne({ email: p });
                return user ? user._id : null;
            }
            return p;
        }));

        // Filter out any nulls (users not found)
        const validParticipants = resolvedParticipants.filter(p => p);

        if (validParticipants.length < 2) {
            return res.status(400).json({ message: 'Invalid participants. Ensure all users exist.' });
        }

        const call = new Call({
            participants: validParticipants,
            scheduledAt,
            topic,
            createdBy,
            roomId
        });

        await call.save();
        res.status(201).json(call);
    } catch (error) {
        console.error('Error creating call:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Get calls for a user
router.get('/user/:userId', async (req, res) => {
    try {
        const { userId } = req.params;
        const calls = await Call.find({ participants: userId })
            .populate('participants', 'name email avatar')
            .populate('createdBy', 'name')
            .sort({ scheduledAt: 1 });
        res.json(calls);
    } catch (error) {
        console.error('Error fetching calls:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Update call status
router.put('/:id/status', async (req, res) => {
    try {
        const { status } = req.body;
        const call = await Call.findByIdAndUpdate(
            req.params.id,
            { status },
            { new: true }
        );
        res.json(call);
    } catch (error) {
        console.error('Error updating call:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;
