'use client';
import { useState } from 'react';

const messages = [
  { id: '1', senderId: 'doc-1', recipientId: 'pat-1', content: 'Hello, how are you feeling after the medication?', type: 'TEXT', createdAt: '10:15 AM', readAt: '10:16 AM' },
  { id: '2', senderId: 'pat-1', recipientId: 'doc-1', content: 'Better, but still some mild headache.', type: 'TEXT', createdAt: '10:18 AM', readAt: null },
  { id: '3', senderId: 'doc-1', recipientId: 'pat-1', content: 'That is expected. Continue the medication and rest well.', type: 'TEXT', createdAt: '10:20 AM', readAt: '10:21 AM' },
];

export default function CommunicationsPage() {
  const [input, setInput] = useState('');
  const [msgs, setMsgs] = useState(messages);
  const meId = 'doc-1';

  const send = () => {
    if (!input.trim()) return;
    setMsgs(prev => [...prev, { id: Date.now().toString(), senderId: meId, recipientId: 'pat-1', content: input, type: 'TEXT', createdAt: 'Now', readAt: null }]);
    setInput('');
  };

  return (
    <div className="min-h-screen bg-gray-950 text-white flex flex-col">
      <header className="border-b border-gray-800 px-8 py-4">
        <h1 className="text-2xl font-bold text-cyan-400">Communication Hub</h1>
        <p className="text-sm text-gray-400">Encrypted Clinical Messaging & Care Team Chat</p>
      </header>
      <div className="flex flex-1 overflow-hidden">
        <aside className="w-64 border-r border-gray-800 p-4 space-y-2">
          {['Patient Mehta (P-001)', 'Nurse Rina', 'Lab Team', 'Dr. Shah (Specialist)'].map((name, i) => (
            <button key={i} className={`w-full text-left px-3 py-2.5 rounded-xl text-sm transition-all ${i === 0 ? 'bg-cyan-900/30 text-cyan-300' : 'hover:bg-gray-800 text-gray-400'}`}>
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-full bg-gray-700 flex items-center justify-center text-xs">{name.charAt(0)}</div>
                <span>{name}</span>
              </div>
            </button>
          ))}
        </aside>
        <div className="flex-1 flex flex-col">
          <div className="flex-1 p-6 space-y-4 overflow-y-auto">
            {msgs.map(msg => (
              <div key={msg.id} className={`flex ${msg.senderId === meId ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-sm rounded-2xl px-4 py-3 ${msg.senderId === meId ? 'bg-cyan-700' : 'bg-gray-800'}`}>
                  <p className="text-sm text-white">{msg.content}</p>
                  <p className="text-xs text-gray-300 mt-1 text-right">{msg.createdAt} {msg.readAt ? '✓✓' : '✓'}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="border-t border-gray-800 p-4 flex gap-3">
            <input value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => e.key === 'Enter' && send()} placeholder="Type a message..." className="flex-1 bg-gray-800 border border-gray-700 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-cyan-500" />
            <button onClick={send} className="bg-cyan-600 hover:bg-cyan-700 px-5 py-2 rounded-xl text-sm font-semibold transition-all">Send</button>
          </div>
        </div>
      </div>
    </div>
  );
}
