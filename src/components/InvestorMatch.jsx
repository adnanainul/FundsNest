import React from 'react';
import { User, DollarSign, Shield } from 'lucide-react';
import RiskGraph from './RiskGraph';

const InvestorMatch = ({ matches }) => {
    if (!matches || matches.length === 0) return null;

    return (
        <div className="mt-8">
            <h3 className="text-xl font-bold mb-4 text-gray-800">Recommended Investors</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {matches.map((investor) => (
                    <div key={investor._id} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                        <div className="flex items-center gap-4 mb-4">
                            <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-600 font-bold">
                                {investor.userId.name.charAt(0)}
                            </div>
                            <div>
                                <h4 className="font-semibold text-gray-900">{investor.userId.name}</h4>
                                <p className="text-sm text-gray-500">{investor.userId.email}</p>
                            </div>
                        </div>

                        <div className="space-y-2 mb-4">
                            <div className="flex justify-between text-sm">
                                <span className="text-gray-500">Min Funding:</span>
                                <span className="font-medium">${investor.preferences.minFunding.toLocaleString()}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-gray-500">Max Funding:</span>
                                <span className="font-medium">${investor.preferences.maxFunding.toLocaleString()}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-gray-500">Risk Tolerance:</span>
                                <span className={`font-medium ${investor.preferences.riskTolerance === 'High' ? 'text-red-600' :
                                        investor.preferences.riskTolerance === 'Medium' ? 'text-yellow-600' :
                                            'text-green-600'
                                    }`}>{investor.preferences.riskTolerance}</span>
                            </div>
                        </div>

                        <div className="border-t pt-4">
                            <h5 className="text-xs font-semibold text-gray-400 uppercase mb-2">Portfolio Risk Analysis</h5>
                            <RiskGraph portfolio={investor.portfolio} />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default InvestorMatch;
