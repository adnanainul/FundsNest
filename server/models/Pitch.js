const mongoose = require('mongoose');

const PitchSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    content: { type: String, required: true }, // Text or Video URL
    type: { type: String, enum: ['text', 'video'], default: 'text' },
    analysis: {
        domain: String,
        problemStatement: String,
        technology: [String],
        targetMarket: String,
        fundingRequirement: Number,
        equityOffered: Number,
        riskLevel: { type: String, enum: ['Low', 'Medium', 'High'] }
    },
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Pitch', PitchSchema);
