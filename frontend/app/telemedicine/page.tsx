'use client';
import { useState, useEffect, useRef } from 'react';

export default function TelemedicinePage() {
  const [sessions, setSessions] = useState<any[]>([]);
  const [activeSession, setActiveSession] = useState<any>(null);
  const [status, setStatus] = useState<string>('idle');
  const videoRef = useRef<HTMLVideoElement>(null);

  const createSession = async () => {
    setStatus('connecting');
    try {
      const res = await fetch('/api/v2/telemedicine/demo-tenant/sessions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ patientId: 'patient-1', doctorId: 'doctor-1', recordingConsent: true }),
      });
      const session = await res.json();
      setActiveSession(session);
      setStatus('waiting');
    } catch (err) {
      setStatus('error');
    }
  };

  const endSession = async () => {
    if (!activeSession) return;
    setStatus('ending');
    await fetch(`/api/v2/telemedicine/demo-tenant/sessions/${activeSession.id}/end`, { method: 'PATCH' });
    setActiveSession(null);
    setStatus('idle');
  };

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <header className="border-b border-gray-800 px-8 py-4 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-blue-400">MedFlow Telemedicine</h1>
          <p className="text-sm text-gray-400">Enterprise WebRTC Video Consultation</p>
        </div>
        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
          status === 'active' ? 'bg-green-900 text-green-300' :
          status === 'waiting' ? 'bg-yellow-900 text-yellow-300' :
          status === 'connecting' ? 'bg-blue-900 text-blue-300' :
          'bg-gray-800 text-gray-300'
        }`}>
          {status.toUpperCase()}
        </span>
      </header>

      <div className="grid grid-cols-3 gap-6 p-8">
        {/* Main Video Area */}
        <div className="col-span-2">
          <div className="bg-gray-900 rounded-2xl aspect-video flex items-center justify-center relative overflow-hidden border border-gray-800">
            {activeSession ? (
              <>
                <video ref={videoRef} autoPlay muted className="w-full h-full object-cover" />
                <div className="absolute bottom-4 left-4 bg-black/60 backdrop-blur rounded-lg px-3 py-1 text-sm">
                  Room: {activeSession.roomId?.slice(0, 16)}...
                </div>
                <div className="absolute top-4 right-4 w-32 h-24 bg-gray-800 rounded-lg border border-gray-700 flex items-center justify-center">
                  <span className="text-xs text-gray-400">Your Video</span>
                </div>
              </>
            ) : (
              <div className="text-center">
                <div className="w-24 h-24 bg-blue-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-12 h-12 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 10l4.553-2.069A1 1 0 0121 8.87v6.26a1 1 0 01-1.447.894L15 14M3 8a2 2 0 012-2h8a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2V8z" />
                  </svg>
                </div>
                <p className="text-gray-400 text-lg mb-2">No Active Session</p>
                <p className="text-gray-600 text-sm">Start a session to begin video consultation</p>
              </div>
            )}
          </div>

          {/* Controls */}
          <div className="mt-4 flex gap-3 justify-center">
            {!activeSession ? (
              <button onClick={createSession} className="bg-blue-600 hover:bg-blue-700 px-8 py-3 rounded-xl font-semibold transition-all">
                Start Session
              </button>
            ) : (
              <>
                <button className="bg-gray-800 hover:bg-gray-700 px-6 py-3 rounded-xl transition-all flex items-center gap-2">
                  <span>🎤</span> Mute
                </button>
                <button className="bg-gray-800 hover:bg-gray-700 px-6 py-3 rounded-xl transition-all flex items-center gap-2">
                  <span>📷</span> Camera
                </button>
                <button className="bg-gray-800 hover:bg-gray-700 px-6 py-3 rounded-xl transition-all flex items-center gap-2">
                  <span>🖥️</span> Share Screen
                </button>
                <button onClick={endSession} className="bg-red-600 hover:bg-red-700 px-8 py-3 rounded-xl font-semibold transition-all">
                  End Session
                </button>
              </>
            )}
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-4">
          {/* Session Info */}
          {activeSession && (
            <div className="bg-gray-900 border border-gray-800 rounded-2xl p-4">
              <h3 className="font-semibold text-sm text-gray-300 mb-3">Session Details</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between"><span className="text-gray-500">Session ID</span><span className="text-gray-300 font-mono text-xs">{activeSession.id?.slice(0, 8)}</span></div>
                <div className="flex justify-between"><span className="text-gray-500">Recording</span><span className="text-green-400">Consented</span></div>
                <div className="flex justify-between"><span className="text-gray-500">TURN Server</span><span className="text-blue-400">Connected</span></div>
              </div>
            </div>
          )}

          {/* Participants */}
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-4">
            <h3 className="font-semibold text-sm text-gray-300 mb-3">Participants</h3>
            <div className="space-y-2">
              {['Dr. Shah (Host)', 'Patient: Mehta'].map((p, i) => (
                <div key={i} className="flex items-center gap-3 text-sm">
                  <div className="w-8 h-8 rounded-full bg-blue-900 flex items-center justify-center text-xs font-bold">
                    {p.charAt(0)}
                  </div>
                  <span className="text-gray-300">{p}</span>
                  <div className="ml-auto w-2 h-2 rounded-full bg-green-400"></div>
                </div>
              ))}
            </div>
          </div>

          {/* Network Quality */}
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-4">
            <h3 className="font-semibold text-sm text-gray-300 mb-3">Network Quality</h3>
            <div className="flex gap-1">
              {[1, 2, 3, 4, 5].map(i => (
                <div key={i} className={`h-${i + 2} w-4 rounded-sm ${i <= 4 ? 'bg-green-500' : 'bg-gray-700'}`} style={{ height: `${(i + 2) * 4}px` }} />
              ))}
            </div>
            <p className="text-green-400 text-xs mt-2">Excellent (4/5)</p>
          </div>
        </div>
      </div>
    </div>
  );
}
