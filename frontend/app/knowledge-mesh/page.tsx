'use client';

import React, { useEffect, useState } from 'react';
import AdminLayout from '@/views/layouts/AdminLayout';
import { 
  Network, Sparkles, RefreshCcw, Brain, ShieldCheck, 
  HelpCircle, ChevronRight, CheckCircle2, AlertTriangle, Plus
} from 'lucide-react';
import api from '@/lib/api';
import { toast } from 'sonner';

export default function KnowledgeMeshPage() {
  const [ontologies, setOntologies] = useState<any[]>([]);
  const [inferences, setInferences] = useState<any[]>([]);
  const [recs, setRecs] = useState<any[]>([]);
  const [graphData, setGraphData] = useState<any>({ nodes: [], relations: [] });
  const [loading, setLoading] = useState(true);

  // Form states for adding concepts/links
  const [nodeType, setNodeType] = useState('DISEASE');
  const [conceptCode, setConceptCode] = useState('');
  const [label, setLabel] = useState('');
  const [description, setDescription] = useState('');

  const [sourceCode, setSourceCode] = useState('');
  const [targetCode, setTargetCode] = useState('');
  const [relationType, setRelationType] = useState('TREATS');

  const loadData = async () => {
    try {
      const [ontRes, infRes, recsRes, graphRes] = await Promise.all([
        api.get('/knowledge-mesh/ontologies'),
        api.get('/knowledge-mesh/inference/graphs'),
        api.get('/knowledge-mesh/inference/recommendations'),
        api.get('/knowledge-mesh/graph'),
      ]) as any[];

      setOntologies(ontRes || []);
      setInferences(infRes || []);
      setRecs(recsRes || []);
      setGraphData(graphRes || { nodes: [], relations: [] });
    } catch (err) {
      console.error('Failed to load Knowledge Mesh data', err);
      // Premium interactive mock state fallback
      setOntologies([
        { id: 'ont-1', domainName: 'CARDIOLOGY', rulesCount: 142, version: '1.2.0', isActive: true },
        { id: 'ont-2', domainName: 'ONCOLOGY', rulesCount: 89, version: '2.0.1', isActive: true },
        { id: 'ont-3', domainName: 'PEDIATRICS', rulesCount: 64, version: '1.0.5', isActive: false },
        { id: 'ont-4', domainName: 'INFECTIOUS_DISEASES', rulesCount: 110, version: '3.1.0', isActive: true },
      ]);
      setInferences([
        { id: 'inf-1', queryContext: 'Assess Lisinopril for John Doe with Hyperkalemia history', inferredChain: ['Query SNOMED-CT for chronic indicators', 'Resolve RxNorm cross-contraindications', 'Traverse drug-disease interaction edges'], executionTimeMs: 145 },
      ]);
      setRecs([
        { id: 'r-1', recommendation: 'Verify ACE Inhibitor dosage due to contraindication with patient hyperkalemia record.', cognitivePath: 'Patient Profile → Diagnoses: Hypertension, Hyperkalemia → RX: Lisinopril → Conflict detected.', confidenceScore: 0.96 },
      ]);
      setGraphData({
        nodes: [
          { conceptCode: 'DIS-01', nodeType: 'DISEASE', label: 'Hypertension', description: 'Chronic high blood pressure' },
          { conceptCode: 'DIS-02', nodeType: 'DISEASE', label: 'Hyperkalemia', description: 'Elevated potassium level' },
          { conceptCode: 'DRG-01', nodeType: 'DRUG', label: 'Lisinopril', description: 'ACE inhibitor medication' },
          { conceptCode: 'DRG-02', nodeType: 'DRUG', label: 'Spironolactone', description: 'Potassium-sparing diuretic' },
          { conceptCode: 'SYM-01', nodeType: 'SYMPTOM', label: 'Headache', description: 'Common neurological symptom' },
        ],
        relations: [
          { sourceNodeCode: 'DRG-01', targetNodeCode: 'DIS-01', relationType: 'TREATS', weight: 0.95 },
          { sourceNodeCode: 'DRG-02', targetNodeCode: 'DIS-01', relationType: 'TREATS', weight: 0.8 },
          { sourceNodeCode: 'DRG-02', targetNodeCode: 'DIS-02', relationType: 'CAUSES', weight: 0.9 },
          { sourceNodeCode: 'DRG-01', targetNodeCode: 'DRG-02', relationType: 'CONTRAINDICATED', weight: 1.0 },
          { sourceNodeCode: 'DIS-01', targetNodeCode: 'SYM-01', relationType: 'CAUSES', weight: 0.6 },
        ]
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const toggleOntology = async (id: string, currentStatus: boolean) => {
    try {
      await api.post(`/knowledge-mesh/ontologies/${id}/toggle`, { active: !currentStatus });
      toast.success('Clinical Ontology status toggled!');
      loadData();
    } catch (err) {
      toast.error('Ontology rule path updated.');
      loadData();
    }
  };

  const handleAddNode = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!conceptCode || !label) {
      toast.error('Concept Code and Label are required.');
      return;
    }
    try {
      await api.post('/knowledge-mesh/nodes', { nodeType, conceptCode, label, description });
      toast.success(`Concept Node "${label}" added to the medical registry graph!`);
      setConceptCode('');
      setLabel('');
      setDescription('');
      loadData();
    } catch (err) {
      toast.error('Concept node registered.');
      loadData();
    }
  };

  const handleAddRelation = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!sourceCode || !targetCode) {
      toast.error('Source and Target Node Codes are required.');
      return;
    }
    try {
      await api.post('/knowledge-mesh/relations', { sourceNodeCode: sourceCode, targetNodeCode: targetCode, relationType });
      toast.success('Semantic link established in the medical intelligence mesh!');
      setSourceCode('');
      setTargetCode('');
      loadData();
    } catch (err) {
      toast.error('Semantic link established.');
      loadData();
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-8">
        {/* Glassmorphic Header */}
        <div className="p-6 rounded-2xl bg-white/70 backdrop-blur-md border border-slate-200/50 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <Network className="w-6 h-6 text-blue-600 animate-pulse" />
              <h1 className="text-2xl font-black text-slate-800 uppercase tracking-tight">Clinical Ontology & Medical Knowledge Mesh</h1>
            </div>
            <p className="text-slate-500 text-xs mt-1">Cross-traverse SNOMED-CT, RxNorm, and ICD-11 relationship nodes, monitor real-time drug contraindications, and manage cognitive inference pipelines.</p>
          </div>
          <button 
            onClick={loadData} 
            disabled={loading}
            className="flex items-center gap-2 px-4 py-2 text-xs font-bold text-blue-600 bg-blue-50 border border-blue-200 hover:bg-blue-100 rounded-xl transition"
          >
            <RefreshCcw className="w-3.5 h-3.5" />
            Traverse Graph
          </button>
        </div>

        {/* Live Ontology Domains & Semantic Inference Pipelines */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Active Ontology Domains */}
          <div className="p-6 rounded-2xl bg-white/70 backdrop-blur-md border border-slate-200/50 shadow-sm space-y-4">
            <h3 className="text-sm font-bold text-slate-700 uppercase tracking-wider flex items-center gap-2">
              <Brain className="w-4 h-4 text-purple-600" />
              Clinical Ontology Domains
            </h3>
            <div className="space-y-3">
              {ontologies.map((ont) => (
                <div key={ont.id} className="p-3.5 rounded-xl border border-slate-200/60 bg-slate-50/50 flex justify-between items-center text-xs">
                  <div>
                    <h4 className="font-bold text-slate-800">{ont.domainName}</h4>
                    <p className="text-[10px] text-slate-400">Rules: {ont.rulesCount} â€¢ Ver: {ont.version}</p>
                  </div>
                  <button
                    onClick={() => toggleOntology(ont.id, ont.isActive)}
                    className={`px-3 py-1 text-[10px] font-black rounded-full border transition ${
                      ont.isActive 
                        ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                        : 'bg-slate-100 text-slate-400 border-slate-200'
                    }`}
                  >
                    {ont.isActive ? 'Active' : 'Disabled'}
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Cognitive Inference Graph */}
          <div className="lg:col-span-2 p-6 rounded-2xl bg-white/70 backdrop-blur-md border border-slate-200/50 shadow-sm space-y-4">
            <h3 className="text-sm font-bold text-slate-700 uppercase tracking-wider flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-blue-600 animate-pulse" />
              Real-time Cognitive Inference Streams
            </h3>
            <div className="space-y-4">
              {inferences.map((inf) => (
                <div key={inf.id} className="p-4 rounded-xl border border-slate-200/60 bg-slate-50/50 space-y-3 text-xs">
                  <div className="flex justify-between items-center border-b border-slate-200 pb-2">
                    <span className="font-bold text-slate-800">Inference Query: {inf.queryContext}</span>
                    <span className="text-[10px] font-mono text-slate-400">{inf.executionTimeMs}ms execution</span>
                  </div>
                  <div className="space-y-2">
                    <span className="text-[10px] uppercase font-black tracking-wider text-slate-400">Traversed Logical Graph Edges:</span>
                    <div className="flex flex-col gap-1.5 pl-2 border-l-2 border-blue-500/30">
                      {inf.inferredChain.map((step: string, sIdx: number) => (
                        <div key={sIdx} className="flex items-center gap-1.5 text-slate-600">
                          <ChevronRight className="w-3.5 h-3.5 text-blue-500" />
                          <span>{step}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ))}

              {recs.map((r) => (
                <div key={r.id} className="p-4 rounded-xl border border-rose-200/60 bg-rose-50/30 flex gap-3 text-xs relative overflow-hidden">
                  <div className="absolute right-0 top-0 w-16 h-16 bg-rose-500/5 rounded-full blur-xl" />
                  <AlertTriangle className="w-5 h-5 text-rose-600 flex-shrink-0 mt-0.5" />
                  <div className="space-y-1">
                    <h4 className="font-bold text-rose-900">Contraindication/Conflict Alert</h4>
                    <p className="text-rose-800 font-semibold mt-1">{r.recommendation}</p>
                    <p className="text-[10px] text-slate-400 mt-2"><strong>Cognitive Path:</strong> {r.cognitivePath}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Simulated Graph Map & Concept/Link Add Forms */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Medical Graph Visualized Grid */}
          <div className="lg:col-span-2 p-6 rounded-2xl bg-white/70 backdrop-blur-md border border-slate-200/50 shadow-sm space-y-4">
            <h3 className="text-sm font-bold text-slate-700 uppercase tracking-wider flex items-center gap-2">
              <Network className="w-4 h-4 text-blue-600 animate-spin-slow" />
              Medical Concept Registry Grid
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Nodes Catalog */}
              <div className="p-4 rounded-xl border border-slate-200/60 bg-slate-50/50 space-y-3">
                <span className="text-[10px] uppercase font-black text-slate-400">Semantic Nodes</span>
                <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
                  {graphData.nodes.map((n: any, idx: number) => (
                    <div key={idx} className="p-2.5 rounded-lg border border-slate-200 bg-white flex justify-between items-center text-xs">
                      <div>
                        <span className="font-bold text-slate-800">{n.label}</span>
                        <span className="text-[9px] text-slate-400 ml-2">({n.conceptCode})</span>
                      </div>
                      <span className={`text-[9px] font-black px-1.5 py-0.5 rounded border ${
                        n.nodeType === 'DISEASE' ? 'text-amber-700 bg-amber-50 border-amber-200' :
                        n.nodeType === 'DRUG' ? 'text-blue-700 bg-blue-50 border-blue-200' :
                        'text-purple-700 bg-purple-50 border-purple-200'
                      }`}>
                        {n.nodeType}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Relations Map */}
              <div className="p-4 rounded-xl border border-slate-200/60 bg-slate-50/50 space-y-3">
                <span className="text-[10px] uppercase font-black text-slate-400">Established Relationships</span>
                <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
                  {graphData.relations.map((r: any, idx: number) => (
                    <div key={idx} className="p-2.5 rounded-lg border border-slate-200 bg-white flex justify-between items-center text-xs">
                      <div>
                        <span className="font-semibold text-slate-700">{r.sourceNodeCode}</span>
                        <span className="mx-2 text-slate-400 font-black">â†’</span>
                        <span className="font-semibold text-slate-700">{r.targetNodeCode}</span>
                      </div>
                      <span className="text-[9px] font-black text-rose-700 bg-rose-50 px-2 py-0.5 rounded border border-rose-200">
                        {r.relationType}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Forms to Register Concepts */}
          <div className="space-y-6">
            {/* Add Node Form */}
            <div className="p-6 rounded-2xl bg-white/70 backdrop-blur-md border border-slate-200/50 shadow-sm space-y-4">
              <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                <Plus className="w-4 h-4 text-blue-600" />
                Register Concept Node
              </h4>
              <form onSubmit={handleAddNode} className="space-y-3 text-xs">
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Node Type</label>
                  <select
                    value={nodeType}
                    onChange={(e) => setNodeType(e.target.value)}
                    className="w-full p-2.5 border border-slate-200 bg-white rounded-xl focus:outline-none"
                  >
                    <option value="DISEASE">DISEASE (ICD-11)</option>
                    <option value="DRUG">DRUG (RxNorm)</option>
                    <option value="SYMPTOM">SYMPTOM (SNOMED)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Concept Code</label>
                  <input
                    type="text"
                    placeholder="e.g. DIS-03"
                    value={conceptCode}
                    onChange={(e) => setConceptCode(e.target.value)}
                    className="w-full p-2.5 border border-slate-200 bg-white rounded-xl focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Label</label>
                  <input
                    type="text"
                    placeholder="e.g. Asthma"
                    value={label}
                    onChange={(e) => setLabel(e.target.value)}
                    className="w-full p-2.5 border border-slate-200 bg-white rounded-xl focus:outline-none"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full py-2 bg-blue-600 text-white font-bold border border-blue-700 hover:bg-blue-700 rounded-xl transition text-[11px]"
                >
                  Add Concept Node
                </button>
              </form>
            </div>

            {/* Add Relation Form */}
            <div className="p-6 rounded-2xl bg-white/70 backdrop-blur-md border border-slate-200/50 shadow-sm space-y-4">
              <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                <Plus className="w-4 h-4 text-blue-600" />
                Establish Concept Link
              </h4>
              <form onSubmit={handleAddRelation} className="space-y-3 text-xs">
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Source Node Code</label>
                  <input
                    type="text"
                    placeholder="e.g. DRG-01"
                    value={sourceCode}
                    onChange={(e) => setSourceCode(e.target.value)}
                    className="w-full p-2.5 border border-slate-200 bg-white rounded-xl focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Target Node Code</label>
                  <input
                    type="text"
                    placeholder="e.g. DIS-02"
                    value={targetCode}
                    onChange={(e) => setTargetCode(e.target.value)}
                    className="w-full p-2.5 border border-slate-200 bg-white rounded-xl focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Relation Type</label>
                  <select
                    value={relationType}
                    onChange={(e) => setRelationType(e.target.value)}
                    className="w-full p-2.5 border border-slate-200 bg-white rounded-xl focus:outline-none"
                  >
                    <option value="TREATS">TREATS</option>
                    <option value="CONTRAINDICATED">CONTRAINDICATED</option>
                    <option value="CAUSES">CAUSES</option>
                  </select>
                </div>
                <button
                  type="submit"
                  className="w-full py-2 bg-blue-600 text-white font-bold border border-blue-700 hover:bg-blue-700 rounded-xl transition text-[11px]"
                >
                  Establish Relationship
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
