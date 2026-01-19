import React from 'react';
import { CheckCircle, AlertTriangle, TrendingUp } from 'lucide-react';

const AnalysisResult = ({ analysis }) => {
    if (!analysis) return null;

    return (
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 mt-6">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-green-600" />
                AI Analysis Result
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 bg-gray-50 rounded-lg">
                    <span className="text-sm text-gray-500 block">Domain</span>
                    <span className="font-medium text-gray-900">{analysis.domain}</span>
                </div>
                <div className="p-4 bg-gray-50 rounded-lg">
                    <span className="text-sm text-gray-500 block">Target Market</span>
                    <span className="font-medium text-gray-900">{analysis.targetMarket}</span>
                </div>
                <div className="p-4 bg-gray-50 rounded-lg">
                    <span className="text-sm text-gray-500 block">Funding Required</span>
                    <span className="font-medium text-gray-900">${analysis.fundingRequirement?.toLocaleString()}</span>
                </div>
                <div className="p-4 bg-gray-50 rounded-lg">
                    <span className="text-sm text-gray-500 block">Equity Offered</span>
                    <span className="font-medium text-gray-900">{analysis.equityOffered}%</span>
                </div>
                <div className="md:col-span-2 p-4 bg-gray-50 rounded-lg">
                    <span className="text-sm text-gray-500 block">Problem Statement</span>
                    <p className="text-gray-700 mt-1">{analysis.problemStatement}</p>
                </div>
                <div className="md:col-span-2 p-4 bg-gray-50 rounded-lg">
                    <span className="text-sm text-gray-500 block">Technology Stack</span>
                    <div className="flex gap-2 mt-2 flex-wrap">
                        {analysis.technology?.map((tech, i) => (
                            <span key={i} className="px-2 py-1 bg-indigo-100 text-indigo-700 text-xs rounded-full">
                                {tech}
                            </span>
                        ))}
                    </div>
                </div>
                <div className="md:col-span-2 p-4 bg-gray-50 rounded-lg flex items-center justify-between">
                    <span className="text-sm text-gray-500">Risk Assessment</span>
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${analysis.riskLevel === 'Low' ? 'bg-green-100 text-green-700' :
                            analysis.riskLevel === 'Medium' ? 'bg-yellow-100 text-yellow-700' :
                                'bg-red-100 text-red-700'
                        }`}>
                        {analysis.riskLevel} Risk
                    </span>
                </div>
            </div>
        </div>
    );
};

export default AnalysisResult;
