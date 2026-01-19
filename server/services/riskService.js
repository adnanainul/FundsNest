exports.calculateRisk = (portfolio) => {
    if (!portfolio || portfolio.length === 0) return 'Medium';

    const highRiskInvestments = portfolio.filter(p => p.riskCategory === 'High').length;
    const totalInvestments = portfolio.length;
    const riskRatio = highRiskInvestments / totalInvestments;

    if (riskRatio > 0.7) return 'High';
    if (riskRatio < 0.3) return 'Low';
    return 'Medium';
};
