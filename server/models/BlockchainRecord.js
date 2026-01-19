const mongoose = require('mongoose');

const BlockchainRecordSchema = new mongoose.Schema({
    hash: { type: String, required: true, unique: true },
    previousHash: { type: String, required: true },
    data: { type: Object, required: true }, // The actual data being verified
    type: { type: String, required: true }, // e.g., 'PITCH_SUBMISSION', 'INVESTMENT_AGREEMENT'
    timestamp: { type: Date, default: Date.now }
});

module.exports = mongoose.model('BlockchainRecord', BlockchainRecordSchema);
