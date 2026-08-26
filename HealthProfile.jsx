import { useState } from 'react';

import {
  DEFAULT_HEALTH_PROFILE,
  calculateBmi,
  getBmiCategory,
} from '../data/mockData';

import {
  readStorage,
  writeStorage,
  STORAGE_KEYS,
} from '../utils/storage';

const PERIOD_OPTIONS = ['Regular', 'Irregular', 'Not sure'];

const STRESS_OPTIONS = ['Low', 'Moderate', 'High'];

const EXERCISE_OPTIONS = [
  'Rarely',
  '1-2 times per week',
  '3-4 times per week',
  '5+ times per week',
];

const SYMPTOM_OPTIONS = [
  'Irregular periods',
  'Heavy periods',
  'Painful periods',
  'Pelvic pain',
  'Acne',
  'Hair fall / thinning',
  'Excess facial/body hair',
  'Unexplained weight gain',
  'Unexplained weight loss',
  'Fatigue / low energy',
  'Dizziness',
  'Frequent headaches',
  'Mood changes',
  'Difficulty concentrating',
  'Feeling unusually cold',
  'Feeling unusually hot',
];

function HealthProfile() {
  const [profile, setProfile] = useState(() =>
    readStorage(STORAGE_KEYS.HEALTH_PROFILE, DEFAULT_HEALTH_PROFILE)
  );

  const [errors, setErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState('');

  const bmi = calculateBmi(profile.weight, profile.height);
  const bmiCategory = getBmiCategory(bmi);

  const selectedSymptoms = Array.isArray(profile.symptoms)
    ? profile.symptoms
    : [];

  const updateField = (field, value) => {
    setProfile((previous) => ({
      ...previous,
      [field]: value,
    }));

    setSuccessMessage('');

    if (errors[field]) {
      setErrors((previous) => ({
        ...previous,
        [field]: '',
      }));
    }
  };

  const toggleSymptom = (symptom) => {
    setProfile((previous) => {
      const symptoms = Array.isArray(previous.symptoms)
        ? previous.symptoms
        : [];

      const exists = symptoms.includes(symptom);

      return {
        ...previous,
        symptoms: exists
          ? symptoms.filter((item) => item !== symptom)
          : [...symptoms, symptom],
      };
    });

    setSuccessMessage('');
  };

  const validate = () => {
    const nextErrors = {};

    if (!profile.age || Number(profile.age) <= 0) {
      nextErrors.age = 'Enter a valid age.';
    }

    if (!profile.height || Number(profile.height) <= 0) {
      nextErrors.height = 'Enter a valid height.';
    }

    if (!profile.weight || Number(profile.weight) <= 0) {
      nextErrors.weight = 'Enter a valid weight.';
    }

    if (!profile.cycleLength || Number(profile.cycleLength) <= 0) {
      nextErrors.cycleLength = 'Enter your average cycle length.';
    }

    if (
      !profile.sleepDuration ||
      Number(profile.sleepDuration) <= 0
    ) {
      nextErrors.sleepDuration =
        'Enter your average sleep duration.';
    }

    setErrors(nextErrors);

    return Object.keys(nextErrors).length === 0;
  };

  const handleSave = (event) => {
    event.preventDefault();

    if (!validate()) {
      return;
    }

    writeStorage(STORAGE_KEYS.HEALTH_PROFILE, profile);

    setSuccessMessage(
      'Your health profile has been saved successfully.'
    );

    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  const handleReset = () => {
    setProfile({
      ...DEFAULT_HEALTH_PROFILE,
      symptoms: [],
    });

    setErrors({});
    setSuccessMessage('');
  };

  return (
    <div className="health-profile-page">

      {/* =========================
          HEADER
      ========================== */}

      <header className="health-profile-header">
        <div>
          <span className="health-profile-eyebrow">
            FEMORAAI · PERSONAL HEALTH
          </span>

          <h1>Health Profile</h1>

          <p>
            Keep your health information up to date for more
            personalised AI assessments and insights.
          </p>
        </div>

        <div className="health-profile-header-icon">
          ♡
        </div>
      </header>

      {/* =========================
          SUCCESS MESSAGE
      ========================== */}

      {successMessage && (
        <div
          className="health-profile-success"
          role="status"
        >
          <span>✓</span>
          {successMessage}
        </div>
      )}

      <form
        className="health-profile-form"
        onSubmit={handleSave}
        noValidate
      >

        {/* =========================
            PERSONAL INFORMATION
        ========================== */}

        <section className="health-profile-card">

          <div className="health-profile-section-header">
            <div className="health-profile-section-icon">
              ♡
            </div>

            <div>
              <span>01 · BASIC DETAILS</span>
              <h2>Personal Information</h2>
              <p>
                These details help establish your basic health
                profile.
              </p>
            </div>
          </div>

          <div className="health-profile-grid">

            <div className="health-profile-field">
              <label htmlFor="profile-age">
                Age
              </label>

              <input
                id="profile-age"
                type="number"
                min="1"
                max="120"
                placeholder="e.g. 22"
                className={
                  errors.age
                    ? 'health-profile-input health-profile-input--error'
                    : 'health-profile-input'
                }
                value={profile.age}
                onChange={(e) =>
                  updateField('age', e.target.value)
                }
              />

              {errors.age && (
                <small className="health-profile-error">
                  {errors.age}
                </small>
              )}
            </div>

            <div className="health-profile-field">
              <label htmlFor="profile-height">
                Height
              </label>

              <div className="health-profile-input-unit">
                <input
                  id="profile-height"
                  type="number"
                  min="50"
                  max="250"
                  placeholder="e.g. 165"
                  className={
                    errors.height
                      ? 'health-profile-input health-profile-input--error'
                      : 'health-profile-input'
                  }
                  value={profile.height}
                  onChange={(e) =>
                    updateField('height', e.target.value)
                  }
                />

                <span>cm</span>
              </div>

              {errors.height && (
                <small className="health-profile-error">
                  {errors.height}
                </small>
              )}
            </div>

            <div className="health-profile-field">
              <label htmlFor="profile-weight">
                Weight
              </label>

              <div className="health-profile-input-unit">
                <input
                  id="profile-weight"
                  type="number"
                  min="20"
                  max="300"
                  step="0.1"
                  placeholder="e.g. 60"
                  className={
                    errors.weight
                      ? 'health-profile-input health-profile-input--error'
                      : 'health-profile-input'
                  }
                  value={profile.weight}
                  onChange={(e) =>
                    updateField('weight', e.target.value)
                  }
                />

                <span>kg</span>
              </div>

              {errors.weight && (
                <small className="health-profile-error">
                  {errors.weight}
                </small>
              )}
            </div>
          </div>

          {/* BMI */}

          {bmi != null && (
            <div className="health-profile-bmi">

              <div>
                <span>BMI</span>
                <strong>{bmi}</strong>
              </div>

              <div className="health-profile-bmi-divider" />

              <div>
                <span>Category</span>
                <strong>{bmiCategory}</strong>
              </div>

            </div>
          )}

        </section>


        {/* =========================
            MENSTRUAL HEALTH
        ========================== */}

        <section className="health-profile-card">

          <div className="health-profile-section-header">
            <div className="health-profile-section-icon">
              ◌
            </div>

            <div>
              <span>02 · MENSTRUAL HEALTH</span>
              <h2>Menstrual Health</h2>
              <p>
                Track your cycle patterns to support better
                health insights.
              </p>
            </div>
          </div>

          <div className="health-profile-grid">

            <div className="health-profile-field">
              <label htmlFor="profile-cycle">
                Average Cycle Length
              </label>

              <div className="health-profile-input-unit">
                <input
                  id="profile-cycle"
                  type="number"
                  min="15"
                  max="90"
                  placeholder="e.g. 28"
                  className={
                    errors.cycleLength
                      ? 'health-profile-input health-profile-input--error'
                      : 'health-profile-input'
                  }
                  value={profile.cycleLength}
                  onChange={(e) =>
                    updateField(
                      'cycleLength',
                      e.target.value
                    )
                  }
                />

                <span>days</span>
              </div>

              {errors.cycleLength && (
                <small className="health-profile-error">
                  {errors.cycleLength}
                </small>
              )}
            </div>

            <div className="health-profile-field">
              <label htmlFor="profile-regularity">
                Period Regularity
              </label>

              <select
                id="profile-regularity"
                className="health-profile-input"
                value={profile.periodRegularity}
                onChange={(e) =>
                  updateField(
                    'periodRegularity',
                    e.target.value
                  )
                }
              >
                {PERIOD_OPTIONS.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </div>

          </div>

        </section>


        {/* =========================
            LIFESTYLE
        ========================== */}

        <section className="health-profile-card">

          <div className="health-profile-section-header">
            <div className="health-profile-section-icon">
              ✦
            </div>

            <div>
              <span>03 · DAILY WELLNESS</span>
              <h2>Lifestyle</h2>
              <p>
                Tell us about your everyday habits and routines.
              </p>
            </div>
          </div>

          <div className="health-profile-grid">

            <div className="health-profile-field">
              <label htmlFor="profile-sleep">
                Average Sleep
              </label>

              <div className="health-profile-input-unit">
                <input
                  id="profile-sleep"
                  type="number"
                  min="1"
                  max="24"
                  step="0.5"
                  placeholder="e.g. 7.5"
                  className={
                    errors.sleepDuration
                      ? 'health-profile-input health-profile-input--error'
                      : 'health-profile-input'
                  }
                  value={profile.sleepDuration}
                  onChange={(e) =>
                    updateField(
                      'sleepDuration',
                      e.target.value
                    )
                  }
                />

                <span>hours</span>
              </div>

              {errors.sleepDuration && (
                <small className="health-profile-error">
                  {errors.sleepDuration}
                </small>
              )}
            </div>

            <div className="health-profile-field">
              <label htmlFor="profile-stress">
                Stress Level
              </label>

              <select
                id="profile-stress"
                className="health-profile-input"
                value={profile.stressLevel}
                onChange={(e) =>
                  updateField(
                    'stressLevel',
                    e.target.value
                  )
                }
              >
                {STRESS_OPTIONS.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </div>

            <div className="health-profile-field health-profile-field--full">
              <label htmlFor="profile-exercise">
                Exercise Frequency
              </label>

              <select
                id="profile-exercise"
                className="health-profile-input"
                value={profile.exerciseFrequency}
                onChange={(e) =>
                  updateField(
                    'exerciseFrequency',
                    e.target.value
                  )
                }
              >
                {EXERCISE_OPTIONS.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </div>

          </div>

        </section>


        {/* =========================
            SYMPTOMS
        ========================== */}

        <section className="health-profile-card">

          <div className="health-profile-section-header">
            <div className="health-profile-section-icon">
              ⌁
            </div>

            <div>
              <span>04 · CURRENT HEALTH</span>
              <h2>Symptoms</h2>
              <p>
                Select all symptoms you are currently
                experiencing.
              </p>
            </div>
          </div>

          <div className="health-profile-symptom-top">

            <span>
              Select all that apply
            </span>

            <strong>
              {selectedSymptoms.length} selected
            </strong>

          </div>

          <div className="health-profile-symptom-grid">

            {SYMPTOM_OPTIONS.map((symptom) => {

              const selected =
                selectedSymptoms.includes(symptom);

              return (
                <button
                  type="button"
                  key={symptom}
                  className={`health-profile-symptom ${
                    selected
                      ? 'health-profile-symptom--selected'
                      : ''
                  }`}
                  onClick={() =>
                    toggleSymptom(symptom)
                  }
                  aria-pressed={selected}
                >
                  <span className="health-profile-symptom-check">
                    {selected ? '✓' : ''}
                  </span>

                  <span>
                    {symptom}
                  </span>
                </button>
              );
            })}

          </div>

          <div className="health-profile-symptom-note">
            <span>ⓘ</span>
            <p>
              You can select multiple symptoms. This information
              can later be used by the AI assessment.
            </p>
          </div>

        </section>


        {/* =========================
            DISCLAIMER
        ========================== */}

        <div className="health-profile-disclaimer">
          <span>ⓘ</span>

          <p>
            Health information is user-provided. BMI is a basic
            calculation and does not account for individual
            medical factors. FemoraAI insights are informational
            and do not replace professional medical advice.
          </p>
        </div>


        {/* =========================
            ACTIONS
        ========================== */}

        <div className="health-profile-actions">

          <button
            type="button"
            className="health-profile-reset"
            onClick={handleReset}
          >
            Reset
          </button>

          <button
            type="submit"
            className="health-profile-save"
          >
            Save Profile
            <span>→</span>
          </button>

        </div>

      </form>

    </div>
  );
}

export default HealthProfile;