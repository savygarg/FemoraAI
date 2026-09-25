import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { calculateBmi, formatDisplayDate } from '../data/mockData';
import { predictionApi, profileApi } from '../services/api';

const PROFILE_FIELDS = [
  { key: 'name', label: 'Name' },
  { key: 'age', label: 'Age' },
  { key: 'gender', label: 'Gender' },
  { key: 'height', label: 'Height', unit: 'cm' },
  { key: 'weight', label: 'Weight', unit: 'kg' },
  { key: 'bloodGroup', label: 'Blood Group' },
  { key: 'periodRegularity', label: 'Period Regularity' },
  { key: 'exerciseFrequency', label: 'Exercise Frequency' },
  { key: 'stressLevel', label: 'Stress Level' },
  { key: 'sleepDuration', label: 'Sleep Duration', unit: 'hours' },
];

function MyProfile() {
  const { user } = useAuth();
  const [profile, setProfile] = useState(null);
  const [error, setError] = useState('');
  const [assessmentHistory, setAssessmentHistory] = useState(null);
  const [historyError, setHistoryError] = useState('');

  useEffect(() => {
    let isMounted = true;

    const loadProfile = async () => {
      try {
        const { data } = await profileApi.getProfile();

        if (!isMounted) return;

        if (data?.success) {
          setProfile(data.profile || {});
        } else {
          setError('Unable to load your profile right now.');
        }
      } catch {
        if (isMounted) {
          setError('Unable to load your profile right now.');
        }
      }
    };

    const loadAssessmentHistory = async () => {
      try {
        const { data } = await predictionApi.getHistory();

        if (!isMounted) return;

        setAssessmentHistory(
          data?.success && Array.isArray(data.assessments)
            ? data.assessments
            : []
        );
      } catch {
        if (isMounted) {
          setHistoryError('Unable to load your health history right now.');
        }
      }
    };

    loadProfile();
    loadAssessmentHistory();

    return () => {
      isMounted = false;
    };
  }, []);

  const getValue = (field) => {
    const value = field.key === 'name' ? user?.name : profile?.[field.key];

    if (value === null || value === undefined || value === '') {
      return 'Not provided';
    }

    return field.unit ? `${value} ${field.unit}` : value;
  };

  const bmi = calculateBmi(profile?.weight, profile?.height);

  const getResultEntries = (assessment) =>
    Object.entries(assessment.results || {}).filter(
      ([, result]) => result && typeof result === 'object'
    );

  return (
    <div className="my-profile-page">
      <header className="my-profile-header">
        <div>
          <span className="health-profile-eyebrow">FEMORAAI · MY ACCOUNT</span>
          <h1>My Profile</h1>
          <p>Your saved personal health information.</p>
        </div>

        <div className="health-profile-header-icon" aria-hidden="true">♡</div>
      </header>

      {error && (
        <div className="my-profile-alert" role="alert">
          {error}
        </div>
      )}

      {!profile && !error ? (
        <section className="health-profile-card my-profile-card">
          <p className="my-profile-status">Loading your saved profile...</p>
        </section>
      ) : (
        <section className="health-profile-card my-profile-card">
          <div className="my-profile-grid">
            {PROFILE_FIELDS.map((field) => (
              <div className="my-profile-item" key={field.key}>
                <span>{field.label}</span>
                <strong>{getValue(field)}</strong>
              </div>
            ))}

            <div className="my-profile-item">
              <span>BMI</span>
              <strong>{bmi ?? 'Not provided'}</strong>
            </div>
          </div>
        </section>
      )}

      <section className="health-profile-card my-profile-card">
        <div className="health-profile-section-header">
          <div className="health-profile-section-icon">⌁</div>
          <div>
            <span>HEALTH HISTORY</span>
            <h2>Assessment History</h2>
            <p>Your completed assessments and their saved results.</p>
          </div>
        </div>

        {historyError && (
          <div className="my-profile-alert" role="alert">
            {historyError}
          </div>
        )}

        {assessmentHistory === null && !historyError && (
          <p className="my-profile-status">Loading your health history...</p>
        )}

        {assessmentHistory?.length === 0 && !historyError && (
          <div className="my-profile-status">
            <strong>No health assessments yet</strong>
            <p>Your completed assessments will appear here.</p>
          </div>
        )}

        {assessmentHistory?.length > 0 && !historyError && (
          <div className="my-profile-grid">
            {assessmentHistory.map((assessment, index) => {
              const resultEntries = getResultEntries(assessment);

              return (
                <article
                  className="my-profile-item"
                  key={assessment.id || assessment.createdAt || index}
                >
                  {assessment.createdAt && (
                    <span>{formatDisplayDate(assessment.createdAt)}</span>
                  )}

                  {resultEntries.map(([resultKey, result]) => (
                    <div key={resultKey}>
                      {result.disease && <strong>{result.disease}</strong>}
                      {!result.disease && <strong>{resultKey}</strong>}

                      {result.label && <p>Result: {result.label}</p>}
                      {result.riskLabel && <p>Risk: {result.riskLabel}</p>}
                      {result.probability !== null &&
                        result.probability !== undefined && (
                          <p>Probability: {result.probability}%</p>
                        )}
                    </div>
                  ))}
                </article>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
}

export default MyProfile;
