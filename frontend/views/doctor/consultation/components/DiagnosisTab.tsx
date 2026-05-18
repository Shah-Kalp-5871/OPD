import React, { useState, useEffect } from 'react';
import { 
  Stethoscope, 
  Search, 
  Plus, 
  X, 
  AlertCircle,
  CheckCircle2,
  Loader2,
  Info,
  ChevronRight,
  BookOpen,
  FileText,
  Target,
  Zap,
  Check,
  ThumbsDown
} from 'lucide-react';
import api from '@/lib/api';
import { aiApi } from '@/lib/api/ai';
import { toast } from 'sonner';
import { Card, Button, TextArea, Input, Badge, SectionHeader } from './ClinicalDesignSystem';

interface DiagnosisTabProps {
  caseId: string;
  data: any;
  onSaved?: (data: any) => void;
}

const DiagnosisTab: React.FC<DiagnosisTabProps> = ({ caseId, data, onSaved }) => {
  const [saving, setSaving] = useState(false);
  const [loadingAi, setLoadingAi] = useState(false);
  const [aiSuggestions, setAiSuggestions] = useState<any>(null);
  
  const [formData, setFormData] = useState({
    provisionalDiagnosis: data?.consultation?.provisionalDiagnosis || '',
    finalDiagnosis: data?.consultation?.finalDiagnosis || '',
    treatmentPlan: data?.consultation?.treatmentPlan || '',
    advice: data?.consultation?.advice || ''
  });

  const chiefComplaint = data?.complaint?.chiefComplaint || '';
  const branchId = data?.case?.branchId || 'default-branch';
  const patientId = data?.case?.patientId || '';

  useEffect(() => {
    if (chiefComplaint) {
      fetchAiSuggestions();
    }
  }, [chiefComplaint]);

  const fetchAiSuggestions = async () => {
    try {
      setLoadingAi(true);
      const res = await aiApi.getClinicalSuggestions({
        caseId,
        patientId,
        branchId,
        chiefComplaint,
        provisionalDiagnosis: formData.provisionalDiagnosis
      });
      if (res && res.data && res.data.suggestions) {
        setAiSuggestions(res.data.suggestions);
      }
    } catch (err) {
      console.error('Failed to load AI suggestions', err);
    } finally {
      setLoadingAi(false);
    }
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      const res = await api.post(`/consultation/${caseId}/save`, formData);
      toast.success('Clinical Diagnosis updated successfully');
      if (onSaved) onSaved(res.data);
    } catch (error) {
      console.error('Save failed', error);
      toast.error('Failed to update clinical record');
    } finally {
      setSaving(false);
    }
  };

  const handleAcceptSuggestion = async (suggestion: any) => {
    // Autofill provisional diagnosis
    setFormData(prev => ({
      ...prev,
      provisionalDiagnosis: prev.provisionalDiagnosis 
        ? `${prev.provisionalDiagnosis}\n- ${suggestion.code}: ${suggestion.disease}`
        : `${suggestion.code}: ${suggestion.disease}`
    }));

    toast.success(`Accepted suggestion: ${suggestion.disease}`);

    // Log outcome immutably
    if (aiSuggestions?.logId) {
      try {
        await aiApi.recordSuggestionOutcome({
          logId: aiSuggestions.logId,
          outcome: 'ACCEPTED',
          reviewNotes: `Accepted disease: ${suggestion.disease}`
        });
      } catch (err) {
        console.error('Failed to log suggestion outcome', err);
      }
    }
  };

  const handleRejectSuggestion = async () => {
    setAiSuggestions(null);
    toast.error('Clinical suggestion rejected');

    if (aiSuggestions?.logId) {
      try {
        await aiApi.recordSuggestionOutcome({
          logId: aiSuggestions.logId,
          outcome: 'REJECTED',
          reviewNotes: 'Physician rejected automated suggestion.'
        });
      } catch (err) {
        console.error('Failed to log rejection', err);
      }
    }
  };

  return (
    <div className="space-y-8 pb-12 overflow-hidden">
      {/* Header Section */}
      <div className="flex items-center justify-between">
        <SectionHeader 
          title="Clinical Assessment & Diagnosis" 
          subtitle="Finalize diagnostic impressions and treatment strategy."
        />
        <Button 
          onClick={handleSave} 
          loading={saving}
          icon={<CheckCircle2 className="w-4 h-4" />}
          className="rounded-2xl px-8 h-12"
        >
          Save Assessment
        </Button>
      </div>

      <div className="grid grid-cols-12 gap-8">
        {/* Main Work Area */}
        <div className="col-span-12 lg:col-span-8 space-y-8">
          {/* Diagnosis Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card 
              className="border-amber-100 hover:border-amber-200"
              title="Provisional Diagnosis"
              subtitle="Initial clinical impression"
            >
              <TextArea 
                value={formData.provisionalDiagnosis}
                onChange={(e) => setFormData({...formData, provisionalDiagnosis: e.target.value})}
                placeholder="Initial findings and diagnostic theory..."
                className="min-h-[140px] bg-amber-50/10 focus:bg-white"
              />
            </Card>

            <Card 
              className="border-blue-100 hover:border-blue-200"
              title="Final Diagnosis"
              subtitle="Confirmed clinical finding"
            >
              <TextArea 
                value={formData.finalDiagnosis}
                onChange={(e) => setFormData({...formData, finalDiagnosis: e.target.value})}
                placeholder="Confirmed diagnosis based on evidence..."
                className="min-h-[140px] bg-blue-50/10 focus:bg-white"
              />
            </Card>
          </div>

          {/* Treatment Plan Section */}
          <Card 
            title="Comprehensive Treatment Plan" 
            subtitle="Outline procedures, therapeutic measures, and specific goals."
            headerAction={<Badge variant="emerald">Treatment Active</Badge>}
          >
            <div className="space-y-6">
              <TextArea 
                label="Therapeutic Strategy & Procedures"
                value={formData.treatmentPlan}
                onChange={(e) => setFormData({...formData, treatmentPlan: e.target.value})}
                placeholder="Detailed surgical, medical or rehabilitative plan..."
                className="min-h-[180px]"
              />
              <TextArea 
                label="Clinical Advice & Red Flags"
                value={formData.advice}
                onChange={(e) => setFormData({...formData, advice: e.target.value})}
                placeholder="Instructions for patient: Diet, lifestyle, warning signs..."
                className="min-h-[100px] italic bg-slate-50 border-dashed"
              />
            </div>
          </Card>
        </div>

        {/* Sidebar Actions */}
        <div className="col-span-12 lg:col-span-4 space-y-6">
          {/* AI DECISION SUPPORT SIDEBAR */}
          <Card 
            title="Clinical Decision Support (CDS)" 
            subtitle="Assistive clinical intelligence"
            className="border-blue-100 shadow-md"
            headerAction={
              loadingAi ? (
                <Loader2 className="w-4 h-4 text-blue-600 animate-spin" />
              ) : (
                <Badge variant="blue" className="bg-blue-50 text-blue-600 border-blue-100">Assistive AI</Badge>
              )
            }
          >
            {loadingAi ? (
              <div className="flex flex-col items-center justify-center py-12 gap-3 text-center">
                <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
                <p className="text-xs font-black text-slate-500 uppercase tracking-wider">Analyzing Chief Complaint...</p>
              </div>
            ) : aiSuggestions?.icd10Suggestions?.length > 0 ? (
              <div className="space-y-5 animate-in fade-in duration-500">
                <div className="p-4 bg-slate-50 border border-slate-200/60 rounded-2xl">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5">Primary Input</p>
                  <p className="text-xs font-bold text-slate-700 italic line-clamp-2">"{chiefComplaint}"</p>
                </div>

                <div className="space-y-3">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Suggested Codes & Diseases</p>
                  
                  {aiSuggestions.icd10Suggestions.map((suggestion: any, index: number) => (
                    <div 
                      key={index}
                      className="group p-4 bg-white border border-slate-200/80 rounded-2xl hover:border-blue-300 hover:shadow-lg transition-all"
                    >
                      <div className="flex items-start justify-between gap-3 mb-2">
                        <div>
                          <span className="inline-block px-2 py-0.5 bg-blue-50 text-blue-700 border border-blue-100 rounded text-[9px] font-black uppercase mb-1">
                            {suggestion.code}
                          </span>
                          <h5 className="text-xs font-black text-slate-800 tracking-tight leading-tight">{suggestion.disease}</h5>
                        </div>
                        <span className={`text-[10px] font-black uppercase tracking-tighter ${
                          suggestion.confidence >= 80 ? 'text-emerald-600' : 'text-blue-600'
                        }`}>
                          {suggestion.confidence}% Conf
                        </span>
                      </div>
                      
                      <p className="text-[10px] font-medium text-slate-500 mb-4 leading-relaxed bg-slate-50 p-2.5 rounded-xl border border-slate-100/50">
                        {suggestion.rationale}
                      </p>

                      <div className="flex items-center gap-2">
                        <Button 
                          onClick={() => handleAcceptSuggestion(suggestion)}
                          variant="outline"
                          size="sm"
                          className="flex-1 rounded-xl h-8 border-slate-200 hover:bg-emerald-50 hover:text-emerald-700 hover:border-emerald-200 font-bold"
                          icon={<Check className="w-3.5 h-3.5" />}
                        >
                          Accept
                        </Button>
                        <Button 
                          onClick={handleRejectSuggestion}
                          variant="ghost"
                          size="sm"
                          className="rounded-xl h-8 text-slate-400 hover:text-rose-600 hover:bg-rose-50 font-bold"
                        >
                          <ThumbsDown className="w-3.5 h-3.5" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="p-3.5 bg-yellow-50/50 border border-yellow-100 rounded-2xl text-[10px] font-medium text-slate-500 leading-relaxed">
                  <span className="font-bold text-yellow-800 block mb-0.5">⚠️ Clinical Safety Mandate:</span>
                  {aiSuggestions.safetyNotes || 'The AI assistant is strictly assistive. Always perform independent physical evaluation before finalizing diagnoses.'}
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-8 text-center bg-slate-50/50 border border-dashed border-slate-200 rounded-2xl">
                <BookOpen className="w-8 h-8 text-slate-300 mb-2" />
                <p className="text-[11px] font-black text-slate-400 uppercase tracking-widest">No Suggestion Available</p>
                <p className="text-[10px] font-medium text-slate-400 mt-1 max-w-[200px]">Document chief complaints to receive AI diagnosis assistance.</p>
              </div>
            )}
          </Card>

          <Card title="Traditional Decision Support" subtitle="Protocols & Reference Lookup">
            <div className="space-y-3">
              <QuickActionItem 
                icon={<Search className="w-4 h-4 text-blue-600" />}
                title="ICD-11 / SNOMED"
                desc="Lookup Global Codes"
              />
              <QuickActionItem 
                icon={<BookOpen className="w-4 h-4 text-indigo-600" />}
                title="Clinical Guidelines"
                desc="Evidence-based Protocols"
              />
              <QuickActionItem 
                icon={<Target className="w-4 h-4 text-emerald-600" />}
                title="Care Pathway"
                desc="Integrated Care Route"
              />
            </div>

            <div className="mt-8 p-5 bg-blue-50/50 rounded-2xl border border-blue-100">
              <div className="flex items-center gap-2 mb-2">
                <Info className="w-4 h-4 text-blue-600" />
                <span className="text-[10px] font-black uppercase text-blue-700">Medical Note</span>
              </div>
              <p className="text-[11px] font-medium text-slate-500 leading-relaxed">
                Diagnostic accuracy is enhanced by correlating vitals and laboratory evidence. Ensure all evidence tabs are reviewed before finalization.
              </p>
            </div>
          </Card>

          <Card className="bg-blue-600 border-none shadow-xl shadow-blue-200">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center">
                <Zap className="text-white w-6 h-6" />
              </div>
              <div>
                <h4 className="text-white font-black text-sm">Case Progress</h4>
                <p className="text-blue-100 text-[10px] font-bold uppercase tracking-widest">Ready for Finalize</p>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between text-[10px] text-white font-black uppercase tracking-tighter">
                <span>Clinical Score</span>
                <span>92%</span>
              </div>
              <div className="h-1.5 bg-white/20 rounded-full overflow-hidden">
                <div className="h-full bg-white w-[92%]" />
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

const QuickActionItem = ({ icon, title, desc }: { icon: any, title: string, desc: string }) => (
  <div className="group flex items-center justify-between p-3.5 bg-white border border-slate-100 rounded-2xl hover:border-blue-200 hover:shadow-md hover:shadow-slate-100 transition-all cursor-pointer active:scale-95">
    <div className="flex items-center gap-4">
      <div className="w-10 h-10 rounded-xl bg-slate-50 group-hover:bg-blue-50 flex items-center justify-center transition-colors">
        {icon}
      </div>
      <div>
        <h5 className="text-xs font-black text-slate-800 tracking-tight">{title}</h5>
        <p className="text-[10px] font-medium text-slate-400">{desc}</p>
      </div>
    </div>
    <ChevronRight className="w-4 h-4 text-slate-200 group-hover:text-blue-500 group-hover:translate-x-1 transition-all" />
  </div>
);

export default DiagnosisTab;

