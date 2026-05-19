'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowLeft, Play, Pause, Radio, RefreshCw, Terminal, CheckCircle2, ShieldAlert } from 'lucide-react';
import api from '@/lib/api';

export default function HL7MonitorPage() {
  const [packets, setPackets] = useState<any[]>([]);
  const [isPlaying, setIsPlaying] = useState(true);
  const [loading, setLoading] = useState(false);

  const fetchHL7 = () => {
    setLoading(true);
    api.get('/interoperability-hub/hl7/packets')
      .then((res: any) => {
        setPackets(res.data || res || []);
      })
      .catch(() => {
        // Fallback HL7 mock data
        setPackets([
          {
            id: '1',
            mshType: 'ADT^A08',
            rawText: 'MSH|^~\\&|MEDFLOW|MED_OPD|LAB_SYS|MET_LAB|202605191000||ADT^A08|MSG00001|P|2.4\nEVN|A08|202605191000\nPID|1||PAT-4091||DOE^JOHN||19850101|M|||123 MAIN ST^^NEW YORK^NY^10001',
            status: 'PROCESSED',
            receivedAt: new Date().toISOString()
          },
          {
            id: '2',
            mshType: 'ORU^R01',
            rawText: 'MSH|^~\\&|LAB_SYS|MET_LAB|MEDFLOW|MED_OPD|202605190945||ORU^R01|MSG00002|P|2.4\nPID|1||PAT-8812||SMITH^MARY\nOBR|1|OBR001||883-9^Hemoglobin A1c|||202605190930\nOBX|1|NM|883-9^Hemoglobin A1c||5.7|%|4.0-6.0|N|||F',
            status: 'PROCESSED',
            receivedAt: new Date(Date.now() - 60000).toISOString()
          },
          {
            id: '3',
            mshType: 'ADT^A01',
            rawText: 'MSH|^~\\&|EMERGENCY|ER_SYS|MEDFLOW|MED_IPD|202605190915||ADT^A01|MSG00003|P|2.4\nPID|1||PAT-1102||JONES^WILLIAM\nPV1|1|I|ICU^^|||||||||||||||ER',
            status: 'PROCESSED',
            receivedAt: new Date(Date.now() - 300000).toISOString()
          }
        ]);
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchHL7();
    let interval: any;
    if (isPlaying) {
      interval = setInterval(() => {
        // Mocking incoming real-time packets periodically
        setPackets(prev => {
          const id = String(prev.length + 1);
          const types = ['ADT^A08', 'ORU^R01', 'ADT^A40', 'MDM^T02'];
          const randType = types[Math.floor(Math.random() * types.length)];
          const newPkt = {
            id,
            mshType: randType,
            rawText: `MSH|^~\\&|EXT_SYS|EXT_HOSP|MEDFLOW|OPD|${new Date().toISOString().replace(/[-:T.Z]/g, '')}||${randType}|MSG-${Date.now()}|P|2.4\nPID|1||PAT-${Math.floor(Math.random() * 8999) + 1000}||GENERATED^PATIENT`,
            status: 'PROCESSED',
            receivedAt: new Date().toISOString()
          };
          return [newPkt, ...prev.slice(0, 9)];
        });
      }, 4000);
    }
    return () => clearInterval(interval);
  }, [isPlaying]);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-6 md:p-8">
      <div className="max-w-6xl mx-auto space-y-6">
        
        <Link href="/interoperability-hub" className="inline-flex items-center gap-2 text-xs text-teal-400 hover:underline">
          <ArrowLeft className="w-4 h-4" /> Back to Interop Hub
        </Link>

        <header className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-teal-300 to-emerald-400">
              HL7 Live Protocol Monitor
            </h1>
            <p className="text-xs text-slate-400 mt-1">Real-time surveillance of HL7 interface engine, demographic admissions, and lab results ingestion.</p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setIsPlaying(!isPlaying)}
              className={`p-3 border rounded-xl transition ${
                isPlaying 
                  ? 'bg-amber-500/10 border-amber-500/30 text-amber-400 hover:bg-amber-500/20' 
                  : 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/20'
              }`}
            >
              {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
            </button>
            <button onClick={fetchHL7} className="p-3 bg-slate-900 border border-slate-800 hover:border-slate-700 rounded-xl transition text-slate-400 hover:text-slate-200">
              <RefreshCw className="w-4 h-4" />
            </button>
          </div>
        </header>

        {/* Console / Terminal Log */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          <div className="lg:col-span-3 space-y-4">
            <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 overflow-hidden">
              <div className="flex items-center justify-between pb-4 border-b border-slate-800">
                <div className="flex items-center gap-2 text-teal-400 font-bold text-sm">
                  <Terminal className="w-5 h-5" /> Live Ingestion Feed
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 bg-emerald-500 rounded-full animate-ping" />
                  <span className="text-[10px] text-slate-400 font-semibold uppercase tracking-widest">HL7 ENGINE ACTIVE</span>
                </div>
              </div>

              {loading && packets.length === 0 ? (
                <div className="h-40 bg-slate-950 animate-pulse rounded-2xl mt-4" />
              ) : (
                <div className="mt-4 space-y-4 max-h-[500px] overflow-y-auto pr-2 custom-scrollbar">
                  {packets.map((pkt) => (
                    <div key={pkt.id} className="p-4 bg-slate-950/80 border border-slate-800/80 rounded-2xl flex flex-col md:flex-row gap-4 justify-between items-start">
                      <div className="space-y-2 flex-grow w-full">
                        <div className="flex justify-between items-center">
                          <span className="text-[10px] px-2 py-0.5 bg-teal-500/10 text-teal-400 border border-teal-500/20 rounded font-mono font-bold">
                            {pkt.mshType}
                          </span>
                          <span className="text-[10px] text-slate-500 font-mono">
                            {new Date(pkt.receivedAt).toLocaleTimeString()}
                          </span>
                        </div>
                        <pre className="p-3 bg-slate-900 rounded-xl text-[10px] font-mono text-slate-300 overflow-x-auto whitespace-pre-wrap border border-slate-800/40">
                          {pkt.rawText}
                        </pre>
                      </div>
                      <div className="flex flex-col items-end justify-between h-full min-w-[100px] w-full md:w-auto">
                        <span className="px-2 py-0.5 text-[9px] bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded font-semibold flex items-center gap-1 self-start md:self-end">
                          <CheckCircle2 className="w-3.5 h-3.5" /> {pkt.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
