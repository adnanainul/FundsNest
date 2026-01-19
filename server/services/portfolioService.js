const InvestorProfile = require('../models/InvestorProfile');

exports.analyzePortfolio = async (userId) => {
    const profile = await InvestorProfile.findOne({ userId });
    if (!profile || !profile.portfolio || profile.portfolio.length === 0) {
        return {
            riskScore: 'N/A',
            industryDistribution: [],
            totalInvested: 0,
            avgROI: 0
        };
    }

    const portfolio = profile.portfolio;
    const totalInvestments = portfolio.length;

    // 1. Industry Distribution (Simulated as we don't have industry in portfolio item, 
    //    but in a real app we'd fetch it from the Startup model. For now, we'll mock it based on names or random)
    //    Ideally, we should populate startup details.
    const industries = {};
    portfolio.forEach(p => {
        // Mock industry derivation
        const industry = p.startupName.includes('Tech') ? 'Technology' :
            p.startupName.includes('Health') ? 'Healthcare' : 'Other';
        industries[industry] = (industries[industry] || 0) + 1;
    });

    const industryDistribution = Object.keys(industries).map(key => ({
        name: key,
        value: industries[key]
    }));

    // 2. Risk Score Calculation
    // Weighted: High = 3, Medium = 2, Low = 1
    let totalRiskPoints = 0;
    portfolio.forEach(p => {
        if (p.riskCategory === 'High') totalRiskPoints += 3;
        else if (p.riskCategory === 'Medium') totalRiskPoints += 2;
        else totalRiskPoints += 1;
    });

    const avgRisk = totalRiskPoints / totalInvestments;
    let riskScore = 'Medium';
    if (avgRisk > 2.5) riskScore = 'High';
    if (avgRisk < 1.5) riskScore = 'Low';

    // 3. ROI
    const totalInvested = portfolio.reduce((sum, p) => sum + (p.investedAmount || 0), 0);
    const avgROI = portfolio.reduce((sum, p) => sum + (p.returnOnInvestment || 0), 0) / totalInvestments;

    return {
        riskScore,
        industryDistribution,
        totalInvested,
        avgROI
    };
};

exports.calculateOpportunityScore = (investorProfile, startupAnalysis) => {
    // Simple matching algorithm
    let score = 50; // Base score

    // Match Industry
    if (investorProfile.preferences.industries.includes(startupAnalysis.domain)) {
        score += 20;
    }

    // Match Risk
    if (investorProfile.preferences.riskTolerance === startupAnalysis.riskLevel) {
        score += 15;
    }

    // Match Funding Range
    if (startupAnalysis.fundingRequirement >= investorProfile.preferences.minFunding &&
        startupAnalysis.fundingRequirement <= investorProfile.preferences.maxFunding) {
        score += 15;
    }

    return Math.min(score, 100);
};
