// src/components/StudentRequestDetailModal.tsx
import { X, Calendar, DollarSign, Building2, User, Mail, Award } from 'lucide-react';
import { StudentRequest } from './StudentRequests';

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

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4" onClick={onClose}>
            <div className="bg-white rounded-2xl max-w-5xl w-full max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
                {/* Header */}
                <div className="sticky top-0 bg-gradient-to-r from-blue-600 to-purple-600 text-white p-6 rounded-t-2xl">
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
    );
}
