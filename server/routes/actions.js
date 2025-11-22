const express = require('express');
const router = express.Router();

// Mock Send Email
router.post('/email', (req, res) => {
    const { to, subject, body } = req.body;
    console.log(`[Email Service] Sending email to ${to}`);
    console.log(`Subject: ${subject}`);
    console.log(`Body: ${body}`);

    // In a real app, you would use nodemailer or SendGrid here

    res.json({ success: true, message: 'Email sent successfully' });
});

// Mock Schedule Meeting
router.post('/schedule', (req, res) => {
    const { date, notes, withUser } = req.body;
    console.log(`[Calendar Service] Scheduling meeting with ${withUser} on ${date}`);
    console.log(`Notes: ${notes}`);

    // In a real app, you would integrate with Google Calendar or Outlook here

    res.json({ success: true, message: 'Meeting scheduled successfully' });
});

// Mock Invest
router.post('/invest', (req, res) => {
    const { amount, startupId, startupName, message } = req.body;
    console.log(`[Investment Service] Investment of $${amount} in ${startupName} (${startupId})`);
    console.log(`Message: ${message}`);

    // In a real app, this would process payment or create a pledge record

    res.json({ success: true, message: 'Investment initiated successfully' });
});

module.exports = router;
