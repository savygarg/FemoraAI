import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { formatDisplayDate } from '../data/mockData';
import api, { profileApi } from '../services/api';

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

const STRESS_OPTIONS = ['Low', 'Moderate', 'High'];

const PERIOD_OPTIONS = ['Regular', 'Irregular'];

const MENSTRUAL_FLOW_OPTIONS = ['Light', 'Medium', 'Heavy'];

const EXERCISE_OPTIONS = [
  'Rarely',
  '1-2 times per week',
  '3-4 times per week',
  '5+ times per week',
];

function HealthProfile() {
  const navigate = useNavigate();
  const { user, refreshUser } = useAuth();

  useEffect(() => {
    refreshUser().catch(() => {});
  }, [refreshUser]);

  const [profile, setProfile] = useState(DEFAULT_HEALTH_PROFILE);

  const [errors, setErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    let isMounted = true;

    const loadSavedProfile = async () => {
      try {
        const { data } = await profileApi.getProfile();

        if (!isMounted || !data?.success) {
          return;
        }

        setProfile({
          ...DEFAULT_HEALTH_PROFILE,
          ...(data.profile || {}),
        });
      } catch {
        if (!isMounted) {
          return;
        }

        const localProfile = readStorage(
          STORAGE_KEYS.HEALTH_PROFILE,
          DEFAULT_HEALTH_PROFILE
        );

        setProfile({
          ...DEFAULT_HEALTH_PROFILE,
          ...(localProfile || {}),
        });
      }
    };

    loadSavedProfile();

    return () => {
      isMounted = false;
    };
  }, []);

  const bmi = calculateBmi(profile.weight, profile.height);
  const bmiCategory = getBmiCategory(bmi);

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

    if (!profile.bloodGroup) {
      nextErrors.bloodGroup = 'Select your blood group.';
    }

    if (!profile.periodRegularity) {
      nextErrors.periodRegularity = 'Select your cycle regularity.';
    }

    if (!profile.cycleLength || Number(profile.cycleLength) <= 0) {
      nextErrors.cycleLength = 'Enter your average cycle length.';
    }

    if (!profile.menstrualFlow) {
      nextErrors.menstrualFlow = 'Select your menstrual flow.';
    }

    setErrors(nextErrors);

    return Object.keys(nextErrors).length === 0;
  };

  const handleSave = async (event) => {
    event.preventDefault();

    if (!validate()) {
      return;
    }

    try {
      await api.put('/api/profile', profile);
      writeStorage(STORAGE_KEYS.HEALTH_PROFILE, profile);

      setSuccessMessage(
        'Your health profile has been saved successfully.'
      );

      window.scrollTo({
        top: 0,
        behavior: 'smooth',
      });

      navigate('/dashboard');
    } catch (error) {
      setErrors({
        server: error.response?.data?.message || 'Unable to save your profile right now.',
      });
    }
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
            FEMORAAI · BASIC HEALTH PROFILE
          </span>

          <h1>Basic Health Profile</h1>

          <p>
            Save the everyday health information you already know. You can complete
            the optional Detailed Health Assessment later.
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

      <section className="health-profile-card health-profile-account">
        <div className="health-profile-section-header">
          <div className="health-profile-section-icon">
            ◉
          </div>

          <div>
            <span>ACCOUNT</span>
            <h2>Account Information</h2>
            <p>
              Your FemoraAI account details from MongoDB.
            </p>
          </div>
        </div>

        <div className="health-profile-account-grid">
          <div className="health-profile-account-item">
            <span>Name</span>
            <strong>{user?.name || '—'}</strong>
          </div>

          <div className="health-profile-account-item">
            <span>Email</span>
            <strong>{user?.email || '—'}</strong>
          </div>

          <div className="health-profile-account-item">
            <span>Member since</span>
            <strong>{formatDisplayDate(user?.createdAt)}</strong>
          </div>
        </div>
      </section>

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
              <span>01 · EVERYDAY DETAILS</span>
              <h2>Personal Information</h2>
              <p>
                No medical testing is needed for this profile. Blood group is
                optional if you already know it.
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
                onChange={(e) => updateField('age', e.target.value)}
              />

              {errors.age && (
                <small className="health-profile-error">{errors.age}</small>
              )}
            </div>

            <div className="health-profile-field">
              <label htmlFor="profile-dob">
                Date of birth
              </label>

              <input
                id="profile-dob"
                type="date"
                className="health-profile-input"
                value={profile.dob || ''}
                onChange={(e) => updateField('dob', e.target.value)}
              />
            </div>

            <div className="health-profile-field">
              <label htmlFor="profile-gender">
                Gender
              </label>

              <select
                id="profile-gender"
                className="health-profile-input"
                value={profile.gender || 'Female'}
                onChange={(e) => updateField('gender', e.target.value)}
              >
                <option>Female</option>
                <option>Male</option>
                <option>Other</option>
              </select>
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
                  onChange={(e) => updateField('height', e.target.value)}
                />

                <span>cm</span>
              </div>

              {errors.height && (
                <small className="health-profile-error">{errors.height}</small>
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
                  onChange={(e) => updateField('weight', e.target.value)}
                />

                <span>kg</span>
              </div>

              {errors.weight && (
                <small className="health-profile-error">{errors.weight}</small>
              )}
            </div>

            <div className="health-profile-field">
              <label htmlFor="profile-blood-group">
                Blood group *
              </label>

              <select
                id="profile-blood-group"
                className="health-profile-input"
                value={profile.bloodGroup || ''}
                onChange={(e) => updateField('bloodGroup', e.target.value)}
              >
                <option value="">Select blood group</option>
                <option value="A+">A+</option>
                <option value="A-">A-</option>
                <option value="B+">B+</option>
                <option value="B-">B-</option>
                <option value="O+">O+</option>
                <option value="O-">O-</option>
                <option value="AB+">AB+</option>
                <option value="AB-">AB-</option>
              </select>

              {errors.bloodGroup && (
                <small className="health-profile-error">{errors.bloodGroup}</small>
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
            DAILY WELLNESS
        ========================== */}

        <section className="health-profile-card">

          <div className="health-profile-section-header">
            <div className="health-profile-section-icon">
              ✦
            </div>

            <div>
              <span>02 · LIFESTYLE BASICS</span>
              <h2>Daily Wellness</h2>
              <p>
                These everyday cycle details are required for your basic health
                profile. No medical report is needed.
              </p>
            </div>
          </div>

          <div className="health-profile-grid">

            <div className="health-profile-field">
              <label htmlFor="profile-regularity">
                Is your menstrual cycle regular? *
              </label>

              <select
                id="profile-regularity"
                className={
                  errors.periodRegularity
                    ? 'health-profile-input health-profile-input--error'
                    : 'health-profile-input'
                }
                value={profile.periodRegularity || ''}
                onChange={(e) => updateField('periodRegularity', e.target.value)}
              >
                <option value="">Select regularity</option>
                {PERIOD_OPTIONS.map((option) => (
                  <option key={option} value={option}>{option}</option>
                ))}
              </select>

              {errors.periodRegularity && (
                <small className="health-profile-error">{errors.periodRegularity}</small>
              )}
            </div>

            <div className="health-profile-field">
              <label htmlFor="profile-cycle-length">
                Average menstrual cycle length *
              </label>

              <div className="health-profile-input-unit">
                <input
                  id="profile-cycle-length"
                  type="number"
                  min="1"
                  max="120"
                  placeholder="e.g. 28"
                  className={
                    errors.cycleLength
                      ? 'health-profile-input health-profile-input--error'
                      : 'health-profile-input'
                  }
                  value={profile.cycleLength || ''}
                  onChange={(e) => updateField('cycleLength', e.target.value)}
                />
                <span>days</span>
              </div>

              {errors.cycleLength && (
                <small className="health-profile-error">{errors.cycleLength}</small>
              )}
            </div>

            <div className="health-profile-field">
              <label htmlFor="profile-menstrual-flow">
                Menstrual flow *
              </label>

              <select
                id="profile-menstrual-flow"
                className={
                  errors.menstrualFlow
                    ? 'health-profile-input health-profile-input--error'
                    : 'health-profile-input'
                }
                value={profile.menstrualFlow || ''}
                onChange={(e) => updateField('menstrualFlow', e.target.value)}
              >
                <option value="">Select flow</option>
                {MENSTRUAL_FLOW_OPTIONS.map((option) => (
                  <option key={option} value={option}>{option}</option>
                ))}
              </select>

              {errors.menstrualFlow && (
                <small className="health-profile-error">{errors.menstrualFlow}</small>
              )}
            </div>

            <div className="health-profile-field">
              <label htmlFor="profile-exercise">
                Exercise Frequency
              </label>

              <select
                id="profile-exercise"
                className="health-profile-input"
                value={profile.exerciseFrequency}
                onChange={(e) => updateField('exerciseFrequency', e.target.value)}
              >
                {EXERCISE_OPTIONS.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </div>

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
                  onChange={(e) => updateField('sleepDuration', e.target.value)}
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
                onChange={(e) => updateField('stressLevel', e.target.value)}
              >
                {STRESS_OPTIONS.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </div>

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