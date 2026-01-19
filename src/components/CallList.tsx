import React, { useEffect, useState } from 'react';
import { Video, Calendar, Clock, User } from 'lucide-react';
import axios from 'axios';
import { useAuth } from '../hooks/useAuth';
import { endpoints } from '../config';

interface Call {
    _id: string;
    topic: string;
    scheduledAt: string;
    status: 'scheduled' | 'completed' | 'cancelled';
    participants: Array<{
        _id: string;
        name: string;
        avatar?: string;
    }>;
    roomId: string;
}

import { CommunicationModal, Participant } from './CommunicationModal';

// ... (existing imports)

export function CallList() {
    const { user } = useAuth();
    const [calls, setCalls] = useState<Call[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedCall, setSelectedCall] = useState<Call | null>(null);
    const [modalVisible, setModalVisible] = useState(false);

    useEffect(() => {
        if (user) {
            fetchCalls();
        }
    }, [user]);

    const fetchCalls = async () => {
        try {
            const { data } = await axios.get(`${endpoints.calls}/user/${user?.id}`);
            setCalls(data);
        } catch (error) {
            console.error('Error fetching calls:', error);
        } finally {
            setLoading(false);
        }
    };

    const joinCall = (call: Call) => {
        setSelectedCall(call);
        setModalVisible(true);
    };

    if (loading) return <div className="p-4 text-center text-gray-500">Loading calls...</div>;

    if (calls.length === 0) {
        return (
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 text-center">
                <div className="w-12 h-12 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Video className="w-6 h-6 text-blue-500" />
                </div>
                <h3 className="text-gray-900 font-medium mb-1">No Upcoming Calls</h3>
                <p className="text-gray-500 text-sm">Scheduled video calls will appear here.</p>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
                <Video className="w-5 h-5 mr-2 text-blue-600" />
                Upcoming Calls
            </h2>
            <div className="space-y-4">
                {calls.map((call) => {
                    const otherParticipant = call.participants.find(p => p._id !== user?.id);
                    const date = new Date(call.scheduledAt);

                    return (
                        <div key={call._id} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl border border-gray-200 hover:border-blue-200 transition-colors">
                            <div className="flex items-center gap-4">
                                <div className="flex-shrink-0">
                                    <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold">
                                        {otherParticipant?.name.charAt(0)}
                                    </div>
                                </div>
                                <div>
                                    <h3 className="font-semibold text-gray-900">{call.topic}</h3>
                                    <div className="flex items-center text-sm text-gray-500 mt-1 gap-3">
                                        <span className="flex items-center">
                                            <User className="w-3 h-3 mr-1" />
                                            {otherParticipant?.name}
                                        </span>
                                        <span className="flex items-center">
                                            <Calendar className="w-3 h-3 mr-1" />
                                            {date.toLocaleDateString()}
                                        </span>
                                        <span className="flex items-center">
                                            <Clock className="w-3 h-3 mr-1" />
                                            {date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                        </span>
                                    </div>
                                </div>
                            </div>
                            <button
                                onClick={() => joinCall(call)}
                                className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
                            >
                                Join
                            </button>
                        </div>
                    );
                })}
            </div>

            {selectedCall && modalVisible && (
                <CommunicationModal
                    visible={modalVisible}
                    onClose={() => setModalVisible(false)}
                    roomId={selectedCall.roomId}
                    participant={{
                        name: selectedCall.participants.find(p => p._id !== user?.id)?.name || 'Participant',
                        id: selectedCall.participants.find(p => p._id !== user?.id)?._id,
                        email: '', // Optional, not strictly needed for video
                        avatar: selectedCall.participants.find(p => p._id !== user?.id)?.avatar
                    }}
                    initialMode="video"
                />
            )}
        </div>
    );
}
