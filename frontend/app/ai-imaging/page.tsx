'use client';
import { useState, useEffect } from 'react';

const MOCK_IMAGES = [
  { id: 'img-001', modality: 'XRAY', status: 'COMPLETED', time: '10 mins ago', findings: [
    { type: 'FRACTURE', confidence: 0.92, description: 'Possible hairline fracture detected in the distal radius.' }
  ]},
  { id: 'img-002', modality: 'CT', status: 'COMPLETED', time: '1 hour ago', findings: [
    { type: 'NODULE', confidence: 0.88, description: '3mm pulmonary nodule in upper right lobe.' }
  ]},
  { id: 'img-003', modality: 'MRI', status: 'ANALYZING', time: 'Just now', findings: [] }
];

export default function AiImagingDashboard() {
  const [images, setImages] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedImage, setSelectedImage] = useState<any | null>(null);

  useEffect(() => {
    setLoading(true);
    setTimeout(() => {
      setImages(MOCK_IMAGES);
      setSelectedImage(MOCK_IMAGES[0]);
      setLoading(false);
    }, 600);
  }, []);

  return (
    <div className="min-h-screen bg-gray-950 text-white p-8">
      <header className="mb-8 flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-teal-500">AI-Assisted Radiology & Imaging</h1>
          <p className="text-sm text-gray-400">Automated diagnostic inference for DICOM studies</p>
        </div>
        <button className="bg-teal-600 hover:bg-teal-700 px-6 py-2 rounded-xl text-sm font-semibold transition-all">
          Upload DICOM Study
        </button>
      </header>

      <div className="grid grid-cols-3 gap-6">
        {/* Study List */}
        <div className="col-span-1 space-y-4">
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-4 h-[calc(100vh-160px)] overflow-y-auto custom-scrollbar">
            <h2 className="text-lg font-semibold mb-4 text-gray-200">Recent Studies</h2>
            {loading ? (
              <p className="text-gray-500 text-sm">Loading studies...</p>
            ) : (
              <div className="space-y-3">
                {images.map(img => (
                  <button 
                    key={img.id}
                    onClick={() => setSelectedImage(img)}
                    className={`w-full text-left p-3 rounded-xl border transition-all ${
                      selectedImage?.id === img.id ? 'bg-teal-950/40 border-teal-800' : 'bg-gray-950 border-gray-800 hover:border-gray-700'
                    }`}
                  >
                    <div className="flex justify-between items-center mb-2">
                      <span className="font-bold text-gray-300">{img.modality} Study</span>
                      <span className={`text-xs px-2 py-0.5 rounded-full font-bold ${
                        img.status === 'COMPLETED' ? 'bg-green-900 text-green-300' : 'bg-blue-900 text-blue-300 animate-pulse'
                      }`}>
                        {img.status}
                      </span>
                    </div>
                    <p className="text-xs text-gray-500">{img.time} • {img.findings.length} findings</p>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Study Viewer & Findings */}
        <div className="col-span-2 space-y-6">
          {selectedImage ? (
            <div className="grid grid-cols-2 gap-6 h-full">
              {/* Fake Viewer */}
              <div className="bg-black border border-gray-800 rounded-2xl flex flex-col items-center justify-center p-6 h-[calc(100vh-160px)] relative overflow-hidden">
                <div className="absolute top-4 left-4 text-xs font-mono text-gray-500 z-10">
                  <p>Study: {selectedImage.id}</p>
                  <p>Modality: {selectedImage.modality}</p>
                </div>
                
                {selectedImage.status === 'ANALYZING' ? (
                  <div className="flex flex-col items-center gap-4">
                    <div className="w-12 h-12 border-4 border-teal-600/30 border-t-teal-500 rounded-full animate-spin"></div>
                    <p className="text-teal-400 font-mono text-sm animate-pulse">Running Inference Models...</p>
                  </div>
                ) : (
                  <div className="relative w-full h-full flex items-center justify-center opacity-80">
                    <div className="w-64 h-80 bg-gray-800/50 border border-gray-700 rounded-lg flex items-center justify-center">
                      <span className="text-gray-600 text-xl font-bold">{selectedImage.modality}</span>
                    </div>
                    {/* Simulated Bounding Box Overlay */}
                    {selectedImage.findings.length > 0 && (
                      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-24 h-24 border-2 border-red-500 bg-red-500/10 rounded pointer-events-none">
                        <span className="absolute -top-6 left-0 bg-red-500 text-white text-[10px] px-1 font-bold rounded shadow-lg">
                          {selectedImage.findings[0].type} ({(selectedImage.findings[0].confidence * 100).toFixed(0)}%)
                        </span>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Findings Panel */}
              <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 h-[calc(100vh-160px)] overflow-y-auto custom-scrollbar">
                <h2 className="text-lg font-semibold mb-4 text-gray-200">AI Diagnostic Findings</h2>
                {selectedImage.status === 'ANALYZING' ? (
                  <p className="text-gray-500 text-sm">Awaiting AI inference results...</p>
                ) : selectedImage.findings.length === 0 ? (
                  <p className="text-gray-500 text-sm">No critical findings detected by AI.</p>
                ) : (
                  <div className="space-y-4">
                    {selectedImage.findings.map((f: any, idx: number) => (
                      <div key={idx} className="bg-gray-950 border border-gray-800 p-4 rounded-xl">
                        <div className="flex justify-between items-start mb-2">
                          <h3 className="font-bold text-red-400">{f.type}</h3>
                          <span className="text-xs bg-gray-800 text-gray-300 px-2 py-1 rounded-md font-mono">
                            Conf: {(f.confidence * 100).toFixed(1)}%
                          </span>
                        </div>
                        <p className="text-sm text-gray-300 mb-4">{f.description}</p>
                        
                        <div className="flex gap-2">
                          <button className="flex-1 bg-teal-900/50 hover:bg-teal-900 text-teal-300 text-xs py-2 rounded-lg transition-colors">
                            Verify & Approve
                          </button>
                          <button className="flex-1 bg-red-900/50 hover:bg-red-900 text-red-300 text-xs py-2 rounded-lg transition-colors">
                            Reject Finding
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="bg-gray-900 border border-gray-800 rounded-2xl flex items-center justify-center h-[calc(100vh-160px)] text-gray-500">
              Select a study to view details.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
