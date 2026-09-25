import { useEffect, useState } from 'react';
import { journalApi } from '../services/api';

const symptomOptions = [
  'Fatigue',
  'Headache',
  'Cramps',
  'Bloating',
  'Dizziness',
  'Nausea',
  'Mood changes',
  'Back pain',
  'Sleep changes',
  'Other discomfort',
];

const getToday = () => new Date().toISOString().split('T')[0];

const getInitialForm = () => ({
  date: getToday(),
  symptoms: [],
  notes: '',
});

const formatDate = (date) => {
  if (!date) return '';

  return new Date(`${date}T00:00:00`).toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
};

function Journal() {
  const [form, setForm] = useState(getInitialForm);
  const [entries, setEntries] = useState([]);
  const [selectedEntry, setSelectedEntry] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    let isMounted = true;

    const loadEntries = async () => {
      try {
        const { data } = await journalApi.getEntries();
        if (!isMounted) return;

        const loadedEntries = data?.success && Array.isArray(data.entries)
          ? data.entries
          : [];
        setEntries(loadedEntries);
        setSelectedEntry(loadedEntries[loadedEntries.length - 1] || null);
      } catch (requestError) {
        if (isMounted) {
          setError(
            requestError.response?.data?.message ||
              'Unable to load your journal right now.'
          );
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    loadEntries();

    return () => {
      isMounted = false;
    };
  }, []);

  const updateField = (field, value) => {
    setForm((previous) => ({ ...previous, [field]: value }));
    setError('');
    setSuccessMessage('');
  };

  const toggleSymptom = (symptom) => {
    setForm((previous) => ({
      ...previous,
      symptoms: previous.symptoms.includes(symptom)
        ? previous.symptoms.filter((item) => item !== symptom)
        : [...previous.symptoms, symptom],
    }));
    setError('');
    setSuccessMessage('');
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsSaving(true);
    setError('');
    setSuccessMessage('');

    try {
      const { data } = await journalApi.createEntry(form);
      const savedEntry = data.entry;
      const nextEntries = [...entries, savedEntry].sort(
        (first, second) => new Date(first.date) - new Date(second.date)
      );

      setEntries(nextEntries);
      setSelectedEntry(savedEntry);
      setForm(getInitialForm());
      setSuccessMessage('Your journal entry has been saved.');
    } catch (requestError) {
      setError(
        requestError.response?.data?.message ||
          'Unable to save your journal entry right now.'
      );
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="journal-page">
      <header className="journal-header">
        <div>
          <span className="journal-eyebrow">FEMORAAI · PERSONAL JOURNAL</span>
          <h1>Journal</h1>
          <p>
            Record symptoms and health observations over time. Saving an entry creates
            a general, non-diagnostic automated insight.
          </p>
        </div>
        <div className="journal-header-icon" aria-hidden="true">⌁</div>
      </header>

      {error && <div className="form-alert form-alert--error" role="alert">{error}</div>}
      {successMessage && <div className="journal-success" role="status">✓ {successMessage}</div>}

      <main className="journal-layout">
        <section className="journal-card">
          <div className="journal-section-header">
            <div className="journal-section-icon">+</div>
            <div>
              <span>NEW ENTRY</span>
              <h2>How are you feeling?</h2>
              <p>Choose any symptoms you noticed and add context if useful.</p>
            </div>
          </div>

          <form className="journal-form" onSubmit={handleSubmit}>
            <label className="journal-field journal-field--full" htmlFor="journal-date">
              Date
              <input
                id="journal-date"
                type="date"
                value={form.date}
                onChange={(event) => updateField('date', event.target.value)}
                required
              />
            </label>

            <div className="journal-field journal-field--full">
              <div className="journal-label-row">
                <label>Symptoms or observations</label>
                <span>{form.symptoms.length} selected</span>
              </div>
              <div className="journal-symptoms">
                {symptomOptions.map((symptom) => (
                  <button
                    type="button"
                    key={symptom}
                    className={`journal-symptom ${
                      form.symptoms.includes(symptom) ? 'journal-symptom--selected' : ''
                    }`}
                    onClick={() => toggleSymptom(symptom)}
                  >
                    {symptom}
                  </button>
                ))}
              </div>
            </div>

            <label className="journal-field journal-field--full" htmlFor="journal-notes">
              Notes <span>Optional</span>
              <textarea
                id="journal-notes"
                rows="5"
                maxLength="5000"
                value={form.notes}
                onChange={(event) => updateField('notes', event.target.value)}
                placeholder="Add timing, severity, sleep, stress, hydration, or anything else you noticed."
              />
            </label>

            <button type="submit" className="journal-save" disabled={isSaving}>
              {isSaving ? 'Saving...' : 'Save Entry'} <span>→</span>
            </button>
          </form>
        </section>

        <aside className="journal-card journal-history-card">
          <div className="journal-section-header">
            <div className="journal-section-icon">⌁</div>
            <div>
              <span>YOUR RECORD</span>
              <h2>Journal history</h2>
              <p>Open an entry to review its symptoms, notes, and insight.</p>
            </div>
          </div>

          {loading && <p className="journal-muted">Loading your entries...</p>}
          {!loading && entries.length === 0 && (
            <div className="journal-empty">
              <strong>No journal entries yet</strong>
              <span>Your saved observations will appear here in date order.</span>
            </div>
          )}

          {!loading && entries.length > 0 && (
            <div className="journal-entry-list">
              {entries.map((entry) => (
                <button
                  type="button"
                  key={entry.id}
                  className={`journal-entry-preview ${
                    selectedEntry?.id === entry.id ? 'journal-entry-preview--selected' : ''
                  }`}
                  onClick={() => setSelectedEntry(entry)}
                >
                  <strong>{formatDate(entry.date)}</strong>
                  <span>{entry.symptoms?.length ? entry.symptoms.join(', ') : 'No symptoms selected'}</span>
                </button>
              ))}
            </div>
          )}
        </aside>
      </main>

      {selectedEntry && (
        <section className="journal-card journal-detail-card">
          <div className="journal-section-header">
            <div className="journal-section-icon">✦</div>
            <div>
              <span>{formatDate(selectedEntry.date)}</span>
              <h2>Entry details</h2>
              <p>Your saved observation for this day.</p>
            </div>
          </div>

          <div className="journal-detail-grid">
            <div>
              <span>Symptoms</span>
              <strong>
                {selectedEntry.symptoms?.length
                  ? selectedEntry.symptoms.join(', ')
                  : 'No symptoms selected'}
              </strong>
            </div>
            <div>
              <span>Notes</span>
              <strong>{selectedEntry.notes || 'No notes added.'}</strong>
            </div>
          </div>

          <div className="journal-insight">
            <span className="journal-insight__eyebrow">AUTOMATED INSIGHT</span>
            <p>{selectedEntry.automatedInsight}</p>
          </div>

          <p className="journal-disclaimer">
            Persistent, severe, or concerning symptoms should be discussed with a
            healthcare professional. This journal insight is general information and
            is not a diagnosis.
          </p>
        </section>
      )}
    </div>
  );
}

export default Journal;
