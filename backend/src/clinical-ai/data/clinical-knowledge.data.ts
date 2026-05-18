/**
 * ICD-10 Symptom Knowledge Base
 * Rule-based mapping: symptom keyword → ICD-10 suggestions
 * Fully explainable, no black-box ML — doctor always overrides.
 *
 * Format: { keywords, icd10Code, description, category, commonInvestigations, commonDrugs }
 */
export interface IcdSuggestion {
  icd10Code: string;
  description: string;
  category: string;
  confidence: number; // 0-100, based on keyword match count
  commonInvestigations: string[];
  commonDrugs: string[];
  followUpDays: number;
}

export interface SymptomRule {
  keywords: string[];
  suggestions: Omit<IcdSuggestion, 'confidence'>[];
}

export const SYMPTOM_RULES: SymptomRule[] = [
  {
    keywords: ['fever', 'pyrexia', 'high temperature', 'febrile'],
    suggestions: [
      {
        icd10Code: 'R50.9',
        description: 'Fever, unspecified',
        category: 'Symptoms & Signs',
        commonInvestigations: ['CBC', 'Blood Culture', 'Malaria Antigen', 'Widal Test', 'Dengue NS1'],
        commonDrugs: ['Paracetamol 500mg', 'Ibuprofen 400mg'],
        followUpDays: 3,
      },
      {
        icd10Code: 'A09',
        description: 'Infectious gastroenteritis',
        category: 'Infectious Diseases',
        commonInvestigations: ['Stool Routine', 'CBC', 'Electrolytes'],
        commonDrugs: ['ORS', 'Metronidazole', 'Domperidone'],
        followUpDays: 5,
      },
    ],
  },
  {
    keywords: ['cough', 'cold', 'sore throat', 'rhinorrhea', 'nasal discharge', 'sneezing'],
    suggestions: [
      {
        icd10Code: 'J06.9',
        description: 'Acute upper respiratory infection',
        category: 'Respiratory',
        commonInvestigations: ['Throat Swab', 'CBC', 'CRP'],
        commonDrugs: ['Amoxicillin 500mg', 'Cetirizine', 'Dextromethorphan'],
        followUpDays: 7,
      },
      {
        icd10Code: 'J00',
        description: 'Acute nasopharyngitis (Common Cold)',
        category: 'Respiratory',
        commonInvestigations: ['No investigations needed for uncomplicated cold'],
        commonDrugs: ['Paracetamol', 'Cetirizine', 'Saline nasal drops'],
        followUpDays: 7,
      },
    ],
  },
  {
    keywords: ['chest pain', 'chest tightness', 'palpitation', 'shortness of breath', 'dyspnea'],
    suggestions: [
      {
        icd10Code: 'R07.9',
        description: 'Chest pain, unspecified',
        category: 'Cardiovascular',
        commonInvestigations: ['ECG', 'Troponin I', 'CK-MB', 'Chest X-Ray', 'D-Dimer'],
        commonDrugs: ['Aspirin 325mg (if cardiac)', 'GTN sublingual (if angina)'],
        followUpDays: 1,
      },
      {
        icd10Code: 'J06.9',
        description: 'Acute bronchitis',
        category: 'Respiratory',
        commonInvestigations: ['Chest X-Ray', 'Sputum Culture', 'SpO2'],
        commonDrugs: ['Amoxicillin-Clavulanate', 'Salbutamol', 'Prednisolone'],
        followUpDays: 5,
      },
    ],
  },
  {
    keywords: ['headache', 'migraine', 'head pain', 'cephalgia'],
    suggestions: [
      {
        icd10Code: 'R51',
        description: 'Headache',
        category: 'Neurological',
        commonInvestigations: ['BP Monitoring', 'Blood Glucose', 'CT Head (if red flags)'],
        commonDrugs: ['Paracetamol 500mg', 'Ibuprofen 400mg', 'Sumatriptan (migraine)'],
        followUpDays: 7,
      },
      {
        icd10Code: 'G43.9',
        description: 'Migraine, unspecified',
        category: 'Neurological',
        commonInvestigations: ['MRI Brain (if first episode)', 'CBC'],
        commonDrugs: ['Sumatriptan 50mg', 'Propranolol (prophylaxis)', 'Amitriptyline'],
        followUpDays: 30,
      },
    ],
  },
  {
    keywords: ['abdominal pain', 'stomach pain', 'gastric', 'epigastric', 'nausea', 'vomiting'],
    suggestions: [
      {
        icd10Code: 'R10.9',
        description: 'Unspecified abdominal pain',
        category: 'Gastrointestinal',
        commonInvestigations: ['Ultrasound Abdomen', 'LFT', 'Amylase', 'Lipase', 'Urine Routine'],
        commonDrugs: ['Pantoprazole 40mg', 'Ondansetron', 'Metoclopramide'],
        followUpDays: 5,
      },
      {
        icd10Code: 'K21.0',
        description: 'Gastro-oesophageal reflux with oesophagitis',
        category: 'Gastrointestinal',
        commonInvestigations: ['Upper GI Endoscopy', 'H. pylori test'],
        commonDrugs: ['Omeprazole 20mg', 'Domperidone', 'Antacid'],
        followUpDays: 14,
      },
    ],
  },
  {
    keywords: ['diabetes', 'high blood sugar', 'hyperglycemia', 'polyuria', 'polydipsia'],
    suggestions: [
      {
        icd10Code: 'E11.9',
        description: 'Type 2 diabetes mellitus without complications',
        category: 'Endocrine',
        commonInvestigations: ['FBS', 'PPBS', 'HbA1c', 'Urine Microalbumin', 'Lipid Profile', 'Creatinine'],
        commonDrugs: ['Metformin 500mg', 'Glimepiride', 'Sitagliptin'],
        followUpDays: 90,
      },
    ],
  },
  {
    keywords: ['hypertension', 'high blood pressure', 'bp high', 'elevated bp'],
    suggestions: [
      {
        icd10Code: 'I10',
        description: 'Essential (primary) hypertension',
        category: 'Cardiovascular',
        commonInvestigations: ['ECG', 'Renal Profile', 'Lipid Profile', 'Urine Albumin', 'Ophthalmology'],
        commonDrugs: ['Amlodipine 5mg', 'Telmisartan 40mg', 'Hydrochlorothiazide'],
        followUpDays: 30,
      },
    ],
  },
  {
    keywords: ['urinary', 'burning urination', 'dysuria', 'uti', 'frequency of urination', 'hematuria'],
    suggestions: [
      {
        icd10Code: 'N39.0',
        description: 'Urinary tract infection',
        category: 'Urology',
        commonInvestigations: ['Urine Routine', 'Urine Culture & Sensitivity', 'Ultrasound KUB'],
        commonDrugs: ['Nitrofurantoin 100mg', 'Ciprofloxacin 500mg', 'Co-trimoxazole'],
        followUpDays: 7,
      },
    ],
  },
  {
    keywords: ['back pain', 'lower back pain', 'lumbar pain', 'sciatica'],
    suggestions: [
      {
        icd10Code: 'M54.5',
        description: 'Low back pain',
        category: 'Musculoskeletal',
        commonInvestigations: ['X-Ray LS Spine', 'MRI LS Spine (if radiculopathy)', 'CBC'],
        commonDrugs: ['Ibuprofen 400mg', 'Diclofenac', 'Methocarbamol', 'Pregabalin'],
        followUpDays: 14,
      },
    ],
  },
  {
    keywords: ['joint pain', 'arthritis', 'swollen joint', 'knee pain', 'hip pain'],
    suggestions: [
      {
        icd10Code: 'M13.9',
        description: 'Arthritis, unspecified',
        category: 'Musculoskeletal',
        commonInvestigations: ['RA Factor', 'Anti-CCP', 'Uric Acid', 'X-Ray affected joint', 'ESR', 'CRP'],
        commonDrugs: ['Methotrexate (RA)', 'Hydroxychloroquine', 'Ibuprofen', 'Colchicine (gout)'],
        followUpDays: 30,
      },
    ],
  },
  {
    keywords: ['skin rash', 'itching', 'urticaria', 'eczema', 'dermatitis'],
    suggestions: [
      {
        icd10Code: 'L30.9',
        description: 'Dermatitis, unspecified',
        category: 'Dermatology',
        commonInvestigations: ['CBC', 'IgE levels', 'Skin patch test'],
        commonDrugs: ['Cetirizine 10mg', 'Hydroxyzine', 'Topical Betamethasone', 'Calamine lotion'],
        followUpDays: 14,
      },
    ],
  },
  {
    keywords: ['anxiety', 'panic', 'stress', 'depression', 'insomnia', 'sleep disorder'],
    suggestions: [
      {
        icd10Code: 'F41.9',
        description: 'Anxiety disorder, unspecified',
        category: 'Psychiatry',
        commonInvestigations: ['Thyroid Profile', 'CBC', 'Vitamin D', 'B12'],
        commonDrugs: ['Escitalopram 10mg', 'Alprazolam 0.25mg (short term)', 'Clonazepam'],
        followUpDays: 14,
      },
    ],
  },
];

/**
 * Drug Interaction Database
 * Format: { drug1Keywords, drug2Keywords, severity, description, recommendation }
 */
export interface DrugInteraction {
  drug1Keywords: string[];
  drug2Keywords: string[];
  severity: 'MILD' | 'MODERATE' | 'SEVERE' | 'CONTRAINDICATED';
  mechanism: string;
  clinicalEffect: string;
  recommendation: string;
}

export const DRUG_INTERACTIONS: DrugInteraction[] = [
  {
    drug1Keywords: ['warfarin', 'coumadin'],
    drug2Keywords: ['aspirin', 'ibuprofen', 'naproxen', 'nsaid'],
    severity: 'SEVERE',
    mechanism: 'Additive anticoagulant effect + GI mucosal damage',
    clinicalEffect: 'Significantly increased bleeding risk',
    recommendation: 'Avoid combination. Use paracetamol for analgesia if needed.',
  },
  {
    drug1Keywords: ['metformin'],
    drug2Keywords: ['contrast', 'iodinated contrast'],
    severity: 'SEVERE',
    mechanism: 'Risk of contrast-induced nephropathy leading to metformin accumulation',
    clinicalEffect: 'Lactic acidosis risk',
    recommendation: 'Hold metformin 48h before contrast procedure and restart after renal function confirmed normal.',
  },
  {
    drug1Keywords: ['ssri', 'fluoxetine', 'sertraline', 'escitalopram', 'citalopram'],
    drug2Keywords: ['tramadol', 'triptans', 'sumatriptan'],
    severity: 'SEVERE',
    mechanism: 'Serotonergic synergism',
    clinicalEffect: 'Serotonin syndrome: agitation, tachycardia, hyperthermia',
    recommendation: 'Avoid combination. Monitor closely if necessary.',
  },
  {
    drug1Keywords: ['ace inhibitor', 'ramipril', 'enalapril', 'lisinopril'],
    drug2Keywords: ['potassium', 'spironolactone', 'eplerenone'],
    severity: 'MODERATE',
    mechanism: 'Additive potassium retention',
    clinicalEffect: 'Hyperkalemia risk',
    recommendation: 'Monitor serum potassium closely. Avoid high potassium diet.',
  },
  {
    drug1Keywords: ['methotrexate'],
    drug2Keywords: ['nsaid', 'ibuprofen', 'diclofenac', 'aspirin'],
    severity: 'SEVERE',
    mechanism: 'NSAIDs reduce renal clearance of methotrexate',
    clinicalEffect: 'Methotrexate toxicity: bone marrow suppression, mucositis',
    recommendation: 'Avoid NSAIDs in patients on methotrexate. Use paracetamol.',
  },
  {
    drug1Keywords: ['ciprofloxacin', 'fluoroquinolone', 'levofloxacin'],
    drug2Keywords: ['antacid', 'calcium', 'iron', 'magnesium'],
    severity: 'MODERATE',
    mechanism: 'Chelation reduces antibiotic absorption',
    clinicalEffect: 'Reduced antibiotic efficacy',
    recommendation: 'Separate doses by at least 2 hours.',
  },
  {
    drug1Keywords: ['digoxin'],
    drug2Keywords: ['amiodarone'],
    severity: 'SEVERE',
    mechanism: 'Amiodarone inhibits P-glycoprotein and CYP3A4',
    clinicalEffect: 'Digoxin toxicity: bradycardia, arrhythmia, nausea',
    recommendation: 'Reduce digoxin dose by 50% when starting amiodarone. Monitor levels.',
  },
  {
    drug1Keywords: ['statins', 'atorvastatin', 'simvastatin', 'rosuvastatin'],
    drug2Keywords: ['gemfibrozil', 'fibrate'],
    severity: 'SEVERE',
    mechanism: 'Inhibition of statin metabolism',
    clinicalEffect: 'Myopathy and rhabdomyolysis risk',
    recommendation: 'Avoid gemfibrozil with statins. Use fenofibrate if fibrate necessary.',
  },
  {
    drug1Keywords: ['sildenafil', 'tadalafil', 'pde5'],
    drug2Keywords: ['nitrate', 'nitroglycerin', 'isosorbide'],
    severity: 'CONTRAINDICATED',
    mechanism: 'Additive nitric oxide mediated vasodilation',
    clinicalEffect: 'Severe hypotension, potentially fatal',
    recommendation: 'CONTRAINDICATED. Do not co-administer under any circumstances.',
  },
  {
    drug1Keywords: ['antibiotic', 'amoxicillin', 'ampicillin'],
    drug2Keywords: ['oral contraceptive', 'ocp', 'contraceptive pill'],
    severity: 'MILD',
    mechanism: 'Gut flora disruption may reduce enterohepatic circulation of estrogen',
    clinicalEffect: 'Possible reduced contraceptive efficacy',
    recommendation: 'Advise additional contraception during antibiotic course and 7 days after.',
  },
];

/**
 * Vital Signs Thresholds for Clinical Risk Engine
 */
export const VITAL_THRESHOLDS = {
  systolicBP: { critical_low: 80, low: 90, high: 140, critical_high: 180 },
  diastolicBP: { critical_low: 50, low: 60, high: 90, critical_high: 110 },
  pulse: { critical_low: 40, low: 50, high: 100, critical_high: 130 },
  temperature: { critical_low: 35.0, low: 36.0, high: 37.5, critical_high: 39.5 },
  spo2: { critical_low: 88, low: 94, high: 100, critical_high: 100 },
  bmi: { critical_low: 15, low: 18.5, high: 25, critical_high: 40 },
};
