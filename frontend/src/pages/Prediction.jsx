import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import {
  ASSESSMENT_STEPS,
  buildModelPayloads,
  enrichDerivedValues,
  getFieldsForStep,
  getInitialAssessmentForm,
  mapProfileToAssessmentForm,
  REQUIRED_ASSESSMENT_FIELDS,
  validateStep,
} from '../data/assessmentFeatures';
import { profileApi } from '../services/api';

const getAssessmentDraftKey = (userId) =>
  `femoraai_assessment_draft:${userId || 'anonymous'}`;

const getInitialForm = (draftKey) => {
  const initialForm = getInitialAssessmentForm();
  const storedDraft = sessionStorage.getItem(draftKey);

  if (!storedDraft) {
    return initialForm;
  }

  try {
    return {
      ...initialForm,
      ...JSON.parse(storedDraft),
    };
  } catch {
    sessionStorage.removeItem(draftKey);
    return initialForm;
  }
};

function Prediction() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const draftKey = getAssessmentDraftKey(user?.id);

  const [currentStep, setCurrentStep] = useState(1);
  const [form, setForm] = useState(() => getInitialForm(draftKey));
  const [errors, setErrors] = useState({});
  const [submitError, setSubmitError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const currentStepData = ASSESSMENT_STEPS[currentStep - 1];
  const stepFields = getFieldsForStep(currentStep);
  const displayedForm = enrichDerivedValues(form);
  const progress = (currentStep / ASSESSMENT_STEPS.length) * 100;

  useEffect(() => {
    sessionStorage.setItem(draftKey, JSON.stringify(form));
  }, [draftKey, form]);

  useEffect(() => {
    let isMounted = true;

    profileApi.getProfile().then(({ data }) => {
      if (!isMounted || !data?.success) return;

      const mappedValues = mapProfileToAssessmentForm(data.profile);
      setForm((previous) => {
        const next = { ...previous };

        Object.entries(mappedValues).forEach(([key, value]) => {
          if (!next[key]) next[key] = value;
        });

        return next;
      });
    }).catch(() => {});

    return () => {
      isMounted = false;
    };
  }, [draftKey]);

  const updateField = (field, value) => {
    setForm((previous) => ({
      ...previous,
      [field]: value,
    }));

    setErrors((previous) => ({
      ...previous,
      [field]: '',
    }));
  };

  const nextStep = () => {
    const stepErrors = validateStep(currentStep, form);

    if (Object.keys(stepErrors).length > 0) {
      setErrors(stepErrors);
      return;
    }

    if (currentStep < ASSESSMENT_STEPS.length) {
      setCurrentStep((previous) => previous + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const previousStep = () => {
    if (currentStep > 1) {
      setCurrentStep((previous) => previous - 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const submitAssessment = async () => {
    const stepErrors = validateStep(currentStep, form);

    if (Object.keys(stepErrors).length > 0) {
      setErrors(stepErrors);
      return;
    }

    setIsSubmitting(true);
    setSubmitError('');

    try {
      const enrichedForm = enrichDerivedValues(form);
      const payloads = buildModelPayloads(enrichedForm);

      const { data } = await api.post('/api/predictions/assessment', payloads);

      if (!data.success) {
        throw new Error(data.message || 'Assessment failed');
      }

      localStorage.setItem('femoraai_latest_assessment', JSON.stringify(data.assessment));
      sessionStorage.removeItem(draftKey);
      navigate('/dashboard');
    } catch (error) {
      setSubmitError(
        error.response?.data?.message ||
          error.message ||
          'Unable to complete assessment. Ensure the AI service and backend are running.'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderField = (field) => {
    if (field.type === 'yesno') {
      const selected = form[field.key] === '1';

      return (
        <button
          type="button"
          key={field.key}
          className={`symptom-option ${selected ? 'symptom-option--selected' : ''}`}
          onClick={() => updateField(field.key, selected ? '0' : '1')}
          aria-pressed={selected}
        >
          <span className="symptom-option__label">{field.label}</span>
          <span className="symptom-option__check">{selected ? 'Yes' : 'No'}</span>
        </button>
      );
    }

    if (field.type === 'select') {
      return (
        <div className="prediction-field" key={field.key}>
          <label htmlFor={field.key}>{field.label}</label>
          <select
            id={field.key}
            value={form[field.key]}
            onChange={(event) => updateField(field.key, event.target.value)}
            className={errors[field.key] ? 'prediction-input--error' : undefined}
          >
            <option value="">Select an option</option>
            {field.options.map((option) => (
              <option key={option.value} value={option.value}>{option.label}</option>
            ))}
          </select>
          {errors[field.key] && <small className="form-error">{errors[field.key]}</small>}
        </div>
      );
    }

    return (
      <div className="prediction-field" key={field.key}>
        <label htmlFor={field.key}>
          {field.label}
          {!REQUIRED_ASSESSMENT_FIELDS.has(field.key) && (
            <span className="prediction-field__optional">Optional</span>
          )}
        </label>

        <div className={field.unit ? 'prediction-input-with-unit' : undefined}>
          <input
            id={field.key}
            type="number"
            step="any"
            placeholder={field.placeholder}
            value={displayedForm[field.key]}
            onChange={(event) => updateField(field.key, event.target.value)}
            readOnly={field.computed}
            aria-readonly={field.computed || undefined}
            className={errors[field.key] ? 'prediction-input--error' : undefined}
          />
          {field.unit && <span>{field.unit}</span>}
        </div>

        {(field.helper || !REQUIRED_ASSESSMENT_FIELDS.has(field.key)) && (
          <small>
            {field.helper || 'Leave this blank if you do not know it.'}
          </small>
        )}

        {errors[field.key] && (
          <small className="form-error">{errors[field.key]}</small>
        )}
      </div>
    );
  };

  return (
    <div className="prediction-page">
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
            <span className="prediction-eyebrow">FEMORAAI · OPTIONAL AI ASSESSMENT</span>
            <h1>Detailed Health Assessment</h1>
            <p className="prediction-header__description">
              Optional: complete this assessment for deeper PCOS, diabetes, and thyroid
              insights. Some questions may require information from previous medical
              tests or reports.
            </p>
          </div>
        </div>

        <div className="prediction-step-count">
          Step {currentStep} of {ASSESSMENT_STEPS.length}
        </div>
      </header>

      <div className="prediction-progress-wrapper">
        <div className="prediction-progress-track">
          <div className="prediction-progress-bar" style={{ width: `${progress}%` }} />
        </div>

        <div className="prediction-progress-steps">
          {ASSESSMENT_STEPS.map((step) => (
            <div
              key={step.id}
              className={`prediction-progress-step ${
                step.id <= currentStep ? 'prediction-progress-step--active' : ''
              }`}
            >
              <span>{step.id < currentStep ? '✓' : step.id}</span>
              <small>{step.title}</small>
            </div>
          ))}
        </div>
      </div>

      <main className="prediction-main">
        <section className="prediction-card">
          <div className="prediction-card__header">
            <span className="prediction-card__step">STEP {currentStep}</span>
            <h2>{currentStepData.title}</h2>
            <p>{currentStepData.subtitle}</p>
          </div>

          {submitError && (
            <div className="form-alert form-alert--error" role="alert">
              {submitError}
            </div>
          )}

          <div className="prediction-form">
            {currentStep === 4 ? (
              <div className="symptom-grid">{stepFields.map(renderField)}</div>
            ) : (
              <div className="prediction-field-grid">{stepFields.map(renderField)}</div>
            )}

            {currentStep === 1 && (
              <div className="prediction-info-box">
                <span>i</span>
                <div>
                  <strong>Nothing clinical to look up</strong>
                  <p>
                    Use your usual height and weight. FemoraAI calculates your BMI
                    automatically, and you can share other health details later only
                    if you have them.
                  </p>
                </div>
              </div>
            )}

            {currentStep === ASSESSMENT_STEPS.length && (
              <div className="prediction-review">
                <div className="prediction-review__icon">✦</div>
                <div>
                  <strong>Ready for your assessment?</strong>
                  <p>
                    FemoraAI will run your trained PCOS, diabetes, and thyroid models
                    using the exact features they were trained on.
                  </p>
                </div>
              </div>
            )}
          </div>

          <div className="prediction-navigation">
            <button
              type="button"
              className="prediction-secondary-button"
              onClick={previousStep}
              disabled={currentStep === 1 || isSubmitting}
            >
              ← Back
            </button>

            {currentStep < ASSESSMENT_STEPS.length ? (
              <button
                type="button"
                className="prediction-primary-button"
                onClick={nextStep}
              >
                Continue <span>→</span>
              </button>
            ) : (
              <button
                type="button"
                className="prediction-primary-button"
                onClick={submitAssessment}
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Analysing...' : 'Run AI Assessment'}
                {!isSubmitting && <span>✦</span>}
              </button>
            )}
          </div>
        </section>

        <aside className="prediction-side-panel">
          <div className="prediction-side-card">
            <div className="prediction-side-icon">✦</div>
            <h3>Model-driven assessment</h3>
            <p>
              We keep the user questions simple while preserving the exact feature
              keys expected by your trained PCOS, diabetes, and thyroid models.
            </p>

            <div className="prediction-side-list">
              <div><span>✓</span> PCOS — 41 features</div>
              <div><span>✓</span> Diabetes — 21 features</div>
              <div><span>✓</span> Thyroid — 29 features</div>
            </div>
          </div>

          <div className="prediction-disclaimer">
            <span>ⓘ</span>
            <p>
              These predictions are generated by trained ML models and are not a
              medical diagnosis. Consult a qualified healthcare professional.
            </p>
          </div>
        </aside>
      </main>
    </div>
  );
}

export default Prediction;
