const express = require('express');
const router = express.Router();
const StudentRequest = require('../models/StudentRequest');

// Get all student requests with optional filtering and pagination
router.get('/', async (req, res) => {
    try {
        const { status, priority, page = 1, limit = 10 } = req.query;
        const filter = {};

        if (status && status !== 'all') filter.status = status;
        if (priority && priority !== 'all') filter.priority = priority;

        const skip = (Number(page) - 1) * Number(limit);
        const requests = await StudentRequest.find(filter)
            .sort({ submittedDate: -1 })
            .skip(skip)
            .limit(Number(limit));

        const total = await StudentRequest.countDocuments(filter);

        res.json({
            requests,
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

// Get a single request by ID
router.get('/:id', async (req, res) => {
    try {
        const request = await StudentRequest.findById(req.params.id);
        if (!request) {
            return res.status(404).json({ error: 'Request not found' });
        }
        res.json(request);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Create a new student request
router.post('/', async (req, res) => {
    try {
        const newRequest = new StudentRequest(req.body);
        const savedRequest = await newRequest.save();

        // Emit real-time update via socket.io
        if (req.io) {
            req.io.emit('new_student_request', savedRequest);
        }

        res.status(201).json(savedRequest);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Update request status
router.put('/:id/status', async (req, res) => {
    try {
        const { status } = req.body;

        if (!['new', 'reviewed', 'interested', 'rejected'].includes(status)) {
            return res.status(400).json({ error: 'Invalid status' });
        }

        const updatedRequest = await StudentRequest.findByIdAndUpdate(
            req.params.id,
            { status },
            { new: true }
        );

        if (!updatedRequest) {
            return res.status(404).json({ error: 'Request not found' });
        }

        // Emit real-time update via socket.io
        if (req.io) {
            req.io.emit('request_status_updated', {
                requestId: req.params.id,
                status,
                request: updatedRequest
            });
        }

        res.json(updatedRequest);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
