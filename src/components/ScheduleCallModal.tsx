import React, { useState } from 'react';
import { X, Calendar, Clock, Video } from 'lucide-react';
import axios from 'axios';
import { endpoints } from '../config';
import { useAuth } from '../hooks/useAuth';

interface ScheduleCallModalProps {
    isOpen: boolean;
    onClose: () => void;
    studentId: string;
    studentEmail: string; // Added email prop
    studentName: string;
    ideaTitle: string;
}

export function ScheduleCallModal({ isOpen, onClose, studentId, studentEmail, studentName, ideaTitle }: ScheduleCallModalProps) {
    const { user } = useAuth();
    const [date, setDate] = useState('');
    const [time, setTime] = useState('');
    const [topic, setTopic] = useState(`Discussion: ${ideaTitle}`);
    const [loading, setLoading] = useState(false);

    if (!isOpen) return null;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const scheduledAt = new Date(`${date}T${time}`);

            // Use studentId if available, otherwise fallback to email
            const participant = studentId || studentEmail;

            await axios.post(endpoints.calls, {
                participants: [user?.id, participant],
                scheduledAt,
                topic,
                createdBy: user?.id
            });

            alert('Call scheduled successfully!');
            onClose();
        } catch (error) {
            console.error('Error scheduling call:', error);
            alert('Failed to schedule call.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-[60] flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl animate-in fade-in zoom-in duration-200">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-bold text-gray-900 flex items-center">
                        <Video className="w-6 h-6 mr-2 text-blue-600" />
                        Schedule Video Call
                    </h2>
                    <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
                        <X className="w-6 h-6" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">With</label>
                        <p className="text-gray-900 font-medium">{studentName}</p>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Topic</label>
                        <input
                            type="text"
                            value={topic}
                            onChange={(e) => setTopic(e.target.value)}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            required
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
                            <div className="relative">
                                <Calendar className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                                <input
                                    type="date"
                                    value={date}
                                    onChange={(e) => setDate(e.target.value)}
                                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    required
                                />
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Time</label>
                            <div className="relative">
                                <Clock className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                                <input
                                    type="time"
                                    value={time}
                                    onChange={(e) => setTime(e.target.value)}
                                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    required
                                />
                            </div>
                        </div>
                    </div>

                    <div className="pt-4">
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-blue-600 text-white py-3 rounded-xl font-semibold hover:bg-blue-700 transition-colors disabled:opacity-50 flex items-center justify-center"
                        >
                            {loading ? 'Scheduling...' : 'Schedule Call'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
