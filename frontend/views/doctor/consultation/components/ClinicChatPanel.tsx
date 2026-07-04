import React, { useState, useEffect, useRef } from 'react';
import { MessageCircle, X, Send, User, CheckCheck } from 'lucide-react';
import { format } from 'date-fns';
import api from '@/lib/api';
import { APP_CONFIG } from '@/lib/config';
import { io, Socket } from 'socket.io-client';

interface Message {
  id: string;
  content: string;
  sender: string;
  senderRole?: string;
  senderId: string;
  createdAt: string;
}

interface ClinicChatPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

const ClinicChatPanel: React.FC<ClinicChatPanelProps> = ({ isOpen, onClose }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [message, setMessage] = useState('');
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        setCurrentUserId(payload.sub);
      } catch (e) {
        console.error(e);
      }
    }

    const fetchMessages = async () => {
      try {
        const res = await api.get('/chat');
        setMessages(res.data.reverse()); // usually reverse to show oldest to newest if backend returns newest first
      } catch (err) {
        console.error('Failed to load chat history', err);
      }
    };
    fetchMessages();

    let socket: Socket;
    if (token) {
      socket = io(`${APP_CONFIG.API_BASE_URL}/medflow`, {
        transports: ['websocket'],
      });
      
      socket.on('connect', () => {
        const payload = JSON.parse(atob(token.split('.')[1]));
        socket.emit('authenticate', { userId: payload.sub });
      });

      socket.on('new_message', (data: Message) => {
        setMessages((prev) => [...prev, data]);
      });
    }

    return () => {
      if (socket) socket.disconnect();
    };
  }, []);

  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen]);

  const handleSendMessage = async () => {
    if (!message.trim()) return;
    try {
      await api.post('/chat', { content: message.trim() });
      setMessage('');
    } catch (err) {
      console.error('Failed to send message', err);
    }
  };

  return (
    <>
      {/* Backdrop (Optional, but keeping light so focus remains) */}
      <div 
        className={`absolute inset-0 z-40 transition-opacity duration-300 ${isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`} 
        onClick={onClose}
      />
      
      {/* Chat Widget Popover */}
      <div className={`absolute w-[340px] h-[460px] bg-slate-50 border border-slate-200 rounded-2xl shadow-2xl z-50 bottom-4 left-4 flex flex-col overflow-hidden transition-all origin-bottom-left duration-200 ${isOpen ? 'scale-100 opacity-100' : 'scale-95 opacity-0 pointer-events-none'}`}>
        
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-slate-200 bg-white shadow-sm z-10 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600 border border-blue-100">
              <MessageCircle className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-slate-900 font-extrabold text-sm tracking-tight">Clinic Chat</h3>
              <p className="text-[10px] font-black text-emerald-500 uppercase tracking-widest flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" /> Live Comms
              </p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-slate-100 bg-white border border-slate-200 rounded-xl text-slate-500 transition-colors">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Chat Area */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          <div className="text-center my-4">
            <span className="text-[9px] font-black uppercase tracking-widest text-slate-400 bg-slate-200/50 px-3 py-1 rounded-full">Chat History</span>
          </div>
          
          {messages.map((msg) => {
            const isMe = msg.senderId === currentUserId;
            if (isMe) {
              return (
                <div key={msg.id} className="flex items-end justify-end gap-2">
                  <div className="max-w-[80%] bg-blue-600 rounded-2xl rounded-br-none p-3 shadow-sm text-white">
                    <p className="text-sm">{msg.content}</p>
                    <div className="flex items-center justify-end gap-1 mt-2">
                      <p className="text-[9px] font-medium text-blue-200">{format(new Date(msg.createdAt), 'hh:mm a')}</p>
                      <CheckCheck className="w-3 h-3 text-blue-200" />
                    </div>
                  </div>
                </div>
              );
            }
            return (
              <div key={msg.id} className="flex items-end gap-2">
                <div className="w-6 h-6 rounded-full bg-slate-200 flex items-center justify-center shrink-0">
                  <User className="w-3 h-3 text-slate-500" />
                </div>
                <div className="max-w-[80%] bg-white border border-slate-200 rounded-2xl rounded-bl-none p-3 shadow-sm">
                  <p className="text-[10px] font-bold text-blue-600 mb-1">{msg.sender}</p>
                  <p className="text-sm text-slate-700">{msg.content}</p>
                  <p className="text-[9px] font-bold text-slate-400 mt-2 text-right">{format(new Date(msg.createdAt), 'hh:mm a')}</p>
                </div>
              </div>
            );
          })}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="p-4 bg-white border-t border-slate-200 shrink-0">
          <div className="relative flex items-center">
            <input 
              type="text" 
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Type a message..." 
              className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-3 pl-4 pr-12 text-sm text-slate-700 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  handleSendMessage();
                }
              }}
            />
            <button 
              className="absolute right-2 p-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl transition-colors disabled:opacity-50 disabled:hover:bg-blue-600"
              disabled={!message.trim()}
              onClick={handleSendMessage}
            >
              <Send className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default ClinicChatPanel;
