import React, { useState } from 'react';
import PitchUpload from './PitchUpload';
import AnalysisResult from './AnalysisResult';
import InvestorMatch from './InvestorMatch';
import BlockchainBadge from './BlockchainBadge';
import axios from 'axios';

const PitchAnalysisView = () => {
    const [analysis, setAnalysis] = useState(null);
    const [matches, setMatches] = useState([]);
    const [pitchId, setPitchId] = useState(null);
    const [blockchainHash, setBlockchainHash] = useState(null);

    const handleAnalysisComplete = async (analysisData) => {
        setAnalysis(analysisData);
        // Auto-submit for demo purposes to get matches and blockchain record
        try {
            // Mock user ID for demo
            const userId = "65d4c3b2e8b1a9c4d8f7e6a5";
            const res = await axios.post('http://localhost:5001/api/pitch/submit', {
                userId,
                content: "Demo Pitch Content",
                type: "text",
                analysis: analysisData
            });
            setMatches(res.data.matches);
            setPitchId(res.data.pitch._id);

            // Fetch blockchain record
            const chainRes = await axios.get('http://localhost:5001/api/blockchain');
            if (chainRes.data.length > 0) {
                setBlockchainHash(chainRes.data[0].hash);
            }
        } catch (err) {
            console.error("Submission failed", err);
        }
    };

    return (
        <div className="p-8 max-w-7xl mx-auto">
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-2xl font-bold text-gray-900">Pitch Analysis & Investor Matching</h1>
                {blockchainHash && <BlockchainBadge hash={blockchainHash} />}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-1">
                    <PitchUpload onAnalysisComplete={handleAnalysisComplete} />
                </div>
                <div className="lg:col-span-2">
                    {!analysis ? (
                        <div className="bg-white p-12 rounded-xl border border-dashed border-gray-300 text-center text-gray-500">
                            Upload your pitch to see AI analysis and investor matches.
                        </div>
                    ) : (
                        <>
                            <AnalysisResult analysis={analysis} />
                            <InvestorMatch matches={matches} />
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default PitchAnalysisView;
