import { EventEmitter } from 'events';

// Mock types for our service
export interface ChatMessage {
  id: string;
  roomId: string;
  senderId: string;
  senderName: string;
  content: string;
  timestamp: number;
}

export interface SignalMessage {
  type: 'offer' | 'answer' | 'ice' | 'new-peer';
  payload: any;
  senderId: string;
}

class WebSocketService extends EventEmitter {
  private static instance: WebSocketService;
  private connected: boolean = false;
  private currentRoom: string | null = null;
  private mockDelay: number = 500; // Simulate network latency

  private constructor() {
    super();
  }

  public static getInstance(): WebSocketService {
    if (!WebSocketService.instance) {
      WebSocketService.instance = new WebSocketService();
    }
    return WebSocketService.instance;
  }

  public connect(roomId: string): void {
    console.log(`[WebSocket] Connecting to room: ${roomId}`);
    this.currentRoom = roomId;
    this.connected = true;
    
    // Simulate connection success
    setTimeout(() => {
      this.emit('connected', roomId);
      console.log(`[WebSocket] Connected to ${roomId}`);
    }, this.mockDelay);
  }

  public disconnect(): void {
    if (this.currentRoom) {
      console.log(`[WebSocket] Disconnecting from room: ${this.currentRoom}`);
      this.currentRoom = null;
      this.connected = false;
      this.emit('disconnected');
    }
  }

  public sendMessage(message: Omit<ChatMessage, 'id' | 'timestamp'>): void {
    if (!this.connected) {
      console.warn('[WebSocket] Cannot send message: not connected');
      return;
    }

    const fullMessage: ChatMessage = {
      ...message,
      id: Math.random().toString(36).substr(2, 9),
      timestamp: Date.now(),
    };

    // Simulate sending to server and receiving back (echo for now, plus maybe a bot response)
    setTimeout(() => {
      // Emit back to self (to show in UI immediately or after ack)
      this.emit('message', fullMessage);
      
      // Simulate a reply from the "other person" if it's a demo
      this.simulateReply(fullMessage);
    }, this.mockDelay);
  }

  private simulateReply(originalMessage: ChatMessage) {
    // Only reply to user messages to avoid loops
    if (originalMessage.senderId === 'system') return;

    setTimeout(() => {
      const reply: ChatMessage = {
        id: Math.random().toString(36).substr(2, 9),
        roomId: originalMessage.roomId,
        senderId: 'simulated-peer',
        senderName: 'Investor/Student (Bot)',
        content: `I received your message: "${originalMessage.content}"`,
        timestamp: Date.now(),
      };
      this.emit('message', reply);
    }, 2000);
  }

  public sendSignal(signal: Omit<SignalMessage, 'senderId'>): void {
    if (!this.connected) return;

    console.log(`[WebSocket] Sending signal: ${signal.type}`);
    
    // In a real app, this goes to the server and then to the other peer.
    // Here we just log it. For a local video demo, we might need to loopback 
    // if we want to see "remote" video on the same screen, but usually 
    // WebRTC needs two distinct peers. 
    // For this task, we'll assume "functional buttons" means the UI flow works 
    // and signaling events are dispatched.
    
    setTimeout(() => {
      // Echo signal back or simulate a response for testing
      // For example, if we send an 'offer', we could simulate an 'answer'
      if (signal.type === 'offer') {
        this.emit('signal', {
          type: 'answer',
          senderId: 'simulated-peer',
          payload: { type: 'answer', sdp: 'mock-sdp-answer' }
        });
      }
    }, 1000);
  }

  public sendEmail(to: string, subject: string, body: string): Promise<boolean> {
    return new Promise((resolve) => {
      console.log(`[WebSocket] Sending email to ${to}`);
      console.log(`Subject: ${subject}`);
      console.log(`Body: ${body}`);
      
      setTimeout(() => {
        console.log('[WebSocket] Email sent successfully');
        resolve(true);
      }, 1500);
    });
  }

  public scheduleMeeting(details: any): Promise<boolean> {
    return new Promise((resolve) => {
      console.log('[WebSocket] Scheduling meeting:', details);
      setTimeout(() => {
        resolve(true);
      }, 1000);
    });
  }
}

export const webSocketService = WebSocketService.getInstance();
