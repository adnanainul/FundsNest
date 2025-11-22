const express = require('express');
const router = express.Router();
const User = require('../models/User');
const jwt = require('jsonwebtoken');

// Mock Login (or simple implementation)
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        // In a real app, check password hash!
        let user = await User.findOne({ email });

        if (!user) {
            // For demo purposes, auto-create user if not exists (or return error)
            // res.status(404).json({ error: 'User not found' });
            // return;

            // Auto-signup for ease of use in this migration demo
            user = new User({ email, password, name: email.split('@')[0] });
            await user.save();
        } else if (user.password !== password) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        const token = jwt.sign({ id: user._id, email: user.email }, 'secret_key_change_me', { expiresIn: '1d' });
        res.json({ token, user });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.post('/signup', async (req, res) => {
    try {
        const { email, password, type } = req.body;
        let user = await User.findOne({ email });
        if (user) return res.status(400).json({ error: 'User already exists' });

        user = new User({ email, password, type, name: email.split('@')[0] });
        await user.save();

        const token = jwt.sign({ id: user._id, email: user.email }, 'secret_key_change_me', { expiresIn: '1d' });
        res.json({ token, user });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
