import React, { useState } from 'react';
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
  Zap
} from 'lucide-react';
import api from '@/lib/api';
import { toast } from 'sonner';
import { Card, Button, TextArea, Input, Badge, SectionHeader } from './ClinicalDesignSystem';

interface DiagnosisTabProps {
  caseId: string;
  data: any;
  onSaved?: (data: any) => void;
}

const DiagnosisTab: React.FC<DiagnosisTabProps> = ({ caseId, data, onSaved }) => {
  const [saving, setSaving] = useState(false);
  
  const [formData, setFormData] = useState({
    provisionalDiagnosis: data?.consultation?.provisionalDiagnosis || '',
    finalDiagnosis: data?.consultation?.finalDiagnosis || '',
    treatmentPlan: data?.consultation?.treatmentPlan || '',
    advice: data?.consultation?.advice || ''
  });

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
          <Card title="Decision Support" subtitle="AI & Protocol assistance">
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
