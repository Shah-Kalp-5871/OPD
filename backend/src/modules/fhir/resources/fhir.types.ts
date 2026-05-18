export interface FhirMeta {
  versionId?: string;
  lastUpdated?: string;
  source?: string;
  profile?: string[];
  tag?: Array<{
    system?: string;
    code?: string;
    display?: string;
  }>;
}

export interface FhirIdentifier {
  use?: 'usual' | 'official' | 'temp' | 'secondary' | 'old';
  type?: {
    coding?: Array<{
      system?: string;
      code?: string;
      display?: string;
    }>;
    text?: string;
  };
  system?: string;
  value?: string;
}

export interface BaseFhirResource {
  resourceType: string;
  id?: string;
  meta?: FhirMeta;
  implicitRules?: string;
  language?: string;
}

export interface FhirPatient extends BaseFhirResource {
  resourceType: 'Patient';
  identifier?: FhirIdentifier[];
  active?: boolean;
  name?: Array<{
    use?: string;
    text?: string;
    family?: string;
    given?: string[];
    prefix?: string[];
    suffix?: string[];
  }>;
  telecom?: Array<{
    system?: 'phone' | 'fax' | 'email' | 'pager' | 'url' | 'sms' | 'other';
    value?: string;
    use?: 'home' | 'work' | 'temp' | 'old' | 'mobile';
  }>;
  gender?: 'male' | 'female' | 'other' | 'unknown';
  birthDate?: string;
  deceasedBoolean?: boolean;
  deceasedDateTime?: string;
  address?: Array<{
    use?: 'home' | 'work' | 'temp' | 'old';
    type?: 'postal' | 'physical' | 'both';
    text?: string;
    line?: string[];
    city?: string;
    district?: string;
    state?: string;
    postalCode?: string;
    country?: string;
  }>;
  contact?: Array<{
    relationship?: Array<{
      coding?: Array<{
        system?: string;
        code?: string;
        display?: string;
      }>;
      text?: string;
    }>;
    name?: {
      text?: string;
      family?: string;
      given?: string[];
    };
    telecom?: Array<{
      system?: string;
      value?: string;
    }>;
  }>;
  extension?: Array<{
    url: string;
    valueString?: string;
    valueCodeableConcept?: any;
  }>;
}

export interface FhirPractitioner extends BaseFhirResource {
  resourceType: 'Practitioner';
  identifier?: FhirIdentifier[];
  active?: boolean;
  name?: Array<{
    text?: string;
    family?: string;
    given?: string[];
    prefix?: string[];
  }>;
  telecom?: Array<{
    system?: string;
    value?: string;
    use?: string;
  }>;
  gender?: string;
  birthDate?: string;
}

export interface FhirEncounter extends BaseFhirResource {
  resourceType: 'Encounter';
  identifier?: FhirIdentifier[];
  status: 'planned' | 'arrived' | 'triaged' | 'in-progress' | 'onleave' | 'finished' | 'cancelled' | 'entered-in-error' | 'unknown';
  class: {
    system?: string;
    code: string;
    display?: string;
  };
  subject?: {
    reference?: string;
    display?: string;
  };
  participant?: Array<{
    type?: any[];
    individual?: {
      reference?: string;
      display?: string;
    };
  }>;
  period?: {
    start?: string;
    end?: string;
  };
  reasonCode?: Array<{
    text?: string;
  }>;
  serviceProvider?: {
    reference?: string;
    display?: string;
  };
}

export interface FhirObservation extends BaseFhirResource {
  resourceType: 'Observation';
  identifier?: FhirIdentifier[];
  status: 'registered' | 'preliminary' | 'final' | 'amended' | 'corrected' | 'cancelled' | 'entered-in-error' | 'unknown';
  category?: Array<{
    coding?: Array<{
      system?: string;
      code?: string;
      display?: string;
    }>;
  }>;
  code: {
    coding?: Array<{
      system?: string;
      code?: string;
      display?: string;
    }>;
    text?: string;
  };
  subject?: {
    reference?: string;
    display?: string;
  };
  encounter?: {
    reference?: string;
  };
  effectiveDateTime?: string;
  performer?: Array<{
    reference?: string;
    display?: string;
  }>;
  valueQuantity?: {
    value?: number;
    unit?: string;
    system?: string;
    code?: string;
  };
  valueCodeableConcept?: {
    text?: string;
  };
  component?: Array<{
    code: {
      coding?: Array<{
        system?: string;
        code?: string;
        display?: string;
      }>;
    };
    valueQuantity?: {
      value?: number;
      unit?: string;
      system?: string;
      code?: string;
    };
  }>;
}

export interface FhirMedicationRequest extends BaseFhirResource {
  resourceType: 'MedicationRequest';
  identifier?: FhirIdentifier[];
  status: 'active' | 'on-hold' | 'cancelled' | 'completed' | 'entered-in-error' | 'stopped' | 'draft' | 'unknown';
  intent: 'proposal' | 'plan' | 'order' | 'original-order' | 'reflex-order' | 'filler-order' | 'instance-order' | 'option';
  medicationCodeableConcept?: {
    coding?: Array<{
      system?: string;
      code?: string;
      display?: string;
    }>;
    text?: string;
  };
  subject?: {
    reference?: string;
    display?: string;
  };
  encounter?: {
    reference?: string;
  };
  authoredOn?: string;
  requester?: {
    reference?: string;
    display?: string;
  };
  dosageInstruction?: Array<{
    text?: string;
    timing?: {
      code?: {
        text?: string;
      };
    };
    route?: {
      text?: string;
    };
  }>;
}

export interface FhirAppointment extends BaseFhirResource {
  resourceType: 'Appointment';
  identifier?: FhirIdentifier[];
  status: 'proposed' | 'pending' | 'booked' | 'arrived' | 'fulfilled' | 'cancelled' | 'noshow' | 'entered-in-error';
  description?: string;
  start?: string;
  end?: string;
  created?: string;
  participant: Array<{
    actor?: {
      reference?: string;
      display?: string;
    };
    status: 'accepted' | 'declined' | 'tentative' | 'needs-action';
    required?: 'required' | 'optional' | 'information-only';
  }>;
}

export interface FhirCondition extends BaseFhirResource {
  resourceType: 'Condition';
  identifier?: FhirIdentifier[];
  clinicalStatus?: {
    coding?: Array<{
      system?: string;
      code?: string;
      display?: string;
    }>;
  };
  verificationStatus?: {
    coding?: Array<{
      system?: string;
      code?: string;
      display?: string;
    }>;
  };
  code: {
    coding?: Array<{
      system?: string;
      code?: string;
      display?: string;
    }>;
    text?: string;
  };
  subject: {
    reference: string;
    display?: string;
  };
  encounter?: {
    reference?: string;
  };
  recordedDate?: string;
}

export interface FhirDiagnosticReport extends BaseFhirResource {
  resourceType: 'DiagnosticReport';
  identifier?: FhirIdentifier[];
  status: 'registered' | 'partial' | 'preliminary' | 'final' | 'amended' | 'corrected' | 'cancelled' | 'entered-in-error' | 'unknown';
  code: {
    coding?: Array<{
      system?: string;
      code?: string;
      display?: string;
    }>;
    text?: string;
  };
  subject?: {
    reference?: string;
    display?: string;
  };
  encounter?: {
    reference?: string;
  };
  effectiveDateTime?: string;
  issued?: string;
  performer?: Array<{
    reference?: string;
    display?: string;
  }>;
  result?: Array<{
    reference?: string;
    display?: string;
  }>;
  conclusion?: string;
}

export interface FhirAllergyIntolerance extends BaseFhirResource {
  resourceType: 'AllergyIntolerance';
  identifier?: FhirIdentifier[];
  clinicalStatus?: {
    coding?: Array<{
      system?: string;
      code?: string;
      display?: string;
    }>;
  };
  verificationStatus?: {
    coding?: Array<{
      system?: string;
      code?: string;
      display?: string;
    }>;
  };
  type?: 'allergy' | 'intolerance';
  category?: Array<'food' | 'medication' | 'environment' | 'biologic'>;
  criticality?: 'low' | 'high' | 'unable-to-assess';
  code: {
    coding?: Array<{
      system?: string;
      code?: string;
      display?: string;
    }>;
    text?: string;
  };
  patient: {
    reference: string;
    display?: string;
  };
  recordedDate?: string;
}
