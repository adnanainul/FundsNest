// src/components/CommunicationModal.tsx
import React, { useEffect, useRef, useState } from 'react'
import { useAuth } from '../hooks/useAuth'
import { Video, MessageCircle, Phone, Mail, X, Send, Mic, MicOff, Camera, CameraOff, Presentation, Timer, ThumbsUp, ThumbsDown } from 'lucide-react'
import { io, Socket } from 'socket.io-client'
import axios from 'axios'

const API_URL = 'http://localhost:5001/api/messages'

type Mode = 'video' | 'chat' | 'schedule' | 'email'

export interface Participant {
  name: string
  email?: string
  avatar?: string
  university?: string
  availability?: string
  id?: string
}

export interface ChatMessage {
  id: string;
  roomId: string;
  senderId: string;
  senderName: string;
  content: string;
  timestamp: number;
}

interface CommunicationModalProps {
  visible: boolean
  onClose: () => void
  roomId: string
  participant: Participant
  initialMode?: Mode
  isInitiator?: boolean // New prop to determine if this user started the call
}

export const CommunicationModal: React.FC<CommunicationModalProps> = ({
  visible,
  onClose,
  roomId,
  participant,
  initialMode = 'video',
  isInitiator = false
}) => {
  const { user } = useAuth()
  const [mode, setMode] = useState<Mode>(initialMode)
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [newMessage, setNewMessage] = useState('')
  const [loadingMessages, setLoadingMessages] = useState(false)

  // Email & Schedule states
  const [emailSubject, setEmailSubject] = useState('')
  const [emailBody, setEmailBody] = useState('')
  const [scheduleDate, setScheduleDate] = useState('')
  const [scheduleNotes, setScheduleNotes] = useState('')
  const [sending, setSending] = useState(false)

  // Pitch Mode States
  const [isPitchMode, setIsPitchMode] = useState(false);
  const [pitchTime, setPitchTime] = useState(300); // 5 minutes
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [feedback, setFeedback] = useState<Array<{ type: 'positive' | 'negative', time: number }>>([]);

  // WebRTC
  const localVideoRef = useRef<HTMLVideoElement | null>(null)
  const remoteVideoRef = useRef<HTMLVideoElement | null>(null)
  const pcRef = useRef<RTCPeerConnection | null>(null)
  const localStreamRef = useRef<MediaStream | null>(null)

  // Socket.io
  const socketRef = useRef<Socket | null>(null)

  // Media controls
  const [isMicOn, setIsMicOn] = useState(true)
  const [isCameraOn, setIsCameraOn] = useState(true)
  const [isInCall, setIsInCall] = useState(false)
  const [callStatus, setCallStatus] = useState<string>('')

  useEffect(() => {
    if (!visible) return
    setMode(initialMode)

    // Fetch initial messages
    fetchMessages()

    // Initialize Socket.io
    socketRef.current = io('http://localhost:5001')
    socketRef.current.emit('join_room', roomId)

    // If we are the initiator and in video mode, send the invite
    if (isInitiator && initialMode === 'video') {
      setCallStatus('Calling...')
      socketRef.current.emit('call_invite', {
        toUserId: participant.id, // Ensure participant has an ID
        roomId,
        callerInfo: {
          name: user?.email?.split('@')[0] || 'User',
          id: user?.id,
          avatar: (user as any)?.user_metadata?.avatar_url
        }
      })
    }

    // Listen for messages
    socketRef.current.on('receive_message', (newMsg: any) => {
      setMessages((prev) => {
        if (prev.some(m => m.id === newMsg._id)) return prev
        return [...prev, {
          id: newMsg._id,
          roomId: newMsg.roomId,
          senderId: newMsg.senderId,
          senderName: newMsg.senderName,
          content: newMsg.content,
          timestamp: new Date(newMsg.timestamp).getTime()
        }]
      })
    })

    // Listen for signaling
    socketRef.current.on('signal', (payload: any) => {
      handleSignalMessage(payload)
    })

    // Listen for call events
    socketRef.current.on('call_accepted', () => {
      setCallStatus('Connected')
      // Peer joined, start the WebRTC flow if we are the initiator
      if (isInitiator) {
        startCallAsCaller()
      }
    })

    socketRef.current.on('call_rejected', () => {
      setCallStatus('Call Rejected')
      setTimeout(() => setCallStatus(''), 3000)
    })

    socketRef.current.on('user_joined', () => {
      console.log('User joined room')
      if (isInitiator) {
        setCallStatus('Connected')
        startCallAsCaller()
      }
    })

    // Initial video setup if mode is video
    if (initialMode === 'video') {
      startLocalMedia()
    }

    return () => {
      cleanupAll()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [visible, roomId])

  // Pitch Timer Effect
  useEffect(() => {
    let interval: any;
    if (isTimerRunning && pitchTime > 0) {
      interval = setInterval(() => {
        setPitchTime((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isTimerRunning, pitchTime]);

  const togglePitchMode = () => {
    setIsPitchMode(!isPitchMode);
    if (!isPitchMode) {
      // Start pitch
      setPitchTime(300);
      setIsTimerRunning(true);
    } else {
      setIsTimerRunning(false);
    }
  };

  const addFeedback = (type: 'positive' | 'negative') => {
    setFeedback(prev => [...prev, { type, time: 300 - pitchTime }]);
    // In a real app, emit this via socket
    if (socketRef.current) {
      socketRef.current.emit('pitch_feedback', { roomId, type, time: 300 - pitchTime });
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const fetchMessages = async () => {
    setLoadingMessages(true)
    try {
      const { data } = await axios.get(`${API_URL}/${roomId}`)

      const mapped: ChatMessage[] = (data || []).map((m: any) => ({
        id: m._id,
        roomId: m.roomId,
        senderId: m.senderId,
        senderName: m.senderName,
        content: m.content,
        timestamp: new Date(m.timestamp).getTime()
      }))
      setMessages(mapped)
    } catch (err) {
      console.error('Failed to fetch messages', err)
    } finally {
      setLoadingMessages(false)
    }
  }

  const sendMessage = async () => {
    if (!newMessage.trim() || !user) return

    const msgContent = newMessage.trim()
    setNewMessage('') // Clear input immediately

    const payload = {
      roomId,
      senderId: user.id,
      senderName: user.email?.split('@')[0] || 'Me',
      content: msgContent
    }

    try {
      await axios.post(API_URL, payload)
      // Socket will handle the update via 'receive_message' event
    } catch (err) {
      console.error('send message error', err)
    }
  }

  // ---- WebRTC signalling handlers ----
  const sendSignal = async (payload: any) => {
    try {
      if (socketRef.current) {
        socketRef.current.emit('signal', {
          roomId,
          payload
        })
      }
    } catch (err) {
      console.error('signal send error', err)
    }
  }

  const handleSignalMessage = async (signal: any) => {
    if (!signal || !signal.type) return
    const pc = pcRef.current

    try {
      if (signal.type === 'offer') {
        // If we receive an offer, we are the callee (or renegotiating)
        setIsInCall(true) // Auto-set in call state
        if (!pc) await createPeerConnection()
        await pcRef.current?.setRemoteDescription(new RTCSessionDescription(signal.sdp))
        const answer = await pcRef.current?.createAnswer()
        await pcRef.current?.setLocalDescription(answer as RTCSessionDescriptionInit)

        sendSignal({
          type: 'answer',
          sdp: pcRef.current?.localDescription
        })
      } else if (signal.type === 'answer') {
        await pcRef.current?.setRemoteDescription(new RTCSessionDescription(signal.sdp))
      } else if (signal.type === 'ice') {
        if (signal.candidate) {
          await pcRef.current?.addIceCandidate(new RTCIceCandidate(signal.candidate))
        }
      }
    } catch (err) {
      console.error('Error handling signal', err)
    }
  }

  const createPeerConnection = async () => {
    if (pcRef.current) return pcRef.current
    const pc = new RTCPeerConnection({
      iceServers: [{ urls: 'stun:stun.l.google.com:19302' }]
    })
    pcRef.current = pc

    if (localStreamRef.current) {
      localStreamRef.current.getTracks().forEach((track) => pc.addTrack(track, localStreamRef.current as MediaStream))
    }

    pc.ontrack = (evt) => {
      if (remoteVideoRef.current) {
        remoteVideoRef.current.srcObject = evt.streams[0]
      }
    }

    pc.onicecandidate = (evt) => {
      if (evt.candidate) {
        sendSignal({
          type: 'ice',
          candidate: evt.candidate
        })
      }
    }

    return pc
  }

  const startLocalMedia = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true })
      localStreamRef.current = stream
      if (localVideoRef.current) localVideoRef.current.srcObject = stream
      setIsCameraOn(true)
      setIsMicOn(true)
    } catch (err) {
      console.error('getUserMedia error', err)
      alert('Could not access camera / mic. Check permissions.')
    }
  }

  const startCallAsCaller = async () => {
    try {
      setIsInCall(true)
      if (!localStreamRef.current) await startLocalMedia()
      await createPeerConnection()

      const offer = await pcRef.current?.createOffer()
      await pcRef.current?.setLocalDescription(offer)

      sendSignal({
        type: 'offer',
        sdp: pcRef.current?.localDescription
      })
    } catch (err) {
      console.error('startCall error', err)
      setIsInCall(false)
    }
  }

  const endCall = () => {
    setIsInCall(false)
    setCallStatus('')
    if (pcRef.current) {
      pcRef.current.close()
      pcRef.current = null
    }
    if (localStreamRef.current) {
      localStreamRef.current.getTracks().forEach((t) => t.stop())
      localStreamRef.current = null
    }
    if (localVideoRef.current) localVideoRef.current.srcObject = null
    if (remoteVideoRef.current) remoteVideoRef.current.srcObject = null
  }

  const toggleMic = () => {
    if (localStreamRef.current) {
      const audioTrack = localStreamRef.current.getAudioTracks()[0]
      if (audioTrack) {
        audioTrack.enabled = !audioTrack.enabled
        setIsMicOn(audioTrack.enabled)
      }
    }
  }

  const toggleCamera = () => {
    if (localStreamRef.current) {
      const videoTrack = localStreamRef.current.getVideoTracks()[0]
      if (videoTrack) {
        videoTrack.enabled = !videoTrack.enabled
        setIsCameraOn(videoTrack.enabled)
      }
    }
  }

  const cleanupAll = async () => {
    try {
      if (socketRef.current) {
        socketRef.current.disconnect()
        socketRef.current = null
      }
    } catch { }
    endCall()
  }

  const handleClose = async () => {
    await cleanupAll()
    onClose()
  }

  const handleSendEmail = async () => {
    if (!emailSubject || !emailBody) return
    setSending(true)
    try {
      // 1. Log to backend
      await axios.post('http://localhost:5001/api/actions/email', {
        to: participant.email || 'test@example.com',
        subject: emailSubject,
        body: emailBody
      })

      // 2. Open default mail client
      const mailtoLink = `mailto:${participant.email || ''}?subject=${encodeURIComponent(emailSubject)}&body=${encodeURIComponent(emailBody)}`
      window.location.href = mailtoLink

      alert('Email client opened! Action logged.')
      setEmailSubject('')
      setEmailBody('')
    } catch (err) {
      console.error('Failed to send email', err)
      alert('Failed to log email action, but opening mail client anyway.')
      // Still open mail client even if backend fails
      const mailtoLink = `mailto:${participant.email || ''}?subject=${encodeURIComponent(emailSubject)}&body=${encodeURIComponent(emailBody)}`
      window.location.href = mailtoLink
    } finally {
      setSending(false)
    }
  }

  const handleSchedule = async () => {
    if (!scheduleDate) return
    setSending(true)
    try {
      // 1. Log to backend
      await axios.post('http://localhost:5001/api/actions/schedule', {
        date: scheduleDate,
        notes: scheduleNotes,
        withUser: participant.name
      })

      // 2. Generate .ics file
      const startDate = new Date(scheduleDate)
      const endDate = new Date(startDate.getTime() + 60 * 60 * 1000) // Default 1 hour duration

      const formatDate = (date: Date) => {
        return date.toISOString().replace(/-|:|\.\d+/g, '')
      }

      const icsContent = [
        'BEGIN:VCALENDAR',
        'VERSION:2.0',
        'PRODID:-//FundNest//Meeting//EN',
        'BEGIN:VEVENT',
        `UID:${Date.now()}@fundnest.com`,
        `DTSTAMP:${formatDate(new Date())}`,
        `DTSTART:${formatDate(startDate)}`,
        `DTEND:${formatDate(endDate)}`,
        `SUMMARY:Meeting with ${participant.name}`,
        `DESCRIPTION:${scheduleNotes}`,
        'END:VEVENT',
        'END:VCALENDAR'
      ].join('\r\n')

      const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' })
      const url = window.URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.setAttribute('download', `meeting-${participant.name.replace(/\s+/g, '-')}.ics`)
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)

      alert('Meeting invite downloaded! Action logged.')
      setScheduleDate('')
      setScheduleNotes('')
    } catch (err) {
      console.error('Failed to schedule meeting', err)
      alert('Failed to log meeting, but downloading invite anyway.')
    } finally {
      setSending(false)
    }
  }

  if (!visible) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black bg-opacity-50" onClick={handleClose}></div>

      <div className="relative w-full max-w-5xl bg-white rounded-2xl shadow-2xl overflow-hidden z-60 flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b bg-white shrink-0">
          <div className="flex items-center gap-4">
            {participant.avatar ? (
              <img src={participant.avatar} alt={participant.name} className="w-12 h-12 rounded-full object-cover" />
            ) : (
              <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-xl">
                {participant.name?.charAt(0)?.toUpperCase()}
              </div>
            )}
            <div>
              <div className="text-lg font-semibold">{participant.name}</div>
              <div className="text-sm text-gray-500">{participant.university || participant.email}</div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* New Pitch Mode Button */}
            <button
              onClick={togglePitchMode}
              className={`px-3 py-2 rounded-lg flex items-center gap-2 transition-colors ${isPitchMode ? 'bg-purple-100 text-purple-700' : 'hover:bg-gray-50 text-gray-600'}`}
            >
              <Presentation className="h-4 w-4" /> <span className="hidden sm:inline">{isPitchMode ? 'Exit Pitch' : 'Pitch Mode'}</span>
            </button>

            <button
              onClick={() => setMode('video')}
              className={`px-3 py-2 rounded-lg flex items-center gap-2 transition-colors ${mode === 'video' ? 'bg-blue-50 text-blue-600' : 'hover:bg-gray-50'}`}
            >
              <Video className="h-4 w-4" /> <span className="hidden sm:inline">Video</span>
            </button>
            <button
              onClick={() => setMode('chat')}
              className={`px-3 py-2 rounded-lg flex items-center gap-2 transition-colors ${mode === 'chat' ? 'bg-blue-50 text-blue-600' : 'hover:bg-gray-50'}`}
            >
              <MessageCircle className="h-4 w-4" /> <span className="hidden sm:inline">Chat</span>
            </button>
            <button
              onClick={() => setMode('schedule')}
              className={`px-3 py-2 rounded-lg flex items-center gap-2 transition-colors ${mode === 'schedule' ? 'bg-blue-50 text-blue-600' : 'hover:bg-gray-50'}`}
            >
              <Phone className="h-4 w-4" /> <span className="hidden sm:inline">Schedule</span>
            </button>
            <button
              onClick={() => setMode('email')}
              className={`px-3 py-2 rounded-lg flex items-center gap-2 transition-colors ${mode === 'email' ? 'bg-blue-50 text-blue-600' : 'hover:bg-gray-50'}`}
            >
              <Mail className="h-4 w-4" /> <span className="hidden sm:inline">Email</span>
            </button>

            <div className="w-px h-6 bg-gray-200 mx-2"></div>

            <button onClick={handleClose} className="p-2 rounded-full hover:bg-gray-100 text-gray-500 hover:text-gray-700">
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-hidden p-0 lg:p-6 bg-gray-50">
          <div className="h-full max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6">

            {/* Left: Video area (Always visible on desktop if in video mode, or just main content) */}
            <div className={`lg:col-span-2 rounded-2xl bg-black overflow-hidden relative flex flex-col ${mode !== 'video' ? 'hidden lg:flex' : 'flex h-full'}`}>
              <div className="flex-1 relative">
                {/* Remote video (Main) */}
                <video ref={remoteVideoRef} autoPlay playsInline className="w-full h-full object-cover bg-gray-900" />

                {/* Local video (PIP) */}
                <div className="absolute bottom-4 right-4 w-32 h-48 sm:w-48 sm:h-36 bg-gray-800 rounded-xl overflow-hidden border-2 border-white/20 shadow-lg">
                  <video ref={localVideoRef} autoPlay playsInline muted className="w-full h-full object-cover transform scale-x-[-1]" />
                </div>

                {/* Pitch Mode Overlay */}
                {isPitchMode && (
                  <div className="absolute top-4 left-4 bg-black/50 backdrop-blur-md text-white px-4 py-2 rounded-lg flex items-center gap-2 border border-white/10 z-20">
                    <Timer className={`h-4 w-4 ${pitchTime < 60 ? 'text-red-500 animate-pulse' : 'text-white'}`} />
                    <span className="font-mono text-lg font-bold">{formatTime(pitchTime)}</span>
                  </div>
                )}

                {/* Feedback Overlay (for presenter) */}
                {isPitchMode && feedback.length > 0 && (
                  <div className="absolute bottom-20 left-4 flex gap-2 z-20">
                    {feedback.slice(-3).map((f, i) => (
                      <div key={i} className={`p-2 rounded-full ${f.type === 'positive' ? 'bg-green-500/80' : 'bg-red-500/80'} text-white animate-in fade-in slide-in-from-bottom-4`}>
                        {f.type === 'positive' ? <ThumbsUp className="h-4 w-4" /> : <ThumbsDown className="h-4 w-4" />}
                      </div>
                    ))}
                  </div>
                )}

                {/* Status overlay */}
                {!isInCall && (
                  <div className="absolute inset-0 flex items-center justify-center bg-black/60 backdrop-blur-sm">
                    <div className="text-center text-white">
                      <div className="w-16 h-16 rounded-full bg-blue-600 flex items-center justify-center mx-auto mb-4">
                        <Video className="h-8 w-8" />
                      </div>
                      <h3 className="text-xl font-semibold mb-2">{callStatus || 'Ready to call?'}</h3>
                      <p className="text-gray-300 mb-6">Start a video call with {participant.name}</p>
                      {!isInitiator && (
                        <button
                          onClick={startCallAsCaller}
                          className="bg-green-500 hover:bg-green-600 text-white px-8 py-3 rounded-full font-medium transition-all transform hover:scale-105"
                        >
                          Start Call
                        </button>
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* Controls Bar */}
              <div className="bg-gray-900 p-4 flex justify-center gap-4 relative">
                <button onClick={toggleMic} className={`p-4 rounded-full ${isMicOn ? 'bg-gray-700 text-white hover:bg-gray-600' : 'bg-red-500 text-white hover:bg-red-600'}`}>
                  {isMicOn ? <Mic className="h-6 w-6" /> : <MicOff className="h-6 w-6" />}
                </button>
                <button onClick={toggleCamera} className={`p-4 rounded-full ${isCameraOn ? 'bg-gray-700 text-white hover:bg-gray-600' : 'bg-red-500 text-white hover:bg-red-600'}`}>
                  {isCameraOn ? <Camera className="h-6 w-6" /> : <CameraOff className="h-6 w-6" />}
                </button>
                {isInCall && (
                  <button onClick={endCall} className="p-4 rounded-full bg-red-600 text-white hover:bg-red-700">
                    <Phone className="h-6 w-6 transform rotate-[135deg]" />
                  </button>
                )}

                {/* Pitch Controls for Investor */}
                {isPitchMode && !isInitiator && (
                  <div className="absolute right-4 top-1/2 transform -translate-y-1/2 flex gap-2">
                    <button onClick={() => addFeedback('positive')} className="p-3 rounded-full bg-gray-800 text-green-400 hover:bg-gray-700 border border-gray-700">
                      <ThumbsUp className="h-5 w-5" />
                    </button>
                    <button onClick={() => addFeedback('negative')} className="p-3 rounded-full bg-gray-800 text-red-400 hover:bg-gray-700 border border-gray-700">
                      <ThumbsDown className="h-5 w-5" />
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Right: Contextual Panel (Chat/Schedule/Email) */}
            <div className={`bg-white rounded-2xl shadow-sm border flex flex-col h-full overflow-hidden ${mode === 'video' ? 'hidden lg:flex' : 'flex'} relative`}>

              {/* Pitch Deck Panel (Simulated) */}
              {isPitchMode && (
                <div className="absolute inset-0 bg-white z-10 flex flex-col">
                  <div className="p-4 border-b flex justify-between items-center">
                    <h3 className="font-bold text-gray-800">Pitch Deck</h3>
                    <button onClick={togglePitchMode} className="text-gray-500 hover:text-gray-700"><X className="h-5 w-5" /></button>
                  </div>
                  <div className="flex-1 bg-gray-100 flex items-center justify-center p-8">
                    <div className="bg-white shadow-xl w-full h-full rounded-lg flex items-center justify-center border border-gray-200">
                      <div className="text-center">
                        <Presentation className="h-16 w-16 text-blue-200 mx-auto mb-4" />
                        <h4 className="text-xl font-bold text-gray-700">Pitch Deck View</h4>
                        <p className="text-gray-500 mt-2">Screen sharing would appear here.</p>
                        <button className="mt-6 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                          Share Screen
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Chat Mode */}
              {(mode === 'chat' || mode === 'video') && (
                <>
                  <div className="p-4 border-b bg-gray-50">
                    <h3 className="font-semibold text-gray-700">Chat</h3>
                  </div>
                  <div className="flex-1 overflow-y-auto p-4 space-y-4">
                    {loadingMessages ? (
                      <div className="flex items-center justify-center h-full">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                      </div>
                    ) : messages.length === 0 ? (
                      <div className="text-center text-gray-400 mt-10">
                        <MessageCircle className="h-12 w-12 mx-auto mb-2 opacity-20" />
                        <p>No messages yet</p>
                      </div>
                    ) : (
                      messages.map((m, idx) => (
                        <div key={m.id || idx} className={`flex flex-col ${m.senderId === user?.id ? 'items-end' : 'items-start'}`}>
                          <div className={`max-w-[85%] p-3 rounded-2xl ${m.senderId === user?.id
                            ? 'bg-blue-600 text-white rounded-tr-none'
                            : 'bg-gray-100 text-gray-800 rounded-tl-none'
                            }`}>
                            <div className="text-sm">{m.content}</div>
                          </div>
                          <span className="text-[10px] text-gray-400 mt-1 px-1">
                            {new Date(m.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </div>
                      ))
                    )}
                  </div>
                  <div className="p-4 border-t bg-white">
                    <div className="flex items-center gap-2">
                      <input
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        onKeyDown={(e) => { if (e.key === 'Enter') sendMessage() }}
                        className="flex-1 px-4 py-2 bg-gray-100 border-0 rounded-full focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all"
                        placeholder="Type a message..."
                      />
                      <button
                        onClick={sendMessage}
                        disabled={!newMessage.trim()}
                        className="p-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                      >
                        <Send className="h-5 w-5" />
                      </button>
                    </div>
                  </div>
                </>
              )}

              {/* Schedule Mode */}
              {mode === 'schedule' && (
                <div className="flex flex-col h-full">
                  <div className="p-4 border-b bg-gray-50">
                    <h3 className="font-semibold text-gray-700">Schedule Meeting</h3>
                  </div>
                  <div className="p-6 flex-1 overflow-y-auto">
                    <div className="space-y-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Date & Time</label>
                        <input
                          type="datetime-local"
                          value={scheduleDate}
                          onChange={(e) => setScheduleDate(e.target.value)}
                          className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Notes</label>
                        <textarea
                          value={scheduleNotes}
                          onChange={(e) => setScheduleNotes(e.target.value)}
                          placeholder="Agenda for the meeting..."
                          className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          rows={4}
                        ></textarea>
                      </div>
                      <div className="bg-blue-50 p-4 rounded-lg">
                        <h4 className="text-sm font-semibold text-blue-800 mb-1">Availability</h4>
                        <p className="text-sm text-blue-600">{participant.availability || 'Mon-Fri, 9AM - 5PM EST'}</p>
                      </div>
                    </div>
                  </div>
                  <div className="p-4 border-t bg-white">
                    <button
                      onClick={handleSchedule}
                      disabled={sending || !scheduleDate}
                      className="w-full bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50 transition-colors"
                    >
                      {sending ? 'Sending Invite...' : 'Send Calendar Invite'}
                    </button>
                  </div>
                </div>
              )}

              {/* Email Mode */}
              {mode === 'email' && (
                <div className="flex flex-col h-full">
                  <div className="p-4 border-b bg-gray-50">
                    <h3 className="font-semibold text-gray-700">Send Email</h3>
                  </div>
                  <div className="p-6 flex-1 overflow-y-auto">
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">To</label>
                        <input value={participant.email} disabled className="w-full px-4 py-2 bg-gray-100 border rounded-lg text-gray-500" />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Subject</label>
                        <input
                          value={emailSubject}
                          onChange={(e) => setEmailSubject(e.target.value)}
                          placeholder="Meeting Request..."
                          className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Message</label>
                        <textarea
                          value={emailBody}
                          onChange={(e) => setEmailBody(e.target.value)}
                          placeholder="Write your message here..."
                          className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          rows={8}
                        ></textarea>
                      </div>
                    </div>
                  </div>
                  <div className="p-4 border-t bg-white flex gap-3">
                    <button
                      onClick={handleSendEmail}
                      disabled={sending || !emailSubject || !emailBody}
                      className="flex-1 bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50 transition-colors"
                    >
                      {sending ? 'Sending...' : 'Send Email'}
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
