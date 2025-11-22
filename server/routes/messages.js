const express = require('express');
const router = express.Router();
const Message = require('../models/Message');

// Get messages for a room
router.get('/:roomId', async (req, res) => {
    try {
        const messages = await Message.find({ roomId: req.params.roomId }).sort({ timestamp: 1 });
        res.json(messages);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Post a message
router.post('/', async (req, res) => {
    try {
        const { roomId, senderId, senderName, content } = req.body;
        const newMessage = new Message({
            roomId,
            senderId,
            senderName,
            content
        });
        const savedMessage = await newMessage.save();

        // Emit to room
        req.io.to(roomId).emit('receive_message', savedMessage);

        res.status(201).json(savedMessage);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
