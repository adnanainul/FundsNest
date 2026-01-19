const mongoose = require('mongoose');

const portfolioSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    fundId: { type: mongoose.Schema.Types.ObjectId, ref: 'Fund', required: true },
    amountInvested: { type: Number, required: true },
    investedAt: { type: Date, default: Date.now },
    currentValue: { type: Number }
});

module.exports = mongoose.model('Portfolio', portfolioSchema);
