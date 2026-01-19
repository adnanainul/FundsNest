const mongoose = require('mongoose');

const InvestorProfileSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
    preferences: {
        industries: [String],
        minFunding: Number,
        maxFunding: Number,
        riskTolerance: { type: String, enum: ['Low', 'Medium', 'High'], default: 'Medium' }
    },
    portfolio: [{
        startupName: String,
        investedAmount: Number,
        returnOnInvestment: Number, // Percentage
        riskCategory: { type: String, enum: ['Low', 'Medium', 'High'] }
    }]
});

module.exports = mongoose.model('InvestorProfile', InvestorProfileSchema);
