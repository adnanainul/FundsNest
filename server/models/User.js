const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true }, // In real app, hash this!
    name: { type: String },
    type: { type: String, enum: ['investor', 'student', 'startup'], default: 'student' },
    avatar: { type: String }
});

module.exports = mongoose.model('User', userSchema);
