import axios from 'axios';

const API_URL = 'http://localhost:5001/api';

async function verifyFlow() {
    try {
        console.log('Starting verification flow...');

        // 1. Create/Login Student
        const studentEmail = `student_${Date.now()}@test.com`;
        console.log(`1. Creating student: ${studentEmail}`);
        const studentRes = await axios.post(`${API_URL}/auth/signup`, {
            email: studentEmail,
            password: 'password123',
            type: 'student'
        });
        const studentToken = studentRes.data.token;
        const studentId = studentRes.data.user._id;
        console.log(`   Student created with ID: ${studentId}`);

        // 2. Submit Request
        console.log('2. Submitting student request...');
        const requestPayload = {
            userId: studentId,
            student: {
                name: 'Test Student',
                email: studentEmail,
                university: 'Test Uni',
                major: 'CS',
                year: 'Senior'
            },
            idea: {
                title: 'Test Idea ' + Date.now(),
                description: 'Test Description',
                category: 'Technology',
                fundingNeeded: 10000,
                timeframe: '6 months',
                stage: 'Concept'
            },
            status: 'new',
            priority: 'medium'
        };
        const requestRes = await axios.post(`${API_URL}/students/requests`, requestPayload);
        const requestId = requestRes.data._id;
        console.log(`   Request submitted with ID: ${requestId}`);

        // 3. Create/Login Investor
        const investorEmail = `investor_${Date.now()}@test.com`;
        console.log(`3. Creating investor: ${investorEmail}`);
        const investorRes = await axios.post(`${API_URL}/auth/signup`, {
            email: investorEmail,
            password: 'password123',
            type: 'investor'
        });
        const investorId = investorRes.data.user._id;
        console.log(`   Investor created with ID: ${investorId}`);

        // 4. Schedule Call
        console.log('4. Scheduling call...');
        const callPayload = {
            participants: [studentId, investorId],
            scheduledAt: new Date(Date.now() + 86400000).toISOString(), // Tomorrow
            topic: 'Discuss Test Idea',
            createdBy: investorId
        };
        const callRes = await axios.post(`${API_URL}/calls`, callPayload);
        const callId = callRes.data._id;
        console.log(`   Call scheduled with ID: ${callId}`);

        // 5. Verify Call for Student
        console.log('5. Verifying call visibility for student...');
        const studentCallsRes = await axios.get(`${API_URL}/calls/user/${studentId}`);
        const studentCalls = studentCallsRes.data;

        const foundCall = studentCalls.find(c => c._id === callId);

        if (foundCall) {
            console.log('SUCCESS: Call found in student dashboard!');
            console.log('Call Details:', JSON.stringify(foundCall, null, 2));
        } else {
            console.error('FAILURE: Call NOT found in student dashboard.');
            console.log('Student Calls:', JSON.stringify(studentCalls, null, 2));
            process.exit(1);
        }

    } catch (error) {
        console.error('Verification failed:', error.response ? error.response.data : error.message);
        process.exit(1);
    }
}

verifyFlow();
