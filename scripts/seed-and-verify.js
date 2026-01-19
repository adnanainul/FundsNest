import axios from 'axios';

const API_URL = 'http://localhost:5001/api';

async function seedAndVerify() {
    try {
        console.log('Starting seeding process...');

        // 1. Create/Login Student
        const studentEmail = 'student_demo@test.com';
        const password = 'password123';

        console.log(`1. Setting up student: ${studentEmail}`);
        let studentToken, studentId;

        try {
            const loginRes = await axios.post(`${API_URL}/auth/login`, { email: studentEmail, password });
            studentToken = loginRes.data.token;
            studentId = loginRes.data.user._id;
            console.log('   Logged in existing student.');
        } catch (e) {
            const signupRes = await axios.post(`${API_URL}/auth/signup`, {
                email: studentEmail,
                password,
                type: 'student'
            });
            studentToken = signupRes.data.token;
            studentId = signupRes.data.user._id;
            console.log('   Created new student.');
        }

        // 2. Submit Request
        console.log('2. Submitting student request...');
        const requestPayload = {
            userId: studentId,
            student: {
                name: 'Demo Student',
                email: studentEmail,
                university: 'Demo University',
                major: 'Innovation',
                year: 'Senior'
            },
            idea: {
                title: 'Eco-Friendly Packaging ' + Date.now(),
                description: 'A revolutionary biodegradable packaging solution.',
                category: 'Environmental',
                fundingNeeded: 50000,
                timeframe: '12 months',
                stage: 'Prototype'
            },
            status: 'new',
            priority: 'high'
        };
        const requestRes = await axios.post(`${API_URL}/students/requests`, requestPayload);
        const requestId = requestRes.data._id;
        console.log(`   Request submitted with ID: ${requestId}`);

        // 3. Create/Login Investor
        const investorEmail = 'investor_demo@test.com';
        console.log(`3. Setting up investor: ${investorEmail}`);
        let investorToken, investorId;

        try {
            const loginRes = await axios.post(`${API_URL}/auth/login`, { email: investorEmail, password });
            investorToken = loginRes.data.token;
            investorId = loginRes.data.user._id;
            console.log('   Logged in existing investor.');
        } catch (e) {
            const signupRes = await axios.post(`${API_URL}/auth/signup`, {
                email: investorEmail,
                password,
                type: 'investor'
            });
            investorToken = signupRes.data.token;
            investorId = signupRes.data.user._id;
            console.log('   Created new investor.');
        }

        // 4. Schedule Call
        console.log('4. Scheduling call...');
        const callPayload = {
            participants: [studentId, investorId],
            scheduledAt: new Date(Date.now() + 86400000).toISOString(), // Tomorrow
            topic: 'Investment Discussion - Eco Packaging',
            createdBy: investorId
        };
        const callRes = await axios.post(`${API_URL}/calls`, callPayload);
        const callId = callRes.data._id;
        console.log(`   Call scheduled with ID: ${callId}`);

        console.log('\n--- SEEDING COMPLETE ---');
        console.log('You can now log in to verify:');
        console.log(`Student:  ${studentEmail} / ${password}`);
        console.log(`Investor: ${investorEmail} / ${password}`);
        console.log('------------------------');

    } catch (error) {
        console.error('Seeding failed:', error.response ? error.response.data : error.message);
    }
}

seedAndVerify();
