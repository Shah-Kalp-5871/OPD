export interface Patient {
  id: string;
  firstName: string;
  lastName: string;
  mobile: string;
  gender: string;
  mrdNumber: string;
  profileCompletionStatus?: number;
  profile?: {
    dob?: string;
    age?: number;
    bloodGroup?: string;
    address?: string;
    city?: string;
    state?: string;
    occupation?: string;
    maritalStatus?: string;
    allergies?: string;
    emergencyContact?: string;
  };
  vitals?: Vital[];
  cases?: Case[];
  documents?: PatientDocument[];
  createdAt?: string;
}

export interface Vital {
  id: string;
  temperature: number;
  pulse: number;
  bloodPressure: string;
  spo2: number;
  weight?: number;
  height?: number;
  bmi?: string;
  takenAt: string;
}

export interface Case {
  id: string;
  caseNumber: string;
  status: 'OPEN' | 'CLOSED';
  createdAt: string;
  complaint?: string;
  doctor?: {
    name: string;
    specialization: string;
  };
}

export interface Alert {
  type: string;
  message: string;
}

export interface PatientDocument {
  id: string;
  patientId: string;
  documentType: string;
  documentNumber?: string;
  fileUrl?: string;
  reportDate?: string;
  labName?: string;
  createdAt: string;
  updatedAt: string;
}
