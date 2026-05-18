'use client';
import { useState, useEffect } from 'react';

const MOCK_COPILOT = {
  recentQueries: [
    { id: '1', query: 'What is the first-line treatment for pediatric asthma in our network?', response: 'Based on network protocol doc-101, first-line is inhaled corticosteroids...', timestamp: '2026-05-18T10:15:00Z', citations: [{title: 'Pediatric Asthma Guidelines 2026'}] },
    { id: '2', query: 'Are there any contraindications for drug X with standard hypertension meds?', response: 'Yes, per the latest FDA alert (doc-202), combining drug X with ACE inhibitors increases risk of...', timestamp: '2026-05-18T09:45:00Z', citations: [{title: 'FDA Drug Interactions 2026'}] }
  ],
  docCount: 154
};

export default function KnowledgeCopilotDashboard() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [question, setQuestion] = useState('');

  useEffect(() => {
    setLoading(true);
    setTimeout(() => {
      setData(MOCK_COPILOT);
      setLoading(false);
    }, 600);
  }, []);

  if (loading || !data) {
    return <div className="min-h-screen bg-gray-950 flex items-center justify-center text-white">Initializing Knowledge Copilot...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-950 text-white p-8">
      <header className="mb-8 flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-indigo-400">Knowledge Copilot & RAG</h1>
          <p className="text-sm text-gray-400">AI-Powered Clinical Knowledge Retrieval ({data.docCount} Indexed Documents)</p>
        </div>
        <button className="bg-indigo-600 hover:bg-indigo-700 px-6 py-2 rounded-xl text-sm font-semibold transition-all text-white">
          Manage RAG Documents
        </button>
      </header>

      <div className="grid grid-cols-3 gap-6 h-[70vh]">
        {/* Chat Interface */}
        <div className="col-span-2 bg-gray-900 border border-gray-800 rounded-2xl p-6 flex flex-col">
          <div className="flex-1 overflow-y-auto space-y-6 pr-4 custom-scrollbar">
            {data.recentQueries.map((q: any) => (
              <div key={q.id} className="space-y-4">
                {/* User Query */}
                <div className="flex justify-end">
                  <div className="bg-indigo-900/50 border border-indigo-800 p-4 rounded-xl max-w-[80%] rounded-tr-none">
                    <p className="text-sm text-gray-200">{q.query}</p>
                  </div>
                </div>
                {/* AI Response */}
                <div className="flex justify-start">
                  <div className="bg-gray-800 border border-gray-700 p-4 rounded-xl max-w-[80%] rounded-tl-none relative">
                    <div className="absolute -left-3 top-3 w-6 h-6 bg-indigo-500 rounded-full flex items-center justify-center shadow-lg shadow-indigo-900">✨</div>
                    <p className="text-sm text-gray-300 ml-4 leading-relaxed">{q.response}</p>
                    {q.citations?.length > 0 && (
                      <div className="mt-3 ml-4 pt-3 border-t border-gray-700">
                        <span className="text-xs text-gray-500 block mb-2">Sources Referenced:</span>
                        <div className="flex flex-wrap gap-2">
                          {q.citations.map((cit: any, i: number) => (
                            <span key={i} className="text-[10px] bg-gray-900 text-indigo-300 px-2 py-1 rounded border border-gray-700">
                              📄 {cit.title}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          <div className="mt-6 relative">
            <input 
              type="text" 
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              placeholder="Ask the clinical copilot..."
              className="w-full bg-gray-950 border border-gray-800 rounded-xl px-4 py-4 text-sm text-gray-200 focus:outline-none focus:border-indigo-500 transition-colors pr-16"
            />
            <button className="absolute right-2 top-2 bg-indigo-600 hover:bg-indigo-700 w-10 h-10 rounded-lg flex items-center justify-center text-white transition-all">
              ↑
            </button>
          </div>
        </div>

        {/* Intelligence Side Panel */}
        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
          <h2 className="text-lg font-semibold mb-6 border-b border-gray-800 pb-2 text-gray-200">System Activity</h2>
          
          <div className="space-y-6">
            <div className="bg-gray-950 p-4 rounded-xl border border-gray-800">
              <span className="text-xs text-gray-500 uppercase font-bold tracking-wider mb-2 block">Vector Database</span>
              <div className="flex justify-between items-center text-sm">
                <span className="text-gray-400">Total Embeddings:</span>
                <span className="font-mono text-indigo-400">342,109</span>
              </div>
              <div className="flex justify-between items-center text-sm mt-2">
                <span className="text-gray-400">Sync Status:</span>
                <span className="text-green-400 text-xs">● Live</span>
              </div>
            </div>

            <div>
              <span className="text-xs text-gray-500 uppercase font-bold tracking-wider mb-3 block">Recent RAG Ingestions</span>
              <div className="space-y-3">
                {['Emergency Intubation Proc.', 'Q3 Pharmacy Formulary', 'Telehealth Billing Guide'].map((doc, i) => (
                  <div key={i} className="flex items-center gap-3 bg-gray-800 p-2 rounded-lg text-sm">
                    <span className="text-gray-400 text-xs bg-gray-900 px-2 py-1 rounded font-mono">PDF</span>
                    <span className="text-gray-300 truncate">{doc}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
