const InvestorProfile = require('../models/InvestorProfile');

exports.matchInvestors = async (pitchAnalysis) => {
    const { domain, fundingRequirement, riskLevel } = pitchAnalysis;

    // Find investors interested in the domain and within funding range
    const investors = await InvestorProfile.find({
        'preferences.industries': domain,
        'preferences.minFunding': { $lte: fundingRequirement },
        'preferences.maxFunding': { $gte: fundingRequirement },
        'preferences.riskTolerance': { $in: [riskLevel, 'High'] } // High risk investors accept everything
    }).populate('userId', 'name email avatar');

    return investors;
};
