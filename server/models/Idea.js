const mongoose = require('mongoose');

const IdeaSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    author: {
        name: { type: String, required: true },
        email: { type: String, required: true },
        avatar: { type: String },
        university: { type: String, required: true },
        major: { type: String, required: true }
    },
    category: {
        type: String,
        required: true,
        enum: ['Technology', 'Social Impact', 'Healthcare', 'Education', 'Environmental', 'FinTech', 'Other']
    },
    stage: {
        type: String,
        required: true,
        enum: ['Concept', 'Research', 'Prototype', 'MVP', 'Testing']
    },
    fundingGoal: { type: Number, required: true },
    likes: { type: Number, default: 0 },
    comments: { type: Number, default: 0 },
    shares: { type: Number, default: 0 },
    views: { type: Number, default: 0 },
    postedDate: { type: Date, default: Date.now },
    featured: { type: Boolean, default: false },
    availability: { type: String },
    responseTime: { type: String },
    communicationPrefs: {
        video: { type: Boolean, default: true },
        messaging: { type: Boolean, default: true },
        phone: { type: Boolean, default: false },
        email: { type: Boolean, default: true }
    },
    submittedBy: { type: String } // User ID reference
}, { timestamps: true });

module.exports = mongoose.model('Idea', IdeaSchema);
