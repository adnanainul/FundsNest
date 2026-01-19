import React, { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import { Save, Plus, Trash2, Building2, DollarSign, TrendingUp } from 'lucide-react';
import axios from 'axios';
import { ToastContainer, ToastType } from './Toast';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

interface PortfolioItem {
    startupName: string;
    investedAmount: number;
    returnOnInvestment: number;
    riskCategory: 'Low' | 'Medium' | 'High';
}

interface InvestorProfileData {
    preferences: {
        industries: string[];
        minFunding: number;
        maxFunding: number;
        riskTolerance: 'Low' | 'Medium' | 'High';
    };
    portfolio: PortfolioItem[];
}

export function InvestorProfilePage() {
    const { user } = useAuth();
    const [profile, setProfile] = useState<InvestorProfileData>({
        preferences: {
            industries: [],
            minFunding: 0,
            maxFunding: 0,
            riskTolerance: 'Medium'
        },
        portfolio: []
    });
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [toasts, setToasts] = useState<Array<{ id: string; message: string; type: ToastType }>>([]);

    const addToast = (message: string, type: ToastType) => {
        const id = Math.random().toString(36).substr(2, 9);
        setToasts(prev => [...prev, { id, message, type }]);
    };

    const removeToast = (id: string) => {
        setToasts(prev => prev.filter(t => t.id !== id));
    };

    useEffect(() => {
        if (user) {
            fetchProfile();
        }
    }, [user]);

    const fetchProfile = async () => {
        try {
            const { data } = await axios.get(`http://localhost:5001/api/investor/profile/${user?.id}`);
            if (data) {
                // Fetch analytics separately
                const analyticsRes = await axios.get(`http://localhost:5001/api/investor/${user?.id}/risk`);
                setProfile({ ...data, analytics: analyticsRes.data });
            }
        } catch (error) {
            console.error('Error fetching profile:', error);
            // Don't show error if profile doesn't exist yet
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async () => {
        setSaving(true);
        try {
            await axios.post('http://localhost:5001/api/investor/profile', {
                userId: user?.id,
                ...profile
            });
            addToast('Profile saved successfully', 'success');
        } catch (error) {
            console.error('Error saving profile:', error);
            addToast('Failed to save profile', 'error');
        } finally {
            setSaving(false);
        }
    };

    const addPortfolioItem = () => {
        setProfile(prev => ({
            ...prev,
            portfolio: [
                ...prev.portfolio,
                { startupName: '', investedAmount: 0, returnOnInvestment: 0, riskCategory: 'Medium' }
            ]
        }));
    };

    const removePortfolioItem = (index: number) => {
        setProfile(prev => ({
            ...prev,
            portfolio: prev.portfolio.filter((_, i) => i !== index)
        }));
    };

    const updatePortfolioItem = (index: number, field: keyof PortfolioItem, value: any) => {
        const newPortfolio = [...profile.portfolio];
        newPortfolio[index] = { ...newPortfolio[index], [field]: value };
        setProfile(prev => ({ ...prev, portfolio: newPortfolio }));
    };

    if (loading) return <div className="p-8">Loading...</div>;

    return (
        <div className="p-8 max-w-4xl mx-auto">
            <ToastContainer toasts={toasts} removeToast={removeToast} />

            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold text-gray-900">Investor Profile</h1>
                <button
                    onClick={handleSave}
                    disabled={saving}
                    className="flex items-center px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors disabled:opacity-50"
                >
                    <Save className="w-5 h-5 mr-2" />
                    {saving ? 'Saving...' : 'Save Changes'}
                </button>
            </div>

            {/* Analytics Section */}
            {(profile as any).analytics && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                        <h3 className="text-lg font-semibold mb-4">Portfolio Allocation</h3>
                        <div className="h-64">
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={(profile as any).analytics.industryDistribution || []}
                                        cx="50%"
                                        cy="50%"
                                        innerRadius={60}
                                        outerRadius={80}
                                        fill="#8884d8"
                                        paddingAngle={5}
                                        dataKey="value"
                                    >
                                        {((profile as any).analytics.industryDistribution || []).map((entry: any, index: number) => (
                                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                        ))}
                                    </Pie>
                                    <Tooltip />
                                    <Legend />
                                </PieChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                        <h3 className="text-lg font-semibold mb-4">Risk Profile</h3>
                        <div className="flex items-center justify-center h-64 flex-col">
                            <div className="text-4xl font-bold text-blue-600 mb-2">{(profile as any).analytics.riskScore || 'N/A'}</div>
                            <p className="text-gray-500">Overall Risk Level</p>
                            <div className="mt-4 w-full px-8">
                                <div className="w-full bg-gray-200 rounded-full h-2.5">
                                    <div className={`h-2.5 rounded-full ${(profile as any).analytics.riskScore === 'High' ? 'bg-red-500 w-3/4' :
                                        (profile as any).analytics.riskScore === 'Medium' ? 'bg-yellow-500 w-1/2' :
                                            'bg-green-500 w-1/4'
                                        }`}></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Investment Preferences */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-8">
                <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
                    <Target className="w-6 h-6 mr-2 text-blue-600" />
                    Investment Preferences
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Industries (comma separated)</label>
                        <input
                            type="text"
                            value={profile.preferences.industries.join(', ')}
                            onChange={(e) => setProfile(prev => ({
                                ...prev,
                                preferences: { ...prev.preferences, industries: e.target.value.split(',').map(s => s.trim()) }
                            }))}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder="FinTech, AI, HealthTech"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Risk Tolerance</label>
                        <select
                            value={profile.preferences.riskTolerance}
                            onChange={(e) => setProfile(prev => ({
                                ...prev,
                                preferences: { ...prev.preferences, riskTolerance: e.target.value as any }
                            }))}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        >
                            <option value="Low">Low</option>
                            <option value="Medium">Medium</option>
                            <option value="High">High</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Min Funding ($)</label>
                        <input
                            type="number"
                            value={profile.preferences.minFunding}
                            onChange={(e) => setProfile(prev => ({
                                ...prev,
                                preferences: { ...prev.preferences, minFunding: Number(e.target.value) }
                            }))}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Max Funding ($)</label>
                        <input
                            type="number"
                            value={profile.preferences.maxFunding}
                            onChange={(e) => setProfile(prev => ({
                                ...prev,
                                preferences: { ...prev.preferences, maxFunding: Number(e.target.value) }
                            }))}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                    </div>
                </div>
            </div>

            {/* Portfolio Management */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-bold text-gray-900 flex items-center">
                        <Building2 className="w-6 h-6 mr-2 text-purple-600" />
                        Portfolio Companies
                    </h2>
                    <button
                        onClick={addPortfolioItem}
                        className="flex items-center px-4 py-2 text-sm bg-purple-50 text-purple-600 rounded-lg hover:bg-purple-100 transition-colors"
                    >
                        <Plus className="w-4 h-4 mr-2" />
                        Add Company
                    </button>
                </div>

                <div className="space-y-4">
                    {profile.portfolio.map((item, index) => (
                        <div key={index} className="flex gap-4 items-start p-4 bg-gray-50 rounded-xl border border-gray-200">
                            <div className="flex-1 grid grid-cols-1 md:grid-cols-4 gap-4">
                                <div>
                                    <label className="block text-xs font-medium text-gray-500 mb-1">Startup Name</label>
                                    <input
                                        type="text"
                                        value={item.startupName}
                                        onChange={(e) => updatePortfolioItem(index, 'startupName', e.target.value)}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                                        placeholder="Company Name"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-medium text-gray-500 mb-1">Invested ($)</label>
                                    <input
                                        type="number"
                                        value={item.investedAmount}
                                        onChange={(e) => updatePortfolioItem(index, 'investedAmount', Number(e.target.value))}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-medium text-gray-500 mb-1">ROI (%)</label>
                                    <input
                                        type="number"
                                        value={item.returnOnInvestment}
                                        onChange={(e) => updatePortfolioItem(index, 'returnOnInvestment', Number(e.target.value))}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-medium text-gray-500 mb-1">Risk Category</label>
                                    <select
                                        value={item.riskCategory}
                                        onChange={(e) => updatePortfolioItem(index, 'riskCategory', e.target.value)}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                                    >
                                        <option value="Low">Low</option>
                                        <option value="Medium">Medium</option>
                                        <option value="High">High</option>
                                    </select>
                                </div>
                            </div>
                            <button
                                onClick={() => removePortfolioItem(index)}
                                className="mt-6 p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                            >
                                <Trash2 className="w-5 h-5" />
                            </button>
                        </div>
                    ))}
                    {profile.portfolio.length === 0 && (
                        <p className="text-center text-gray-500 py-8">No portfolio companies added yet.</p>
                    )}
                </div>
            </div>
        </div>
    );
}

import { Target } from 'lucide-react';
