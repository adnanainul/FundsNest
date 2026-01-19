const mongoose = require('mongoose');

const TransactionSchema = new mongoose.Schema({
    user_id: { type: String, required: true },
    fund_id: { type: String, required: true },
    fund_name: { type: String, required: true },
    fund_symbol: { type: String, required: true },
    type: {
        type: String,
        required: true,
        enum: ['buy', 'sell']
    },
    shares: { type: Number, required: true },
    price_per_share: { type: Number, required: true },
    total_amount: { type: Number, required: true },
    transaction_date: { type: Date, default: Date.now },
    status: {
        type: String,
        enum: ['pending', 'completed', 'cancelled'],
        default: 'completed'
    }
}, { timestamps: true });

module.exports = mongoose.model('Transaction', TransactionSchema);
