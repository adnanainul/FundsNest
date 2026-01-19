import React, { useEffect, useState } from 'react'
import { io, Socket } from 'socket.io-client'
import { useAuth } from '../hooks/useAuth'
import { Video, X, Check } from 'lucide-react'
import { CommunicationModal, Participant } from './CommunicationModal'

import config from '../config'

const SOCKET_URL = config.socketUrl

export const CallManager: React.FC = () => {
    const { user } = useAuth()
    const [socket, setSocket] = useState<Socket | null>(null)
    const [incomingCall, setIncomingCall] = useState<{
        roomId: string
        callerInfo: { name: string; avatar?: string; id: string }
    } | null>(null)

    const [showCommModal, setShowCommModal] = useState(false)
    const [activeRoomId, setActiveRoomId] = useState('')
    const [activeParticipant, setActiveParticipant] = useState<Participant | null>(null)

    useEffect(() => {
        if (!user) return

        const newSocket = io(SOCKET_URL)
        setSocket(newSocket)

        newSocket.on('connect', () => {
            console.log('CallManager connected to socket')
            newSocket.emit('register', user.id)
        })

        newSocket.on('incoming_call', (data) => {
            console.log('Incoming call received:', data)
            setIncomingCall(data)
            // Play ringtone logic here if desired
        })

        return () => {
            newSocket.disconnect()
        }
    }, [user])

    const handleAcceptCall = () => {
        if (!incomingCall || !socket) return

        socket.emit('call_accepted', {
            toUserId: incomingCall.callerInfo.id,
            roomId: incomingCall.roomId,
            accepterId: user?.id
        })

        setActiveRoomId(incomingCall.roomId)
        setActiveParticipant({
            name: incomingCall.callerInfo.name,
            avatar: incomingCall.callerInfo.avatar,
            id: incomingCall.callerInfo.id
        })
        setShowCommModal(true)
        setIncomingCall(null)
    }

    const handleRejectCall = () => {
        if (!incomingCall || !socket) return

        socket.emit('call_rejected', {
            toUserId: incomingCall.callerInfo.id
        })
        setIncomingCall(null)
    }

    return (
        <>
            {/* Incoming Call Popup */}
            {incomingCall && (
                <div className="fixed top-4 right-4 z-[100] animate-in slide-in-from-top-5 fade-in duration-300">
                    <div className="bg-white rounded-xl shadow-2xl border border-purple-100 p-4 w-80">
                        <div className="flex items-center gap-4 mb-4">
                            <div className="relative">
                                {incomingCall.callerInfo.avatar ? (
                                    <img
                                        src={incomingCall.callerInfo.avatar}
                                        alt={incomingCall.callerInfo.name}
                                        className="w-12 h-12 rounded-full object-cover border-2 border-purple-100"
                                    />
                                ) : (
                                    <div className="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center text-purple-600 font-bold text-lg">
                                        {incomingCall.callerInfo.name.charAt(0).toUpperCase()}
                                    </div>
                                )}
                                <div className="absolute -bottom-1 -right-1 bg-green-500 w-4 h-4 rounded-full border-2 border-white animate-pulse"></div>
                            </div>
                            <div>
                                <h3 className="font-bold text-gray-900">{incomingCall.callerInfo.name}</h3>
                                <p className="text-sm text-purple-600 font-medium flex items-center">
                                    <Video className="w-3 h-3 mr-1" /> Incoming Video Call...
                                </p>
                            </div>
                        </div>

                        <div className="flex gap-3">
                            <button
                                onClick={handleRejectCall}
                                className="flex-1 bg-red-50 text-red-600 py-2 rounded-lg font-medium hover:bg-red-100 transition-colors flex items-center justify-center gap-2"
                            >
                                <X className="w-4 h-4" /> Decline
                            </button>
                            <button
                                onClick={handleAcceptCall}
                                className="flex-1 bg-green-600 text-white py-2 rounded-lg font-medium hover:bg-green-700 transition-colors flex items-center justify-center gap-2 shadow-lg shadow-green-200"
                            >
                                <Check className="w-4 h-4" /> Accept
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Active Call Modal */}
            {showCommModal && activeParticipant && (
                <CommunicationModal
                    visible={showCommModal}
                    onClose={() => {
                        setShowCommModal(false)
                        setActiveParticipant(null)
                        setActiveRoomId('')
                    }}
                    roomId={activeRoomId}
                    participant={activeParticipant}
                    initialMode="video"
                />
            )}
        </>
    )
}
