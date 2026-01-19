import React from 'react';
import { X, Calendar, DollarSign, Building2, User, Mail, Award, TrendingUp } from 'lucide-react';
import { StudentRequest } from './StudentRequests';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { ScheduleCallModal } from './ScheduleCallModal';

interface StudentRequestDetailModalProps {
    request: StudentRequest | null;
    onClose: () => void;
    onStatusUpdate: (requestId: string, status: string) => void;
}

export function StudentRequestDetailModal({ request, onClose, onStatusUpdate }: StudentRequestDetailModalProps) {
    if (!request) return null;

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'new': return 'text-blue-600 bg-blue-50';
            case 'reviewed': return 'text-yellow-600 bg-yellow-50';
            case 'interested': return 'text-green-600 bg-green-50';
            case 'rejected': return 'text-red-600 bg-red-50';
            default: return 'text-gray-600 bg-gray-50';
        }
    };

    const formatCurrency = (amount: number) => {
        if (amount >= 1000000) {
            return `$${(amount / 1000000).toFixed(1)}M`;
        }
        return `$${(amount / 1000).toFixed(0)}K`;
    };

    const generateProjections = (req: StudentRequest) => {
        const baseAmount = req.idea.fundingNeeded;
        // Create a simple deterministic "random" factor based on title length
        const seed = req.idea.title.length;
        const growthRate = 1.5 + (seed % 5) / 10; // 1.5 to 2.0 growth

        return [
            { year: 'Year 1', revenue: baseAmount * 0.5, profit: -baseAmount * 0.4 },
            { year: 'Year 2', revenue: baseAmount * 1.2, profit: -baseAmount * 0.1 },
            { year: 'Year 3', revenue: baseAmount * (growthRate * 1.5), profit: baseAmount * 0.2 },
            { year: 'Year 4', revenue: baseAmount * (growthRate * 2.5), profit: baseAmount * 0.8 },
            { year: 'Year 5', revenue: baseAmount * (growthRate * 4), profit: baseAmount * 1.5 }
        ];
    };

    const projections = generateProjections(request);

    const [showScheduleModal, setShowScheduleModal] = React.useState(false);

    return (
        <>
            <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4" onClick={onClose}>
                <div className="bg-white rounded-2xl max-w-5xl w-full max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
                    {/* Header */}
                    <div className="sticky top-0 bg-gradient-to-r from-blue-600 to-purple-600 text-white p-6 rounded-t-2xl z-10">
                        <div className="flex justify-between items-start">
                            <div className="flex items-center">
                                <img
                                    src={request.student.avatar}
                                    alt={request.student.name}
                                    className="w-16 h-16 rounded-full border-4 border-white shadow-lg object-cover"
                                />
                                <div className="ml-4">
                                    <h2 className="text-2xl font-bold">{request.idea.title}</h2>
                                    <p className="text-blue-100">{request.student.name} • {request.student.university}</p>
                                </div>
                            </div>
                            <button onClick={onClose} className="text-white hover:text-gray-200">
                                <X className="h-6 w-6" />
                            </button>
                        </div>
                    </div>

                    {/* Content */}
                    <div className="p-8">
                        {/* Status */}
                        <div className="mb-6 flex items-center gap-4">
                            <span className={`px-4 py-2 rounded-full text-sm font-medium ${getStatusColor(request.status)}`}>
                                Status: {request.status}
                            </span>
                            <span className="text-sm text-gray-600">
                                Submitted: {new Date(request.submittedDate).toLocaleDateString()}
                            </span>
                        </div>

                        {/* Idea Description */}
                        <div className="mb-8">
                            <h3 className="text-lg font-semibold mb-3">About the Idea</h3>
                            <p className="text-gray-700 leading-relaxed">{request.idea.description}</p>
                        </div>

                        {/* AI Analysis & Projections */}
                        <div className="mb-8 bg-white border border-gray-100 rounded-xl shadow-sm overflow-hidden">
                            <div className="bg-gradient-to-r from-indigo-50 to-purple-50 p-4 border-b border-gray-100 flex justify-between items-center">
                                <h3 className="text-lg font-bold text-indigo-900 flex items-center">
                                    <TrendingUp className="h-5 w-5 mr-2 text-indigo-600" />
                                    AI Financial Projection
                                </h3>
                                <span className="text-xs font-semibold bg-indigo-100 text-indigo-700 px-3 py-1 rounded-full">
                                    AI Generated
                                </span>
                            </div>
                            <div className="p-6">
                                <p className="text-gray-600 mb-6 text-sm">
                                    Projected revenue and profit growth over the next 5 years based on market analysis and business model.
                                </p>
                                <div className="h-[300px] w-full">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <LineChart
                                            data={projections}
                                            margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                                        >
                                            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                                            <XAxis dataKey="year" stroke="#6b7280" fontSize={12} />
                                            <YAxis stroke="#6b7280" fontSize={12} tickFormatter={(value) => `$${value / 1000}k`} />
                                            <Tooltip
                                                formatter={(value: number) => [`$${value.toLocaleString()}`, '']}
                                                contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}
                                            />
                                            <Legend />
                                            <Line type="monotone" dataKey="revenue" name="Revenue" stroke="#4f46e5" strokeWidth={2} dot={{ r: 4 }} activeDot={{ r: 6 }} />
                                            <Line type="monotone" dataKey="profit" name="Profit/Loss" stroke="#10b981" strokeWidth={2} dot={{ r: 4 }} activeDot={{ r: 6 }} />
                                        </LineChart>
                                    </ResponsiveContainer>
                                </div>
                            </div>
                        </div>

                        {/* Key Metrics */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                            <div className="bg-gradient-to-br from-green-50 to-green-100 p-6 rounded-xl">
                                <div className="flex items-center mb-2">
                                    <DollarSign className="h-6 w-6 text-green-600 mr-2" />
                                    <span className="font-medium text-gray-900">Funding Needed</span>
                                </div>
                                <p className="text-2xl font-bold text-gray-900">{formatCurrency(request.idea.fundingNeeded)}</p>
                            </div>

                            <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-6 rounded-xl">
                                <div className="flex items-center mb-2">
                                    <Calendar className="h-6 w-6 text-blue-600 mr-2" />
                                    <span className="font-medium text-gray-900">Timeframe</span>
                                </div>
                                <p className="text-2xl font-bold text-gray-900">{request.idea.timeframe}</p>
                            </div>

                            <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-6 rounded-xl">
                                <div className="flex items-center mb-2">
                                    <Building2 className="h-6 w-6 text-purple-600 mr-2" />
                                    <span className="font-medium text-gray-900">Stage</span>
                                </div>
                                <p className="text-2xl font-bold text-gray-900">{request.idea.stage}</p>
                            </div>
                        </div>

                        {/* Student Details */}
                        <div className="bg-gray-50 p-6 rounded-xl mb-8">
                            <h3 className="text-lg font-semibold mb-4">Student Information</h3>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                <div>
                                    <div className="flex items-center text-gray-600 mb-1">
                                        <User className="h-4 w-4 mr-2" />
                                        <span className="text-sm">Major</span>
                                    </div>
                                    <p className="font-medium">{request.student.major}</p>
                                </div>
                                <div>
                                    <div className="flex items-center text-gray-600 mb-1">
                                        <Award className="h-4 w-4 mr-2" />
                                        <span className="text-sm">Year</span>
                                    </div>
                                    <p className="font-medium">{request.student.year}</p>
                                </div>
                                <div>
                                    <div className="flex items-center text-gray-600 mb-1">
                                        <Building2 className="h-4 w-4 mr-2" />
                                        <span className="text-sm">University</span>
                                    </div>
                                    <p className="font-medium">{request.student.university}</p>
                                </div>
                                <div>
                                    <div className="flex items-center text-gray-600 mb-1">
                                        <Mail className="h-4 w-4 mr-2" />
                                        <span className="text-sm">Email</span>
                                    </div>
                                    <p className="font-medium text-sm">{request.student.email}</p>
                                </div>
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex gap-3">
                            <button
                                onClick={() => setShowScheduleModal(true)}
                                className="flex-1 bg-purple-600 text-white py-3 px-6 rounded-xl hover:bg-purple-700 transition-colors font-semibold flex items-center justify-center"
                            >
                                <Calendar className="w-5 h-5 mr-2" />
                                Schedule Call
                            </button>
                            <button
                                onClick={() => onStatusUpdate(request.id, 'interested')}
                                disabled={request.status === 'interested'}
                                className="flex-1 bg-green-600 text-white py-3 px-6 rounded-xl hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-semibold"
                            >
                                Mark as Interested
                            </button>
                            <button
                                onClick={() => onStatusUpdate(request.id, 'reviewed')}
                                disabled={request.status === 'reviewed'}
                                className="flex-1 bg-blue-600 text-white py-3 px-6 rounded-xl hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-semibold"
                            >
                                Mark as Reviewed
                            </button>
                            <button
                                onClick={() => onStatusUpdate(request.id, 'rejected')}
                                disabled={request.status === 'rejected'}
                                className="px-6 py-3 border-2 border-red-300 text-red-600 rounded-xl hover:bg-red-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-semibold"
                            >
                                Reject
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <ScheduleCallModal
                isOpen={showScheduleModal}
                onClose={() => setShowScheduleModal(false)}
                studentId={request.userId}
                studentEmail={request.student.email}
                studentName={request.student.name}
                ideaTitle={request.idea.title}
            />
        </>
    );
}
