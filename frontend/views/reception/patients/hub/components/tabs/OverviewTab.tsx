import React from 'react';
import { Patient, Vital } from '../../types';
import VitalsCard from '../VitalsCard';
import VisitSummary from '../VisitSummary';

interface OverviewTabProps {
  patient: Patient;
  latestVitals?: Vital;
  hasOpenCase: boolean;
  onAddVitals: () => void;
  onStartVisit: () => void;
  onViewCases: () => void;
}

const OverviewTab: React.FC<OverviewTabProps> = ({
  patient,
  latestVitals,
  hasOpenCase,
  onAddVitals,
  onStartVisit,
  onViewCases
}) => {
  const activeCase = patient.cases?.find((c: any) => c.status === 'OPEN');

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <VitalsCard latestVitals={latestVitals} onAddVitals={onAddVitals} />
      <VisitSummary 
        hasOpenCase={hasOpenCase} 
        activeCase={activeCase} 
        onStartVisit={onStartVisit} 
        onViewCases={onViewCases} 
      />
    </div>
  );
};

export default OverviewTab;
