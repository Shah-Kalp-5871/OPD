import React from 'react';
import { Patient, Vital } from '../../types';
import VitalsCard from '../VitalsCard';

interface MasterChartTabProps {
  patient: Patient;
  latestVitals?: Vital;
  hasOpenCase: boolean;
  onSaveVitals: (vitals: any) => Promise<void>;
  onViewCases: () => void;
}

const MasterChartTab: React.FC<MasterChartTabProps> = ({
  patient,
  latestVitals,
  hasOpenCase,
  onSaveVitals,
  onViewCases
}) => {
  const activeCase = patient.cases?.find((c: any) => c.status === 'OPEN');

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 space-y-8">
      <div className="grid grid-cols-1 gap-8">
        <div className="col-span-1">
          <VitalsCard 
            latestVitals={latestVitals} 
            vitalsHistory={patient.vitals || []} 
            onSaveVitals={onSaveVitals} 
          />
        </div>
      </div>
    </div>
  );
};

export default MasterChartTab;
