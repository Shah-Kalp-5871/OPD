import React from 'react';
import { Patient, Vital } from '../../types';
import VitalsCard from '../VitalsCard';
import ProfileSection from '../ProfileSection';

interface MasterChartTabProps {
  patient: Patient;
  latestVitals?: Vital;
  hasOpenCase: boolean;
  onSaveVitals: (vitals: any) => Promise<void>;
  onSaveProfile: (profile: any) => Promise<void>;
  onViewCases: () => void;
}

const MasterChartTab: React.FC<MasterChartTabProps> = ({
  patient,
  latestVitals,
  hasOpenCase,
  onSaveVitals,
  onSaveProfile,
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

      <ProfileSection patient={patient} onSaveProfile={onSaveProfile} />
    </div>
  );
};

export default MasterChartTab;
