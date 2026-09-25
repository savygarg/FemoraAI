import { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

import RiskCard from '../components/RiskCard';
import { useAuth } from '../context/AuthContext';
import { predictionApi, profileApi } from '../services/api';
import { readStorage, STORAGE_KEYS } from '../utils/storage';

const RESULT_META = {
  pcos: {
    title: 'PCOS Risk',
    description: 'Polycystic ovary syndrome risk estimate from the trained PCOS model.',
  },
  diabetes: {
    title: 'Diabetes Risk',
    description: 'Diabetes risk estimate from the trained diabetes model.',
  },
  thyroid: {
    title: 'Thyroid Risk',
    description: 'Thyroid dysfunction risk estimate from the trained thyroid model.',
  },
};

function Dashboard() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const firstName = user?.name?.split(' ')[0] || 'there';
  const [profile, setProfile] = useState(() =>
    readStorage(STORAGE_KEYS.HEALTH_PROFILE, null)
  );
  const [profileLoaded, setProfileLoaded] = useState(false);
  const hasBasicProfile = Boolean(
    profileLoaded &&
      profile?.age &&
      profile?.height &&
      profile?.weight &&
      profile?.bloodGroup &&
      profile?.periodRegularity &&
      profile?.cycleLength &&
      profile?.menstrualFlow
  );
  const [latestAssessment, setLatestAssessment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [assessmentError, setAssessmentError] = useState('');

  useEffect(() => {
    const loadDashboard = async () => {
      try {
        const { data } = await profileApi.getProfile();
        if (data?.success) {
          const serverProfile = data.profile || {};
          setProfile(serverProfile);
          setProfileLoaded(true);

          if (Object.keys(serverProfile).length > 0) {
            localStorage.setItem(
              STORAGE_KEYS.HEALTH_PROFILE,
              JSON.stringify(serverProfile)
            );
          }
        }
      } catch {
        setProfileLoaded(true);
        // Ignore server profile fetch failures and continue dashboard rendering from local storage.
      }

      try {
        const { data } = await predictionApi.getLatest();

        if (data?.success && data.assessment?.results) {
          setLatestAssessment(data.assessment);
          return;
        }

        setLatestAssessment(null);
      } catch (error) {
        if (error.response?.status === 404) {
          setLatestAssessment(null);
          return;
        }

        setAssessmentError(
          error.response?.data?.message || 'Unable to load your saved assessment.'
        );
      } finally {
        setLoading(false);
      }
    };

    loadDashboard();
  }, [navigate]);

  const dashboardRisks = useMemo(() => {
    if (!latestAssessment?.results) {
      return [];
    }

    return Object.entries(RESULT_META)
      .map(([key, meta]) => {
        const result = latestAssessment.results[key];
        if (!result) {
          return null;
        }

        return {
          title: meta.title,
          riskLevel: result.riskLevel,
          value: `${result.probability ?? 0}%`,
          description: meta.description,
          footer: `${result.riskLabel} risk • ${result.label}`,
        };
      })
      .filter(Boolean);
  }, [latestAssessment]);

  const hasAssessment = Boolean(latestAssessment?.results);

  const hour = new Date().getHours();
  const greeting =
    hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';

  return (
    <div className="dashboard">
      <div className="dashboard-orb dashboard-orb--one" />
      <div className="dashboard-orb dashboard-orb--two" />

      <section className="dashboard-hero">
        <div className="dashboard-hero__content">
          <span className="dashboard-eyebrow">YOUR PERSONAL HEALTH SPACE</span>

          <h1>
            {greeting}, <span>{firstName}</span> ♡
          </h1>

          <p>
            Your health, your data, your decisions — all in one place.
          </p>

          <div className="hero-actions">
            <button
              type="button"
              className="dashboard-primary-btn"
              onClick={() => navigate(hasBasicProfile ? '/prediction' : '/profile')}
            >
              <span>✦</span>
              {!hasBasicProfile
                ? 'Complete Basic Health Profile'
                : hasAssessment
                  ? 'Update Detailed Assessment'
                  : 'Start Detailed Health Assessment'}
            </button>

            <Link to="/profile" className="dashboard-secondary-btn">
              Update Profile
            </Link>
          </div>
        </div>

        <div className="hero-decoration">
          <div className="hero-circle">
            <span>♀</span>
          </div>

          <div className="hero-small-circle">♡</div>
        </div>
      </section>

      {loading && (
        <section className="dashboard-section">
          <div className="prediction-card">
            <div className="prediction-card__header">
              <span className="prediction-card__step">LOADING</span>
              <h2>Checking your health assessment</h2>
              <p>Loading your saved health information.</p>
            </div>
          </div>
        </section>
      )}

      {!loading && !hasBasicProfile && !hasAssessment && (
        <section className="dashboard-section">
          <div className="prediction-card">
            <div className="prediction-card__header">
              <span className="prediction-card__step">WELCOME</span>
              <h2>Welcome to FemoraAI</h2>
              <p>
                Complete your basic health profile to personalize your experience.
              </p>

              <div className="prediction-navigation">
                <button
                  type="button"
                  className="prediction-primary-button"
                  onClick={() => navigate('/profile')}
                >
                  Complete My Profile <span>✦</span>
                </button>
              </div>
            </div>
          </div>
        </section>
      )}

      {!loading && hasBasicProfile && !hasAssessment && (
        <section className="dashboard-section">
          <div className="prediction-card">
            <div className="prediction-card__header">
              <span className="prediction-card__step">BASIC PROFILE</span>
              <h2>{user?.name || 'Your profile'} is ready</h2>
              <p>
                Basic profile information is saved. Continue with the detailed
                assessment whenever you want. It is optional, and some fields may
                require information from previous medical tests or reports.
              </p>

              <div className="prediction-navigation">
                <button
                  type="button"
                  className="prediction-primary-button"
                  onClick={() => navigate('/prediction')}
                >
                  Start Detailed Assessment <span>✦</span>
                </button>
                <button
                  type="button"
                  className="dashboard-secondary-btn"
                  onClick={() => navigate('/blood-report')}
                >
                  Upload Blood Report
                </button>
              </div>
            </div>
          </div>
        </section>
      )}

      {!loading && hasAssessment && (
        <section className="dashboard-section">
          <div className="dashboard-section-header">
            <div>
              <span className="dashboard-eyebrow">AI INSIGHTS</span>
              <h2>Health risk overview</h2>
              <p>Your latest personalised health indicators.</p>
            </div>

            <div className="dashboard-section-header__actions">
              <Link to="/results" className="view-all-link">
                View details →
              </Link>
              <Link to="/prediction" className="dashboard-secondary-btn">
                Update Assessment
              </Link>
            </div>
          </div>

          <div className="risk-grid">
            {dashboardRisks.map((risk) => (
              <RiskCard key={risk.title} {...risk} />
            ))}
          </div>

          {assessmentError && (
            <div className="form-alert form-alert--info" role="alert">
              {assessmentError}
            </div>
          )}
        </section>
      )}
    </div>
  );
}

export default Dashboard;
