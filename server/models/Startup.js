const mongoose = require('mongoose');

const StartupSchema = new mongoose.Schema({
    name: { type: String, required: true },
    industry: { type: String, required: true },
    tagline: { type: String, required: true },
    description: { type: String, required: true },
    stage: { type: String, required: true },
    fundingGoal: { type: Number, required: true },
    submittedBy: { type: String }, // User ID reference
    status: {
        type: String,
        enum: ['pending', 'approved', 'rejected'],
        default: 'pending'
    },
    submittedDate: { type: Date, default: Date.now }
}, { timestamps: true });

module.exports = mongoose.model('Startup', StartupSchema);
