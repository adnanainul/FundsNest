const axios = require('axios');

// Use a placeholder key or environment variable
const AI_API_KEY = process.env.AI_API_KEY || 'YOUR_GEMINI_OR_OPENAI_KEY';
const AI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent'; // Example for Gemini

exports.analyzePitch = async (content) => {
    try {
        // Construct the prompt for the AI
        const prompt = `
            Analyze the following startup pitch and extract structured information.
            Return ONLY a valid JSON object with the following fields:
            - domain (string, e.g., Fintech, HealthTech)
            - problemStatement (string, summary of the problem)
            - proposedSolution (string, summary of the solution)
            - targetMarket (string)
            - fundingRequirement (number, extract value or estimate)
            - equityOffered (number, extract value or estimate)
            - technologies (array of strings)
            - financialProjections (array of objects with year, revenue, profit)
            - riskLevel (string: Low, Medium, High)

            Pitch Content:
            "${content}"
        `;

        // Call the AI API
        // Note: This is a generic structure. Adjust for specific API (OpenAI/Gemini)
        const response = await axios.post(`${AI_API_URL}?key=${AI_API_KEY}`, {
            contents: [{ parts: [{ text: prompt }] }]
        });

        // Parse the response
        const rawText = response.data.candidates[0].content.parts[0].text;

        // Clean up markdown code blocks if present
        const jsonString = rawText.replace(/```json/g, '').replace(/```/g, '').trim();
        const analysis = JSON.parse(jsonString);

        return analysis;

    } catch (error) {
        console.error('AI Analysis Failed:', error.message);
        // Fallback to mock data if API fails (or for demo without key)
        return {
            domain: 'Uncategorized',
            problemStatement: 'Could not analyze content (API Error).',
            technologies: [],
            targetMarket: 'Unknown',
            fundingRequirement: 0,
            equityOffered: 0,
            riskLevel: 'Unknown',
            financialProjections: []
        };
    }
};
