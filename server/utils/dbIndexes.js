const mongoose = require('mongoose');

// Add indexes for better query performance
async function createIndexes() {
    try {
        const Idea = require('./models/Idea');
        const Startup = require('./models/Startup');
        const StudentRequest = require('./models/StudentRequest');
        const Transaction = require('./models/Transaction');
        const Bookmark = require('./models/Bookmark');

        // Idea indexes
        await Idea.collection.createIndex({ category: 1, stage: 1 });
        await Idea.collection.createIndex({ postedDate: -1 });
        await Idea.collection.createIndex({ featured: 1 });
        await Idea.collection.createIndex({ 'author.name': 'text', title: 'text', description: 'text' });

        // Startup indexes
        await Startup.collection.createIndex({ industry: 1, stage: 1 });
        await Startup.collection.createIndex({ submittedDate: -1 });
        await Startup.collection.createIndex({ status: 1 });

        // StudentRequest indexes
        await StudentRequest.collection.createIndex({ status: 1, priority: 1 });
        await StudentRequest.collection.createIndex({ submittedDate: -1 });

        // Transaction indexes
        await Transaction.collection.createIndex({ user_id: 1, transaction_date: -1 });
        await Transaction.collection.createIndex({ type: 1 });
        await Transaction.collection.createIndex({ transaction_date: -1 });

        // Bookmark indexes (already in model)
        console.log('Database indexes created successfully');
    } catch (err) {
        console.error('Error creating indexes:', err);
    }
}

module.exports = { createIndexes };
