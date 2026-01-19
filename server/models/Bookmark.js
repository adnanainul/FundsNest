const mongoose = require('mongoose');

const BookmarkSchema = new mongoose.Schema({
    user_id: { type: String, required: true },
    item_type: {
        type: String,
        required: true,
        enum: ['idea', 'startup', 'investor']
    },
    item_id: { type: String, required: true },
    notes: { type: String },
    created_at: { type: Date, default: Date.now }
}, { timestamps: true });

// Create compound index for efficient queries
BookmarkSchema.index({ user_id: 1, item_type: 1 });
BookmarkSchema.index({ user_id: 1, item_id: 1 }, { unique: true });

module.exports = mongoose.model('Bookmark', BookmarkSchema);
