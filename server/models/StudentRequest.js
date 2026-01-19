const mongoose = require('mongoose');

const StudentRequestSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    student: {
        name: { type: String, required: true },
        email: { type: String, required: true },
        avatar: { type: String },
        university: { type: String, required: true },
        major: { type: String, required: true },
        year: { type: String, required: true }
    },
    idea: {
        title: { type: String, required: true },
        description: { type: String, required: true },
        category: { type: String, required: true },
        fundingNeeded: { type: Number, required: true },
        timeframe: { type: String, required: true },
        stage: { type: String, required: true }
    },
    status: {
        type: String,
        enum: ['new', 'reviewed', 'interested', 'rejected'],
        default: 'new'
    },
    priority: {
        type: String,
        enum: ['high', 'medium', 'low'],
        default: 'medium'
    },
    submittedDate: { type: Date, default: Date.now }
}, { timestamps: true });

module.exports = mongoose.model('StudentRequest', StudentRequestSchema);
