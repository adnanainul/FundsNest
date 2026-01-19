const mongoose = require('mongoose');

const uris = [
    'mongodb://localhost:27017/test',
    'mongodb://127.0.0.1:27017/test',
    'mongodb://0.0.0.0:27017/test',
    'mongodb://[::1]:27017/test'
];

async function testConnection(uri) {
    try {
        console.log(`Testing: ${uri}`);
        await mongoose.connect(uri, { serverSelectionTimeoutMS: 2000 });
        console.log(`SUCCESS: Connected to ${uri}`);
        await mongoose.disconnect();
        return true;
    } catch (err) {
        console.log(`FAILED: ${uri} - ${err.message}`);
        return false;
    }
}

async function runTests() {
    console.log('Starting MongoDB Connection Tests...');
    for (const uri of uris) {
        if (await testConnection(uri)) {
            console.log(`\nFound working URI: ${uri}`);
            process.exit(0);
        }
    }
    console.log('\nAll tests failed. MongoDB might not be running or is on a different port.');
    process.exit(1);
}

runTests();
