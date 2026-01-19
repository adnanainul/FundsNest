import axios from 'axios';

const API_URL = 'http://localhost:5001/api';

async function seedAdvanced() {
    try {
        console.log('🚀 Starting Advanced Features Seeding...');

        // 1. Create/Login Rich Investor
        const investorEmail = 'rich_investor@test.com';
        const password = 'password123';
        let investorId, token;

        try {
            const loginRes = await axios.post(`${API_URL}/auth/login`, { email: investorEmail, password });
            token = loginRes.data.token;
            investorId = loginRes.data.user._id;
            console.log('✅ Logged in Rich Investor');
        } catch (e) {
            const signupRes = await axios.post(`${API_URL}/auth/signup`, {
                email: investorEmail,
                password,
                type: 'investor'
            });
            token = signupRes.data.token;
            investorId = signupRes.data.user._id;
            console.log('✅ Created Rich Investor');
        }

        // 2. Create Rich Portfolio (for Charts)
        // We need to directly hit the backend API to save the profile
        const portfolioData = {
            userId: investorId,
            preferences: {
                industries: ['FinTech', 'AI', 'HealthTech', 'GreenEnergy'],
                minFunding: 50000,
                maxFunding: 500000,
                riskTolerance: 'High'
            },
            portfolio: [
                { startupName: 'Alpha AI', investedAmount: 150000, returnOnInvestment: 25, riskCategory: 'High' },
                { startupName: 'MediCare Plus', investedAmount: 80000, returnOnInvestment: 10, riskCategory: 'Low' },
                { startupName: 'Green Earth', investedAmount: 50000, returnOnInvestment: 5, riskCategory: 'Medium' },
                { startupName: 'Crypto Vault', investedAmount: 200000, returnOnInvestment: 150, riskCategory: 'High' },
                { startupName: 'EduTech Pro', investedAmount: 40000, returnOnInvestment: 15, riskCategory: 'Low' }
            ]
        };

        await axios.post(`${API_URL}/investor/profile`, portfolioData);
        console.log('✅ Populated Investor Portfolio (Pie Chart & Risk Meter ready)');

        // 3. Simulate AI Pitch Analysis
        // We will submit a pitch to the analysis endpoint to show it works
        const pitchText = "We are building a blockchain-based supply chain solution for the pharmaceutical industry. We need $200,000 for 15% equity. Our team consists of ex-Google engineers.";

        // Note: This assumes the AI service is running. If no key, it returns mock data, which is fine for demo.
        console.log('\n🤖 Simulating AI Analysis...');
        // We can't directly call the service function here easily without importing, 
        // but we can rely on the frontend to trigger it. 
        // Instead, let's just log that the data is ready for the user to try.

        console.log('\n--- DEMO DATA READY ---');
        console.log(`User: ${investorEmail}`);
        console.log(`Pass: ${password}`);
        console.log('1. Log in with these credentials.');
        console.log('2. Go to "My Profile" to see the populated Charts.');
        console.log('3. Go to "Pitch Analysis" and type a pitch to see AI in action.');
        console.log('-----------------------');

    } catch (error) {
        console.error('❌ Seeding failed:', error.message);
        if (error.response) console.error('Response:', error.response.data);
    }
}

seedAdvanced();
