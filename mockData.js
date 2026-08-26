/** Centralized development mock data — replace with API responses later. */

export const DEFAULT_HEALTH_PROFILE = {
  age: '28',
  height: '165',
  weight: '62',
  cycleLength: '28',
  periodRegularity: 'Regular',
  sleepDuration: '7',
  stressLevel: 'Moderate',
  exerciseFrequency: '3-4 times per week',
  symptoms: 'Occasional fatigue and mild bloating before periods.',
};

export const INITIAL_HEALTH_LOGS = [
  {
    id: 'log-1',
    date: '2026-08-20',
    weight: '62.4',
    sleep: '7.5',
    stress: 'Low',
    symptoms: 'None',
    notes: 'Felt energetic throughout the day.',
  },
  {
    id: 'log-2',
    date: '2026-08-18',
    weight: '62.8',
    sleep: '6.5',
    stress: 'Moderate',
    symptoms: 'Mild headache',
    notes: 'Work deadline caused slight stress.',
  },
  {
    id: 'log-3',
    date: '2026-08-15',
    weight: '63.1',
    sleep: '7',
    stress: 'Low',
    symptoms: 'Bloating',
    notes: 'Pre-menstrual symptoms noted.',
  },
  {
    id: 'log-4',
    date: '2026-08-12',
    weight: '63.0',
    sleep: '8',
    stress: 'Low',
    symptoms: 'None',
    notes: 'Good rest after weekend.',
  },
];

export const DASHBOARD_SUMMARY = {
  healthProfile: { label: 'Health Profile', value: 'Complete', status: 'Up to date' },
  healthLogs: { label: 'Health Logs', value: '12', status: 'Entries this month' },
  lastAssessment: { label: 'Last Assessment', value: 'Aug 18, 2026', status: 'PCOS, Anaemia' },
  overallWellness: { label: 'Overall Wellness', value: 'Stable', status: 'Based on recent logs' },
};

export const DASHBOARD_RISKS = [
  {
    title: 'PCOS Risk',
    riskLevel: 'medium',
    value: '42%',
    description: 'Moderate indicators based on cycle and symptom patterns.',
    footer: 'Development mock data',
  },
  {
    title: 'Anaemia Risk',
    riskLevel: 'low',
    value: '18%',
    description: 'Low risk based on current profile and logged symptoms.',
    footer: 'Development mock data',
  },
  {
    title: 'Thyroid Risk',
    riskLevel: 'medium',
    value: '35%',
    description: 'Some factors warrant monitoring; consult a professional if concerned.',
    footer: 'Development mock data',
  },
];

export const WEIGHT_TREND_DATA = [
  { date: 'Aug 1', weight: 63.5 },
  { date: 'Aug 5', weight: 63.2 },
  { date: 'Aug 8', weight: 63.0 },
  { date: 'Aug 12', weight: 63.0 },
  { date: 'Aug 15', weight: 63.1 },
  { date: 'Aug 18', weight: 62.8 },
  { date: 'Aug 20', weight: 62.4 },
];

export const SLEEP_TREND_DATA = [
  { date: 'Aug 1', hours: 6.5 },
  { date: 'Aug 5', hours: 7.0 },
  { date: 'Aug 8', hours: 7.5 },
  { date: 'Aug 12', hours: 8.0 },
  { date: 'Aug 15', hours: 7.0 },
  { date: 'Aug 18', hours: 6.5 },
  { date: 'Aug 20', hours: 7.5 },
];

export const RECENT_ACTIVITY = [
  { id: 'act-1', date: 'Aug 20, 2026', text: 'Health log added — weight 62.4 kg, sleep 7.5 hrs' },
  { id: 'act-2', date: 'Aug 18, 2026', text: 'AI assessment completed — PCOS & Anaemia reviewed' },
  { id: 'act-3', date: 'Aug 15, 2026', text: 'Health log added — pre-menstrual symptoms noted' },
  { id: 'act-4', date: 'Aug 10, 2026', text: 'Health profile updated' },
];

export const ASSESSMENT_OPTIONS = [
  {
    id: 'pcos',
    title: 'PCOS',
    description: 'Polycystic ovary syndrome risk estimation based on cycle, symptoms, and lifestyle factors.',
  },
  {
    id: 'anaemia',
    title: 'Anaemia',
    description: 'Iron deficiency and anaemia risk estimation using profile and symptom indicators.',
  },
  {
    id: 'thyroid',
    title: 'Thyroid',
    description: 'Thyroid dysfunction risk estimation using metabolic and symptom patterns.',
  },
];

const MOCK_RESULT_TEMPLATES = {
  pcos: {
    label: 'PCOS',
    percentage: 42,
    explanation:
      'Your profile shows moderate indicators that may align with PCOS-related patterns. This is an AI-generated estimate only.',
  },
  anaemia: {
    label: 'Anaemia',
    percentage: 18,
    explanation:
      'Current indicators suggest a lower estimated risk for anaemia. Continue monitoring symptoms with your healthcare provider.',
  },
  thyroid: {
    label: 'Thyroid',
    percentage: 35,
    explanation:
      'Some factors in your profile may warrant thyroid monitoring. This estimate is not a clinical diagnosis.',
  },
};

export function getRiskLevel(percentage) {
  if (percentage < 34) return 'low';
  if (percentage <= 66) return 'medium';
  return 'high';
}

export function getRiskLabel(percentage) {
  const level = getRiskLevel(percentage);
  if (level === 'low') return 'Low';
  if (level === 'medium') return 'Moderate';
  return 'High';
}

export function generateMockAssessmentResults(selectedIds) {
  const results = selectedIds.map((id) => {
    const template = MOCK_RESULT_TEMPLATES[id];
    if (!template) return null;

    const variance = Math.floor(Math.random() * 11) - 5;
    const percentage = Math.min(95, Math.max(8, template.percentage + variance));

    return {
      id,
      label: template.label,
      percentage,
      riskLevel: getRiskLevel(percentage),
      riskLabel: getRiskLabel(percentage),
      explanation: template.explanation,
    };
  }).filter(Boolean);

  return {
    date: new Date().toISOString(),
    conditions: selectedIds,
    results,
    disclaimer:
      'These results are AI-generated risk estimates and are not a medical diagnosis. Please consult a qualified healthcare professional for medical advice.',
    isMockData: true,
  };
}

export function formatDisplayDate(isoString) {
  if (!isoString) return '—';

  return new Date(isoString).toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

export function calculateBmi(weightKg, heightCm) {
  const weight = parseFloat(weightKg);
  const height = parseFloat(heightCm);

  if (!weight || !height || height <= 0) return null;

  const heightM = height / 100;
  const bmi = weight / (heightM * heightM);
  return Math.round(bmi * 10) / 10;
}

export function getBmiCategory(bmi) {
  if (bmi == null) return null;
  if (bmi < 18.5) return 'Underweight';
  if (bmi < 25) return 'Normal';
  if (bmi < 30) return 'Overweight';
  return 'Obese';
}
