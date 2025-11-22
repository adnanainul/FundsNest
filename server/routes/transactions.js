const express = require('express');
const router = express.Router();
const Transaction = require('../models/Transaction');

// Get all transactions with pagination and filters
router.get('/', async (req, res) => {
    try {
        const { user_id, type, startDate, endDate, page = 1, limit = 10 } = req.query;
        const filter = {};

        if (user_id) filter.user_id = user_id;
        if (type && type !== 'all') filter.type = type;

        // Date range filter
        if (startDate || endDate) {
            filter.transaction_date = {};
            if (startDate) filter.transaction_date.$gte = new Date(startDate);
            if (endDate) filter.transaction_date.$lte = new Date(endDate);
        }

        const skip = (Number(page) - 1) * Number(limit);
        const transactions = await Transaction.find(filter)
            .sort({ transaction_date: -1 })
            .skip(skip)
            .limit(Number(limit));

        const total = await Transaction.countDocuments(filter);

        res.json({
            transactions,
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

// Get single transaction
router.get('/:id', async (req, res) => {
    try {
        const transaction = await Transaction.findById(req.params.id);
        if (!transaction) {
            return res.status(404).json({ error: 'Transaction not found' });
        }
        res.json(transaction);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Create new transaction
router.post('/', async (req, res) => {
    try {
        const newTransaction = new Transaction(req.body);
        const savedTransaction = await newTransaction.save();

        // Emit real-time event
        if (req.io) {
            req.io.emit('new_transaction', {
                userId: savedTransaction.user_id,
                transaction: savedTransaction
            });
        }

        res.status(201).json({
            success: true,
            message: 'Transaction recorded successfully',
            transaction: savedTransaction
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Export transactions to CSV
router.get('/export/csv', async (req, res) => {
    try {
        const { user_id } = req.query;
        const filter = user_id ? { user_id } : {};

        const transactions = await Transaction.find(filter).sort({ transaction_date: -1 });

        // Create CSV
        const csvHeader = 'Date,Fund,Symbol,Type,Shares,Price,Total\n';
        const csvRows = transactions.map(t =>
            `${new Date(t.transaction_date).toLocaleDateString()},${t.fund_name},${t.fund_symbol},${t.type},${t.shares},${t.price_per_share},${t.total_amount}`
        ).join('\n');

        res.setHeader('Content-Type', 'text/csv');
        res.setHeader('Content-Disposition', 'attachment; filename=transactions.csv');
        res.send(csvHeader + csvRows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
