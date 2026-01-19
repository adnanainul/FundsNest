const mongoose = require('mongoose');

const fundSchema = new mongoose.Schema({
    name: { type: String, required: true },
    description: { type: String },
    targetAmount: { type: Number },
    raisedAmount: { type: Number, default: 0 },
    minInvestment: { type: Number },
    returnRate: { type: Number }, // Expected return
    riskLevel: { type: String, enum: ['Low', 'Medium', 'High'] },
    category: { type: String }
});

module.exports = mongoose.model('Fund', fundSchema);
