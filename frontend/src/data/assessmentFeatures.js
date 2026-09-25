/** Exact ML model feature definitions discovered from ai-service/models/*.pkl */

export const ASSESSMENT_STEPS = [
  {
    id: 1,
    key: 'pcos-basic',
    title: "Let's start with the basics",
    subtitle: 'Tell us a little about yourself so FemoraAI can personalise your assessment.',
    model: 'pcos',
  },
  {
    id: 2,
    key: 'pcos-cycle',
    title: 'PCOS — Cycle & reproductive',
    subtitle: 'Menstrual and reproductive details for the PCOS model.',
    model: 'pcos',
  },
  {
    id: 3,
    key: 'pcos-labs',
    title: 'Optional health details',
    subtitle: 'Share measurements or report values only if you already know them. It is okay to leave these blank.',
    model: 'pcos',
  },
  {
    id: 4,
    key: 'pcos-symptoms',
    title: 'PCOS — Symptoms & lifestyle',
    subtitle: 'Select yes/no for symptoms and lifestyle factors.',
    model: 'pcos',
  },
  {
    id: 5,
    key: 'diabetes',
    title: 'Diabetes risk factors',
    subtitle: 'Health survey inputs used by the diabetes model.',
    model: 'diabetes',
  },
  {
    id: 6,
    key: 'thyroid',
    title: 'Thyroid assessment',
    subtitle: 'Clinical thyroid indicators used by the thyroid model.',
    model: 'thyroid',
  },
];

const yesNoField = (key, label, step, model = 'pcos', options = {}) => ({
  key,
  label,
  step,
  model,
  type: 'yesno',
  ...options,
});

const selectField = (key, label, step, model, options) => ({
  key,
  label,
  step,
  model,
  type: 'select',
  options,
});

const numberField = (key, label, step, model, unit = '', placeholder = '', options = {}) => ({
  key,
  label,
  step,
  model,
  type: 'number',
  unit,
  placeholder,
  ...options,
});

export const ASSESSMENT_FIELDS = [
  numberField('Age_yrs', 'Age', 1, 'pcos', 'years', 'e.g. 28'),
  numberField('Weight_Kg', 'Weight', 1, 'pcos', 'kg', 'e.g. 62'),
  numberField('Height_Cm', 'Height', 1, 'pcos', 'cm', 'e.g. 165'),
  numberField('BMI', 'BMI', 1, 'pcos', '', 'Calculated automatically', {
    computed: true,
    helper: 'Calculated from your height and weight.',
  }),

  numberField('Blood_Group', 'Blood group (from detailed report)', 3, 'pcos', '', '', { visible: false }),
  numberField('Pulse_rate_bpm', 'Pulse rate', 3, 'pcos', 'bpm', 'e.g. 72'),
  numberField('RR_breaths_min', 'Respiratory rate', 3, 'pcos', '/min', 'e.g. 16'),
  numberField('Hb_g_dl', 'Haemoglobin', 3, 'pcos', 'g/dL', 'e.g. 12.5'),
  numberField('Hip_inch', 'Hip circumference', 3, 'pcos', 'inch', 'e.g. 38'),
  numberField('Waist_inch', 'Waist circumference', 3, 'pcos', 'inch', 'e.g. 30'),
  numberField('Waist_Hip_Ratio', 'Waist-hip ratio', 3, 'pcos', '', 'Calculated if measurements are provided'),
  numberField('BP_Systolic_mmHg', 'Blood pressure (systolic)', 3, 'pcos', 'mmHg', 'e.g. 120'),
  numberField('BP_Diastolic_mmHg', 'Blood pressure (diastolic)', 3, 'pcos', 'mmHg', 'e.g. 80'),

  selectField('Cycle_R_I', 'Is your menstrual cycle regular?', 2, 'pcos', [
    { value: '1', label: 'Regular' },
    { value: '0', label: 'Irregular' },
  ]),
  numberField('Cycle_length_days', 'Average menstrual cycle length', 2, 'pcos', 'days', 'e.g. 28'),
  numberField('Marraige_Status_Yrs', 'Marriage history (if applicable)', 2, 'pcos', '', '', { visible: false }),
  yesNoField('Pregnant_Y_N', 'Are you currently pregnant?', 2),
  numberField('No_of_abortions', 'Number of abortions', 2, 'pcos', '', 'e.g. 0'),
  numberField('Follicle_No_L', 'Follicle count (left)', 2, 'pcos', '', 'e.g. 5'),
  numberField('Follicle_No_R', 'Follicle count (right)', 2, 'pcos', '', 'e.g. 5'),
  numberField('Avg_F_size_L_mm', 'Average follicle size (left)', 2, 'pcos', 'mm', 'e.g. 8'),
  numberField('Avg_F_size_R_mm', 'Average follicle size (right)', 2, 'pcos', 'mm', 'e.g. 8'),
  numberField('Endometrium_mm', 'Endometrium thickness', 2, 'pcos', 'mm', 'e.g. 8'),

  numberField('I_beta_HCG_mIU_mL', 'Beta HCG I', 3, 'pcos', 'mIU/mL', ''),
  numberField('II_beta_HCG_mIU_mL', 'Beta HCG II', 3, 'pcos', 'mIU/mL', ''),
  numberField('FSH_mIU_mL', 'FSH', 3, 'pcos', 'mIU/mL', ''),
  numberField('LH_mIU_mL', 'LH', 3, 'pcos', 'mIU/mL', ''),
  numberField('FSH_LH', 'FSH/LH ratio', 3, 'pcos', '', 'Auto-calculated if blank'),
  numberField('TSH_mIU_L', 'TSH', 3, 'pcos', 'mIU/L', ''),
  numberField('AMH_ng_mL', 'AMH', 3, 'pcos', 'ng/mL', ''),
  numberField('PRL_ng_mL', 'Prolactin', 3, 'pcos', 'ng/mL', ''),
  numberField('Vit_D3_ng_mL', 'Vitamin D3', 3, 'pcos', 'ng/mL', ''),
  numberField('PRG_ng_mL', 'Progesterone', 3, 'pcos', 'ng/mL', ''),
  numberField('RBS_mg_dl', 'Random blood sugar', 3, 'pcos', 'mg/dL', ''),

  yesNoField('Weight_gain_Y_N', 'Unexplained weight gain', 4),
  yesNoField('hair_growth_Y_N', 'Excess hair growth', 4),
  yesNoField('Skin_darkening_Y_N', 'Skin darkening', 4),
  yesNoField('Hair_loss_Y_N', 'Hair loss', 4),
  yesNoField('Pimples_Y_N', 'Acne / pimples', 4),
  yesNoField('Fast_food_Y_N', 'Regular fast food consumption', 4),
  yesNoField('Reg_Exercise_Y_N', 'Regular exercise', 4),

  yesNoField('HighBP', 'Have you been told you have high blood pressure?', 5, 'diabetes'),
  yesNoField('HighChol', 'Have you been told you have high cholesterol?', 5, 'diabetes'),
  yesNoField('CholCheck', 'Has your cholesterol been checked in the last 5 years?', 5, 'diabetes'),
  numberField('BMI', 'BMI', 5, 'diabetes', '', 'e.g. 24.2'),
  yesNoField('Smoker', 'Do you currently smoke?', 5, 'diabetes'),
  yesNoField('Stroke', 'Have you ever had a stroke?', 5, 'diabetes'),
  yesNoField('HeartDiseaseorAttack', 'Have you had heart disease or a heart attack?', 5, 'diabetes'),
  yesNoField('PhysActivity', 'Have you been physically active in the last 30 days?', 5, 'diabetes'),
  yesNoField('Fruits', 'Do you eat fruit daily?', 5, 'diabetes'),
  yesNoField('Veggies', 'Do you eat vegetables daily?', 5, 'diabetes'),
  yesNoField('HvyAlcoholConsump', 'Do you frequently drink heavily?', 5, 'diabetes'),
  yesNoField('AnyHealthcare', 'Do you have healthcare coverage?', 5, 'diabetes'),
  yesNoField('NoDocbcCost', 'Have cost concerns prevented you from seeing a doctor?', 5, 'diabetes'),
  selectField('GenHlth', 'How would you rate your general health?', 5, 'diabetes', [
    { value: '1', label: 'Poor' },
    { value: '2', label: 'Fair' },
    { value: '3', label: 'Good' },
    { value: '4', label: 'Very good' },
    { value: '5', label: 'Excellent' },
  ]),
  numberField('MentHlth', 'Mental health not good (days)', 5, 'diabetes', 'days', '0-30'),
  numberField('PhysHlth', 'Physical health not good (days)', 5, 'diabetes', 'days', '0-30'),
  numberField('DiffWalk', 'Difficulty walking', 5, 'diabetes', '', '0 = No, 1 = Yes'),
  selectField('Sex', 'Sex', 5, 'diabetes', [
    { value: '0', label: 'Female' },
    { value: '1', label: 'Male' },
  ]),
  numberField('Age', 'Age category from the health questionnaire', 5, 'diabetes', '', '', { visible: false }),
  numberField('Education', 'Education level from the health questionnaire', 5, 'diabetes', '', '', { visible: false }),
  numberField('Income', 'Income level from the health questionnaire', 5, 'diabetes', '', '', { visible: false }),

  numberField('age', 'Age', 6, 'thyroid', 'years', 'e.g. 28'),
  selectField('sex', 'Sex', 6, 'thyroid', [
    { value: '0', label: 'Female' },
    { value: '1', label: 'Male' },
  ]),
  numberField('on_thyroxine', 'On thyroxine', 6, 'thyroid', '', '0/1'),
  numberField('query_on_thyroxine', 'Query on thyroxine', 6, 'thyroid', '', '0/1'),
  numberField('on_antithyroid_meds', 'On antithyroid medication', 6, 'thyroid', '', '0/1'),
  numberField('sick', 'Currently sick', 6, 'thyroid', '', '0/1'),
  yesNoField('pregnant', 'Are you currently pregnant?', 6, 'thyroid'),
  numberField('thyroid_surgery', 'Thyroid surgery history', 6, 'thyroid', '', '0/1'),
  numberField('i131_treatment', 'I131 treatment', 6, 'thyroid', '', '0/1'),
  numberField('query_hypothyroid', 'Query hypothyroid', 6, 'thyroid', '', '0/1'),
  numberField('query_hyperthyroid', 'Query hyperthyroid', 6, 'thyroid', '', '0/1'),
  numberField('lithium', 'Lithium use', 6, 'thyroid', '', '0/1'),
  numberField('goitre', 'Goitre', 6, 'thyroid', '', '0/1'),
  numberField('tumor', 'Tumor', 6, 'thyroid', '', '0/1'),
  numberField('hypopituitary', 'Hypopituitary', 6, 'thyroid', '', '0/1'),
  numberField('psych', 'Psychiatric condition', 6, 'thyroid', '', '0/1'),
  numberField('tsh_measured', 'TSH measured', 6, 'thyroid', '', '0/1'),
  numberField('tsh', 'TSH value', 6, 'thyroid', 'mIU/L', ''),
  numberField('t3_measured', 'T3 measured', 6, 'thyroid', '', '0/1'),
  numberField('t3', 'T3 value', 6, 'thyroid', '', ''),
  numberField('tt4_measured', 'TT4 measured', 6, 'thyroid', '', '0/1'),
  numberField('tt4', 'TT4 value', 6, 'thyroid', '', ''),
  numberField('t4u_measured', 'T4U measured', 6, 'thyroid', '', '0/1'),
  numberField('t4u', 'T4U value', 6, 'thyroid', '', ''),
  numberField('fti_measured', 'FTI measured', 6, 'thyroid', '', '0/1'),
  numberField('fti', 'FTI value', 6, 'thyroid', '', ''),
  numberField('tbg_measured', 'TBG measured', 6, 'thyroid', '', '0/1'),
  numberField('tbg', 'TBG value', 6, 'thyroid', '', ''),
  numberField('referral_source', 'Referral source', 6, 'thyroid', '', '', { visible: false }),
];

export const PCOS_FEATURE_KEYS = ASSESSMENT_FIELDS.filter((field) => field.model === 'pcos').map((field) => field.key);
export const DIABETES_FEATURE_KEYS = ASSESSMENT_FIELDS.filter((field) => field.model === 'diabetes').map((field) => field.key);
export const THYROID_FEATURE_KEYS = ASSESSMENT_FIELDS.filter((field) => field.model === 'thyroid').map((field) => field.key);

export const REQUIRED_ASSESSMENT_FIELDS = new Set([
  'Age_yrs',
  'Weight_Kg',
  'Height_Cm',
  'Cycle_length_days',
  'GenHlth',
  'Age',
  'age',
  'sex',
]);

export function getInitialAssessmentForm() {
  const form = {};

  ASSESSMENT_FIELDS.forEach((field) => {
    if (!(field.key in form)) {
      form[field.key] = field.defaultValue ?? (field.type === 'yesno' ? '0' : '');
    }
  });

  return form;
}

export function getFieldsForStep(stepId) {
  return ASSESSMENT_FIELDS.filter(
    (field) => field.step === stepId && field.visible !== false
  );
}

export function mapProfileToAssessmentForm(profile = {}) {
  const mapped = {};

  if (profile.age) {
    mapped.Age_yrs = String(profile.age);
    mapped.age = String(profile.age);
  }
  if (profile.weight) mapped.Weight_Kg = String(profile.weight);
  if (profile.height) mapped.Height_Cm = String(profile.height);
  if (profile.periodRegularity) {
    mapped.Cycle_R_I = profile.periodRegularity === 'Regular' ? '1' : '0';
  }
  if (profile.cycleLength) mapped.Cycle_length_days = String(profile.cycleLength);
  if (profile.gender === 'Female' || profile.gender === 'Male') {
    const sexValue = profile.gender === 'Female' ? '0' : '1';
    mapped.Sex = sexValue;
    mapped.sex = sexValue;
  }

  return mapped;
}

function parseNumericValue(value) {
  if (value === '' || value === null || value === undefined) {
    return null;
  }

  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : null;
}

export function enrichDerivedValues(form) {
  const next = { ...form };

  const weight = parseNumericValue(next.Weight_Kg);
  const height = parseNumericValue(next.Height_Cm);

  if (!next.BMI && weight && height) {
    const heightM = height / 100;
    next.BMI = String(Math.round((weight / (heightM * heightM)) * 10) / 10);
  }

  const waist = parseNumericValue(next.Waist_inch);
  const hip = parseNumericValue(next.Hip_inch);

  if (!next.Waist_Hip_Ratio && waist && hip) {
    next.Waist_Hip_Ratio = String(Math.round((waist / hip) * 100) / 100);
  }

  const fsh = parseNumericValue(next.FSH_mIU_mL);
  const lh = parseNumericValue(next.LH_mIU_mL);

  if (!next.FSH_LH && fsh && lh) {
    next.FSH_LH = String(Math.round((fsh / lh) * 100) / 100);
  }

  if (!next.BMI && next.Weight_Kg && next.Height_Cm) {
    const w = parseNumericValue(next.Weight_Kg);
    const h = parseNumericValue(next.Height_Cm);
    if (w && h) {
      const hm = h / 100;
      const bmi = Math.round((w / (hm * hm)) * 10) / 10;
      if (!next.BMI) next.BMI = String(bmi);
      if (!form.BMI || form.model !== 'diabetes') {
        // diabetes model also uses BMI key
      }
    }
  }

  return next;
}

export function buildModelPayloads(form) {
  const enriched = enrichDerivedValues(form);
  const toPayload = (keys) => {
    const payload = {};

    keys.forEach((key) => {
      const raw = enriched[key];
      if (raw === '' || raw === null || raw === undefined) {
        payload[key] = null;
        return;
      }

      payload[key] = Number(raw);
    });

    return payload;
  };

  return {
    pcos: toPayload(PCOS_FEATURE_KEYS),
    diabetes: toPayload(DIABETES_FEATURE_KEYS),
    thyroid: toPayload(THYROID_FEATURE_KEYS),
  };
}

export function validateStep(stepId, form) {
  const errors = {};
  const requiredByStep = {
    1: ['Age_yrs', 'Weight_Kg', 'Height_Cm'],
    2: ['Cycle_length_days'],
    5: ['GenHlth'],
    6: ['age', 'sex'],
  };

  (requiredByStep[stepId] || []).forEach((key) => {
    if (!form[key] && form[key] !== 0 && form[key] !== '0') {
      errors[key] = 'Please enter this so we can continue.';
    }
  });

  const numericRules = {
    Age_yrs: [10, 120, 'Enter an age between 10 and 120 years.'],
    Height_Cm: [50, 250, 'Enter a height between 50 and 250 cm.'],
    Weight_Kg: [20, 300, 'Enter a weight between 20 and 300 kg.'],
  };

  (requiredByStep[stepId] || []).forEach((key) => {
    const rule = numericRules[key];
    if (!rule || !form[key]) return;

    const value = Number(form[key]);
    if (!Number.isFinite(value) || value < rule[0] || value > rule[1]) {
      errors[key] = rule[2];
    }
  });

  return errors;
}
