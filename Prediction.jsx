import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const steps = [
  {
    id: 1,
    title: 'About you',
    subtitle: 'Let’s start with some basic information.',
  },
  {
    id: 2,
    title: 'Menstrual health',
    subtitle: 'Tell us about your menstrual patterns.',
  },
  {
    id: 3,
    title: 'Symptoms',
    subtitle: 'Select all symptoms you are currently experiencing.',
  },
  {
    id: 4,
    title: 'Lifestyle',
    subtitle: 'A few questions about your everyday health.',
  },
  {
    id: 5,
    title: 'Health markers',
    subtitle: 'Add available blood or health measurements.',
  },
];

const symptomOptions = [
  {
    id: 'irregular_periods',
    label: 'Irregular periods',
    icon: '◌',
  },
  {
    id: 'heavy_periods',
    label: 'Heavy periods',
    icon: '◉',
  },
  {
    id: 'painful_periods',
    label: 'Painful periods',
    icon: '♡',
  },
  {
    id: 'pelvic_pain',
    label: 'Pelvic pain',
    icon: '⌁',
  },
  {
    id: 'acne',
    label: 'Acne',
    icon: '✦',
  },
  {
    id: 'hair_fall',
    label: 'Hair fall / thinning',
    icon: '⌇',
  },
  {
    id: 'excess_hair',
    label: 'Excess facial/body hair',
    icon: '✧',
  },
  {
    id: 'weight_gain',
    label: 'Unexplained weight gain',
    icon: '↗',
  },
  {
    id: 'weight_loss',
    label: 'Unexplained weight loss',
    icon: '↘',
  },
  {
    id: 'fatigue',
    label: 'Fatigue / low energy',
    icon: '☼',
  },
  {
    id: 'dizziness',
    label: 'Dizziness',
    icon: '◒',
  },
  {
    id: 'headaches',
    label: 'Frequent headaches',
    icon: '⌁',
  },
  {
    id: 'mood_changes',
    label: 'Mood changes',
    icon: '☁',
  },
  {
    id: 'difficulty_concentrating',
    label: 'Difficulty concentrating',
    icon: '◎',
  },
  {
    id: 'cold_intolerance',
    label: 'Feeling unusually cold',
    icon: '❄',
  },
  {
    id: 'heat_intolerance',
    label: 'Feeling unusually hot',
    icon: '☀',
  },
];

const initialForm = {
  age: '',
  height: '',
  weight: '',
  cycleLength: '',
  periodDuration: '',
  cycleRegularity: '',
  lastPeriod: '',
  symptoms: [],
  activityLevel: '',
  sleepHours: '',
  stressLevel: '',
  waterIntake: '',
  hemoglobin: '',
  tsh: '',
  fastingGlucose: '',
  vitaminD: '',
};

function Prediction() {
  const navigate = useNavigate();

  const [currentStep, setCurrentStep] = useState(1);
  const [form, setForm] = useState(initialForm);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const currentStepData = steps[currentStep - 1];

  const updateField = (field, value) => {
    setForm((previous) => ({
      ...previous,
      [field]: value,
    }));
  };

  const toggleSymptom = (symptomId) => {
    setForm((previous) => {
      const exists = previous.symptoms.includes(symptomId);

      return {
        ...previous,
        symptoms: exists
          ? previous.symptoms.filter((item) => item !== symptomId)
          : [...previous.symptoms, symptomId],
      };
    });
  };

  const nextStep = () => {
    if (currentStep < steps.length) {
      setCurrentStep((previous) => previous + 1);
      window.scrollTo({
        top: 0,
        behavior: 'smooth',
      });
    }
  };

  const previousStep = () => {
    if (currentStep > 1) {
      setCurrentStep((previous) => previous - 1);
      window.scrollTo({
        top: 0,
        behavior: 'smooth',
      });
    }
  };

  const submitAssessment = async () => {
    setIsSubmitting(true);

    /*
     * TEMPORARY FRONTEND-ONLY LOGIC
     *
     * Later your friend's backend API can replace this section.
     *
     * Example:
     *
     * const response = await fetch('/api/prediction', {
     *   method: 'POST',
     *   headers: { 'Content-Type': 'application/json' },
     *   body: JSON.stringify(form),
     * });
     *
     * const result = await response.json();
     */

    localStorage.setItem(
      'femoraai_assessment',
      JSON.stringify({
        ...form,
        submittedAt: new Date().toISOString(),
      })
    );

    setTimeout(() => {
      setIsSubmitting(false);
      navigate('/results');
    }, 900);
  };

  const progress = (currentStep / steps.length) * 100;

  return (
    <div className="prediction-page">

      {/* =====================================================
          HEADER
      ====================================================== */}

      <header className="prediction-header">

        <div className="prediction-header__left">

          <button
            type="button"
            className="prediction-back"
            onClick={() => navigate('/dashboard')}
            aria-label="Back to dashboard"
          >
            ←
          </button>

          <div>
            <span className="prediction-eyebrow">
              FEMORAAI · AI HEALTH ASSESSMENT
            </span>

            <h1>Let’s understand your health</h1>
          </div>

        </div>

        <div className="prediction-step-count">
          Step {currentStep} of {steps.length}
        </div>

      </header>


      {/* =====================================================
          PROGRESS
      ====================================================== */}

      <div className="prediction-progress-wrapper">

        <div className="prediction-progress-track">
          <div
            className="prediction-progress-bar"
            style={{ width: `${progress}%` }}
          />
        </div>

        <div className="prediction-progress-steps">

          {steps.map((step) => (

            <div
              key={step.id}
              className={`prediction-progress-step ${
                step.id <= currentStep
                  ? 'prediction-progress-step--active'
                  : ''
              }`}
            >

              <span>
                {step.id < currentStep ? '✓' : step.id}
              </span>

              <small>
                {step.title}
              </small>

            </div>

          ))}

        </div>

      </div>


      {/* =====================================================
          MAIN
      ====================================================== */}

      <main className="prediction-main">

        <section className="prediction-card">

          {/* STEP HEADER */}

          <div className="prediction-card__header">

            <span className="prediction-card__step">
              STEP {currentStep}
            </span>

            <h2>
              {currentStepData.title}
            </h2>

            <p>
              {currentStepData.subtitle}
            </p>

          </div>


          {/* =================================================
              STEP 1 — BASIC INFORMATION
          ================================================== */}

          {currentStep === 1 && (

            <div className="prediction-form">

              <div className="prediction-info-box">
                <span>✦</span>

                <div>
                  <strong>Your information stays yours.</strong>

                  <p>
                    These details help FemoraAI understand your
                    baseline health profile and personalise your
                    assessment.
                  </p>
                </div>
              </div>


              <div className="prediction-field-grid">

                <div className="prediction-field">

                  <label htmlFor="age">
                    Age
                  </label>

                  <input
                    id="age"
                    type="number"
                    min="1"
                    max="100"
                    placeholder="e.g. 22"
                    value={form.age}
                    onChange={(event) =>
                      updateField('age', event.target.value)
                    }
                  />

                  <small>
                    Your current age
                  </small>

                </div>


                <div className="prediction-field">

                  <label htmlFor="height">
                    Height
                  </label>

                  <div className="prediction-input-with-unit">

                    <input
                      id="height"
                      type="number"
                      min="50"
                      max="250"
                      placeholder="e.g. 165"
                      value={form.height}
                      onChange={(event) =>
                        updateField('height', event.target.value)
                      }
                    />

                    <span>cm</span>

                  </div>

                </div>


                <div className="prediction-field">

                  <label htmlFor="weight">
                    Weight
                  </label>

                  <div className="prediction-input-with-unit">

                    <input
                      id="weight"
                      type="number"
                      min="20"
                      max="300"
                      step="0.1"
                      placeholder="e.g. 60"
                      value={form.weight}
                      onChange={(event) =>
                        updateField('weight', event.target.value)
                      }
                    />

                    <span>kg</span>

                  </div>

                </div>

              </div>

            </div>

          )}


          {/* =================================================
              STEP 2 — MENSTRUAL HEALTH
          ================================================== */}

          {currentStep === 2 && (

            <div className="prediction-form">

              <div className="prediction-field-grid">

                <div className="prediction-field">

                  <label htmlFor="cycleLength">
                    Average cycle length
                  </label>

                  <div className="prediction-input-with-unit">

                    <input
                      id="cycleLength"
                      type="number"
                      min="15"
                      max="90"
                      placeholder="e.g. 28"
                      value={form.cycleLength}
                      onChange={(event) =>
                        updateField(
                          'cycleLength',
                          event.target.value
                        )
                      }
                    />

                    <span>days</span>

                  </div>

                  <small>
                    Count from the first day of one period
                    to the first day of the next.
                  </small>

                </div>


                <div className="prediction-field">

                  <label htmlFor="periodDuration">
                    Period duration
                  </label>

                  <div className="prediction-input-with-unit">

                    <input
                      id="periodDuration"
                      type="number"
                      min="1"
                      max="15"
                      placeholder="e.g. 5"
                      value={form.periodDuration}
                      onChange={(event) =>
                        updateField(
                          'periodDuration',
                          event.target.value
                        )
                      }
                    />

                    <span>days</span>

                  </div>

                </div>

              </div>


              <div className="prediction-question">

                <label>
                  How regular are your periods?
                </label>

                <div className="prediction-choice-grid">

                  {[
                    {
                      value: 'very_regular',
                      label: 'Very regular',
                      description: 'Usually around the same time',
                    },
                    {
                      value: 'mostly_regular',
                      label: 'Mostly regular',
                      description: 'Small changes month to month',
                    },
                    {
                      value: 'irregular',
                      label: 'Irregular',
                      description: 'Often changes significantly',
                    },
                    {
                      value: 'very_irregular',
                      label: 'Very irregular',
                      description: 'Difficult to predict',
                    },
                  ].map((option) => (

                    <button
                      type="button"
                      key={option.value}
                      className={`prediction-choice ${
                        form.cycleRegularity === option.value
                          ? 'prediction-choice--selected'
                          : ''
                      }`}
                      onClick={() =>
                        updateField(
                          'cycleRegularity',
                          option.value
                        )
                      }
                    >

                      <span className="prediction-choice__check">
                        {form.cycleRegularity === option.value
                          ? '✓'
                          : ''}
                      </span>

                      <strong>
                        {option.label}
                      </strong>

                      <small>
                        {option.description}
                      </small>

                    </button>

                  ))}

                </div>

              </div>


              <div className="prediction-field">

                <label htmlFor="lastPeriod">
                  First day of your last period
                </label>

                <input
                  id="lastPeriod"
                  type="date"
                  value={form.lastPeriod}
                  onChange={(event) =>
                    updateField(
                      'lastPeriod',
                      event.target.value
                    )
                  }
                />

              </div>

            </div>

          )}


          {/* =================================================
              STEP 3 — SYMPTOMS
          ================================================== */}

          {currentStep === 3 && (

            <div className="prediction-form">

              <div className="prediction-symptom-intro">

                <div className="prediction-symptom-count">
                  <strong>
                    {form.symptoms.length}
                  </strong>

                  <span>
                    selected
                  </span>
                </div>

                <p>
                  Select <strong>all</strong> symptoms you are
                  currently experiencing. You can choose multiple
                  options.
                </p>

              </div>


              <div className="symptom-grid">

                {symptomOptions.map((symptom) => {

                  const selected =
                    form.symptoms.includes(symptom.id);

                  return (

                    <button
                      type="button"
                      key={symptom.id}
                      className={`symptom-option ${
                        selected
                          ? 'symptom-option--selected'
                          : ''
                      }`}
                      onClick={() =>
                        toggleSymptom(symptom.id)
                      }
                      aria-pressed={selected}
                    >

                      <span className="symptom-option__icon">
                        {symptom.icon}
                      </span>

                      <span className="symptom-option__label">
                        {symptom.label}
                      </span>

                      <span className="symptom-option__check">
                        {selected ? '✓' : ''}
                      </span>

                    </button>

                  );

                })}

              </div>


              <div className="prediction-none-option">

                <button
                  type="button"
                  className={`symptom-none ${
                    form.symptoms.length === 0
                      ? 'symptom-none--selected'
                      : ''
                  }`}
                  onClick={() =>
                    updateField('symptoms', [])
                  }
                >
                  <span>
                    {form.symptoms.length === 0 ? '✓' : ''}
                  </span>

                  I’m not experiencing any of these
                </button>

              </div>

            </div>

          )}


          {/* =================================================
              STEP 4 — LIFESTYLE
          ================================================== */}

          {currentStep === 4 && (

            <div className="prediction-form">

              <div className="prediction-question">

                <label>
                  How active are you on a typical week?
                </label>

                <div className="prediction-choice-grid">

                  {[
                    {
                      value: 'sedentary',
                      label: 'Mostly sedentary',
                      description: 'Little regular physical activity',
                    },
                    {
                      value: 'light',
                      label: 'Lightly active',
                      description: 'Walking or light activity',
                    },
                    {
                      value: 'moderate',
                      label: 'Moderately active',
                      description: 'Exercise several times a week',
                    },
                    {
                      value: 'very_active',
                      label: 'Very active',
                      description: 'Frequent intense exercise',
                    },
                  ].map((option) => (

                    <button
                      type="button"
                      key={option.value}
                      className={`prediction-choice ${
                        form.activityLevel === option.value
                          ? 'prediction-choice--selected'
                          : ''
                      }`}
                      onClick={() =>
                        updateField(
                          'activityLevel',
                          option.value
                        )
                      }
                    >

                      <span className="prediction-choice__check">
                        {form.activityLevel === option.value
                          ? '✓'
                          : ''}
                      </span>

                      <strong>
                        {option.label}
                      </strong>

                      <small>
                        {option.description}
                      </small>

                    </button>

                  ))}

                </div>

              </div>


              <div className="prediction-field-grid">

                <div className="prediction-field">

                  <label htmlFor="sleepHours">
                    Average sleep
                  </label>

                  <div className="prediction-input-with-unit">

                    <input
                      id="sleepHours"
                      type="number"
                      min="0"
                      max="24"
                      step="0.5"
                      placeholder="e.g. 7.5"
                      value={form.sleepHours}
                      onChange={(event) =>
                        updateField(
                          'sleepHours',
                          event.target.value
                        )
                      }
                    />

                    <span>hours</span>

                  </div>

                </div>


                <div className="prediction-field">

                  <label>
                    Current stress level
                  </label>

                  <select
                    value={form.stressLevel}
                    onChange={(event) =>
                      updateField(
                        'stressLevel',
                        event.target.value
                      )
                    }
                  >

                    <option value="">
                      Select level
                    </option>

                    <option value="low">
                      Low
                    </option>

                    <option value="moderate">
                      Moderate
                    </option>

                    <option value="high">
                      High
                    </option>

                    <option value="very_high">
                      Very high
                    </option>

                  </select>

                </div>


                <div className="prediction-field">

                  <label htmlFor="waterIntake">
                    Daily water intake
                  </label>

                  <div className="prediction-input-with-unit">

                    <input
                      id="waterIntake"
                      type="number"
                      min="0"
                      max="20"
                      step="0.1"
                      placeholder="e.g. 2"
                      value={form.waterIntake}
                      onChange={(event) =>
                        updateField(
                          'waterIntake',
                          event.target.value
                        )
                      }
                    />

                    <span>litres</span>

                  </div>

                </div>

              </div>

            </div>

          )}


          {/* =================================================
              STEP 5 — HEALTH MARKERS
          ================================================== */}

          {currentStep === 5 && (

            <div className="prediction-form">

              <div className="prediction-info-box">

                <span>⌁</span>

                <div>

                  <strong>
                    Have a recent blood report?
                  </strong>

                  <p>
                    Enter values you already know. You can leave
                    anything blank if you don't have the result.
                  </p>

                </div>

              </div>


              <div className="prediction-field-grid">

                <div className="prediction-field">

                  <label htmlFor="hemoglobin">
                    Haemoglobin
                  </label>

                  <div className="prediction-input-with-unit">

                    <input
                      id="hemoglobin"
                      type="number"
                      min="0"
                      max="30"
                      step="0.1"
                      placeholder="e.g. 12.5"
                      value={form.hemoglobin}
                      onChange={(event) =>
                        updateField(
                          'hemoglobin',
                          event.target.value
                        )
                      }
                    />

                    <span>g/dL</span>

                  </div>

                </div>


                <div className="prediction-field">

                  <label htmlFor="tsh">
                    TSH
                  </label>

                  <div className="prediction-input-with-unit">

                    <input
                      id="tsh"
                      type="number"
                      min="0"
                      max="100"
                      step="0.01"
                      placeholder="e.g. 2.5"
                      value={form.tsh}
                      onChange={(event) =>
                        updateField(
                          'tsh',
                          event.target.value
                        )
                      }
                    />

                    <span>mIU/L</span>

                  </div>

                </div>


                <div className="prediction-field">

                  <label htmlFor="fastingGlucose">
                    Fasting glucose
                  </label>

                  <div className="prediction-input-with-unit">

                    <input
                      id="fastingGlucose"
                      type="number"
                      min="0"
                      max="500"
                      placeholder="e.g. 90"
                      value={form.fastingGlucose}
                      onChange={(event) =>
                        updateField(
                          'fastingGlucose',
                          event.target.value
                        )
                      }
                    />

                    <span>mg/dL</span>

                  </div>

                </div>


                <div className="prediction-field">

                  <label htmlFor="vitaminD">
                    Vitamin D
                  </label>

                  <div className="prediction-input-with-unit">

                    <input
                      id="vitaminD"
                      type="number"
                      min="0"
                      max="200"
                      step="0.1"
                      placeholder="e.g. 30"
                      value={form.vitaminD}
                      onChange={(event) =>
                        updateField(
                          'vitaminD',
                          event.target.value
                        )
                      }
                    />

                    <span>ng/mL</span>

                  </div>

                </div>

              </div>


              <div className="prediction-review">

                <div className="prediction-review__icon">
                  ✦
                </div>

                <div>

                  <strong>
                    Ready for your assessment?
                  </strong>

                  <p>
                    FemoraAI will analyse the information you've
                    provided and generate personalised health
                    insights.
                  </p>

                </div>

              </div>

            </div>

          )}


          {/* =================================================
              NAVIGATION
          ================================================== */}

          <div className="prediction-navigation">

            <button
              type="button"
              className="prediction-secondary-button"
              onClick={previousStep}
              disabled={currentStep === 1}
            >
              ← Back
            </button>


            {currentStep < steps.length ? (

              <button
                type="button"
                className="prediction-primary-button"
                onClick={nextStep}
              >
                Continue
                <span>→</span>
              </button>

            ) : (

              <button
                type="button"
                className="prediction-primary-button"
                onClick={submitAssessment}
                disabled={isSubmitting}
              >

                {isSubmitting
                  ? 'Analysing...'
                  : 'Run AI Assessment'}

                {!isSubmitting && (
                  <span>✦</span>
                )}

              </button>

            )}

          </div>

        </section>


        {/* ===================================================
            SIDE PANEL
        ==================================================== */}

        <aside className="prediction-side-panel">

          <div className="prediction-side-card">

            <div className="prediction-side-icon">
              ✦
            </div>

            <h3>
              Your assessment
            </h3>

            <p>
              A few minutes now can help create a more
              personalised picture of your health.
            </p>


            <div className="prediction-side-list">

              <div>
                <span>✓</span>
                Multiple health factors
              </div>

              <div>
                <span>✓</span>
                Symptom patterns
              </div>

              <div>
                <span>✓</span>
                Lifestyle indicators
              </div>

              <div>
                <span>✓</span>
                Available health markers
              </div>

            </div>

          </div>


          <div className="prediction-disclaimer">

            <span>ⓘ</span>

            <p>
              This assessment is intended for informational
              purposes and does not replace professional medical
              advice or diagnosis.
            </p>

          </div>

        </aside>

      </main>

    </div>
  );
}

export default Prediction;