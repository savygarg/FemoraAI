import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import RiskCard from '../components/RiskCard';
import api from '../services/api';
import { formatDisplayDate } from '../data/mockData';

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

function Results() {
  const [assessment, setAssessment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadResults = async () => {
      try {
        const cached = localStorage.getItem('femoraai_latest_assessment');

        if (cached) {
          setAssessment(JSON.parse(cached));
        }

        const { data } = await api.get('/api/predictions/latest');

        if (data.success && data.assessment) {
          setAssessment(data.assessment);
          localStorage.setItem(
            'femoraai_latest_assessment',
            JSON.stringify(data.assessment)
          );
        }
      } catch (fetchError) {
        if (!localStorage.getItem('femoraai_latest_assessment')) {
          setError('No assessment results found yet.');
        }
      } finally {
        setLoading(false);
      }
    };

    loadResults();
  }, []);

  if (loading) {
    return (
      <div className="page">
        <div className="auth-loading">
          <p>Loading your assessment results…</p>
        </div>
      </div>
    );
  }

  if (!assessment?.results) {
    return (
      <div className="page">
        <header className="page-header">
          <h1 className="page-header__title">Your Assessment Results</h1>
          <p className="page-header__subtitle">
            {error || 'Complete an AI health assessment to see your results here.'}
          </p>
        </header>

        <div className="card">
          <Link to="/prediction" className="btn btn--primary">
            Start AI Assessment
          </Link>
        </div>
      </div>
    );
  }

  const { results, createdAt } = assessment;

  return (
    <div className="page">
      <header className="page-header">
        <h1 className="page-header__title">Your Assessment Results</h1>
        <p className="page-header__subtitle">
          Assessment date: {formatDisplayDate(createdAt)}
        </p>
      </header>

      <div className="grid grid--3 page-section">
        {Object.entries(RESULT_META).map(([key, meta]) => {
          const result = results[key];
          if (!result) return null;

          return (
            <RiskCard
              key={key}
              title={meta.title}
              riskLevel={result.riskLevel}
              value={`${result.probability ?? 0}%`}
              description={meta.description}
              footer={`Model prediction: ${result.label} (${result.riskLabel} risk)`}
            />
          );
        })}
      </div>

      <section className="page-section">
        <div className="grid grid--3">
          {Object.entries(results).map(([key, result]) => (
            <article key={key} className="card">
              <h3>{RESULT_META[key]?.title || key}</h3>
              <p>
                Risk score: <strong>{result.probability ?? 0}%</strong> ({result.riskLabel})
              </p>
              <div className="results-progress">
                <div
                  className={`results-progress__fill results-progress__fill--${result.riskLevel}`}
                  style={{ width: `${result.probability ?? 0}%` }}
                />
              </div>
              <p className="page-header__subtitle">
                Prediction class: {result.prediction} ({result.label})
              </p>
            </article>
          ))}
        </div>
      </section>

      <div className="prediction-disclaimer page-section">
        <span>ⓘ</span>
        <p>
          These results are AI-generated risk estimates from trained ML models and are
          not a medical diagnosis. Please consult a qualified healthcare professional
          for medical advice.
        </p>
      </div>

      <div className="stack stack--sm">
        <Link to="/prediction" className="btn btn--primary">
          New Assessment
        </Link>
        <Link to="/dashboard" className="btn btn--secondary">
          Back to Dashboard
        </Link>
      </div>
    </div>
  );
}

export default Results;
