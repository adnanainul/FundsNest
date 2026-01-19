const mongoose = require('mongoose');
const User = require('./models/User'); // Correct local path
require('dotenv').config();

async function resetUser() {
    try {
        await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/fundnest');
        console.log('Connected to MongoDB');

        const email = 'adnan@gmail.com';
        let user = await User.findOne({ email });

        if (user) {
            console.log(`User found: ${user.email}`);
            console.log(`Current Password: ${user.password}`); // Plaintext per auth.js

            user.password = '123456';
            await user.save();
            console.log('Password reset to: 123456');
        } else {
            console.log(`User ${email} not found. Creating new user...`);
            user = new User({
                email: email,
                password: '123456',
                name: 'Adnan',
                type: 'investor' // Default to investor based on screenshot context
            });
            await user.save();
            console.log('Created new user with password: 123456');
        }

        await mongoose.disconnect();
    } catch (err) {
        console.error('Error:', err);
    }
}

resetUser();
