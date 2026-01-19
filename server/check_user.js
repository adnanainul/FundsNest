const mongoose = require('mongoose');
const User = require('../models/User'); // Adjust path based on server structure
require('dotenv').config();

// Define User Schema if model file not found or complex (fallback)
// const userSchema = new mongoose.Schema({ email: String });
// const User = mongoose.model('User', userSchema);

async function checkUser() {
    try {
        await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/fundnest');
        console.log('Connected to MongoDB');

        const email = 'adnan@gmail.com';
        const user = await User.findOne({ email });

        if (user) {
            console.log(`User found: ${user.email}`);
            console.log(`Role: ${user.role}`);
        } else {
            console.log(`User ${email} NOT found.`);
        }

        const count = await User.countDocuments();
        console.log(`Total users in DB: ${count}`);

        await mongoose.disconnect();
    } catch (err) {
        console.error('Error:', err);
    }
}

checkUser();
