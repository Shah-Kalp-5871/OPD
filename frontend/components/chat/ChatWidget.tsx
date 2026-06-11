'use client';

import React, { useState, useEffect, useRef } from 'react';
import { MessageCircle, X, Send, Minimize2, Maximize2 } from 'lucide-react';
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

export default function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [unreadCount, setUnreadCount] = useState(0);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Basic user info
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        setCurrentUserId(payload.sub);
      } catch (e) {
        console.error(e);
      }
    }

    fetchMessages();

    // Socket.io connection for chat
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
        if (!isOpen) {
          setUnreadCount((prev) => prev + 1);
        }
      });
    }

    return () => {
      if (socket) socket.disconnect();
    };
  }, [isOpen]);

  useEffect(() => {
    if (isOpen && !isMinimized) {
      scrollToBottom();
      setUnreadCount(0);
    }
  }, [messages, isOpen, isMinimized]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const fetchMessages = async () => {
    try {
      const res = await api.get('/chat');
      const messagesArray = Array.isArray(res.data) ? res.data : (res.data?.data || []);
      setMessages([...messagesArray].reverse()); // Assume backend sends latest first
    } catch (error) {
      console.error('Failed to load messages');
    }
  };

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    try {
      await api.post('/chat', { content: newMessage });
      setNewMessage('');
    } catch (error: any) {
      console.error('Failed to send message', error.response?.data || error.message);
    }
  };

  if (!isOpen) {
    return (
      <button
        onClick={() => { setIsOpen(true); setIsMinimized(false); }}
        className="fixed bottom-6 right-6 w-14 h-14 bg-orange-500 text-white rounded-full shadow-2xl shadow-orange-500/30 flex items-center justify-center hover:bg-orange-600 transition-all z-50 hover:scale-110 active:scale-95"
      >
        <MessageCircle className="w-6 h-6" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 w-5 h-5 bg-rose-500 text-white text-[10px] font-black rounded-full flex items-center justify-center border-2 border-white animate-pulse">
            {unreadCount}
          </span>
        )}
      </button>
    );
  }

  return (
    <div className={`fixed right-6 z-50 bg-white rounded-2xl shadow-2xl shadow-slate-900/10 border border-slate-200 overflow-hidden transition-all duration-300 flex flex-col ${isMinimized ? 'bottom-6 w-72 h-14' : 'bottom-6 w-80 sm:w-96 h-[500px]'}`}>
      
      {/* HEADER */}
      <div 
        className="bg-slate-900 px-4 py-3 flex items-center justify-between cursor-pointer"
        onClick={() => setIsMinimized(!isMinimized)}
      >
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-orange-500/20 rounded-full flex items-center justify-center">
            <MessageCircle className="w-4 h-4 text-orange-400" />
          </div>
          <div>
            <h3 className="text-xs font-black text-white uppercase tracking-widest leading-none">Clinic Chat</h3>
            <p className="text-[9px] font-bold text-orange-400 uppercase tracking-widest mt-1">Live Comms</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button 
            onClick={(e) => { e.stopPropagation(); setIsMinimized(!isMinimized); }}
            className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
          >
            {isMinimized ? <Maximize2 className="w-3.5 h-3.5" /> : <Minimize2 className="w-3.5 h-3.5" />}
          </button>
          <button 
            onClick={(e) => { e.stopPropagation(); setIsOpen(false); }}
            className="p-1.5 text-slate-400 hover:text-rose-400 hover:bg-slate-800 rounded-lg transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* MESSAGES AREA */}
      {!isMinimized && (
        <>
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50">
            {messages.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-slate-400 gap-2 opacity-50">
                <MessageCircle className="w-8 h-8" />
                <p className="text-[10px] font-black uppercase tracking-widest">No messages yet</p>
              </div>
            ) : (
              messages.map((msg, i) => {
                const isMe = msg.senderId === currentUserId;
                return (
                  <div key={msg.id || i} className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}>
                    {!isMe && <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-1 ml-1">{msg.sender} • {msg.senderRole}</span>}
                    <div className={`px-4 py-2 rounded-2xl max-w-[85%] text-sm ${isMe ? 'bg-orange-500 text-white rounded-br-sm' : 'bg-white border border-slate-200 text-slate-700 rounded-bl-sm shadow-sm'}`}>
                      {msg.content}
                    </div>
                    <span className="text-[8px] font-bold text-slate-400 mt-1 uppercase tracking-widest">
                      {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                );
              })
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* INPUT AREA */}
          <div className="p-3 bg-white border-t border-slate-100">
            <form onSubmit={handleSend} className="flex items-center gap-2 relative">
              <input 
                type="text" 
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Type a message..."
                className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-orange-400 focus:bg-white transition-all pr-12"
              />
              <button 
                type="submit"
                disabled={!newMessage.trim()}
                className="absolute right-1.5 p-1.5 bg-orange-500 text-white rounded-lg hover:bg-orange-600 disabled:opacity-50 disabled:hover:bg-orange-500 transition-colors"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </div>
        </>
      )}
    </div>
  );
}
