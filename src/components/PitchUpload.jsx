import React, { useState } from 'react';
import axios from 'axios';
import { Upload, FileText, Video } from 'lucide-react';

const PitchUpload = ({ onAnalysisComplete }) => {
    const [content, setContent] = useState('');
    const [loading, setLoading] = useState(false);

    const handleAnalyze = async () => {
        setLoading(true);
        try {
            const res = await axios.post('http://localhost:5001/api/pitch/analyze', { content });
            onAnalysisComplete(res.data);
        } catch (err) {
            console.error(err);
            alert('Analysis failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <Upload className="w-5 h-5 text-indigo-600" />
                Upload Pitch
            </h3>
            <textarea
                className="w-full p-3 border border-gray-200 rounded-lg mb-4 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                rows="6"
                placeholder="Paste your pitch text or video URL here..."
                value={content}
                onChange={(e) => setContent(e.target.value)}
            />
            <button
                onClick={handleAnalyze}
                disabled={loading || !content}
                className="w-full bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
            >
                {loading ? 'Analyzing...' : (
                    <>
                        <FileText className="w-4 h-4" />
                        Analyze Pitch
                    </>
                )}
            </button>
        </div>
    );
};

export default PitchUpload;
