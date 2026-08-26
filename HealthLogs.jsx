import { useState } from 'react';

const STORAGE_KEY = 'femoraai_health_logs';

const symptomOptions = [
  'Cramps',
  'Headache',
  'Fatigue',
  'Bloating',
  'Acne',
  'Back pain',
  'Mood changes',
  'Dizziness',
  'Nausea',
  'Breast tenderness',
];

const moodOptions = [
  'Great',
  'Good',
  'Okay',
  'Low',
  'Very low',
];

const energyOptions = [
  'Very high',
  'High',
  'Moderate',
  'Low',
  'Very low',
];

const getToday = () => {
  const today = new Date();
  return today.toISOString().split('T')[0];
};

const getInitialForm = () => ({
  date: getToday(),
  sleep: '',
  water: '',
  mood: '',
  energy: '',
  symptoms: [],
  notes: '',
});

function HealthLogs() {
  const [form, setForm] = useState(getInitialForm);
  const [logs, setLogs] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [showForm, setShowForm] = useState(true);
  const [successMessage, setSuccessMessage] = useState('');

  const updateField = (field, value) => {
    setForm((previous) => ({
      ...previous,
      [field]: value,
    }));

    setSuccessMessage('');
  };

  const toggleSymptom = (symptom) => {
    setForm((previous) => {
      const exists = previous.symptoms.includes(symptom);

      return {
        ...previous,
        symptoms: exists
          ? previous.symptoms.filter((item) => item !== symptom)
          : [...previous.symptoms, symptom],
      };
    });
  };

  const saveLogs = (updatedLogs) => {
    setLogs(updatedLogs);
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify(updatedLogs)
    );
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    const newLog = {
      ...form,
      id: Date.now(),
      createdAt: new Date().toISOString(),
    };

    const existingIndex = logs.findIndex(
      (log) => log.date === form.date
    );

    let updatedLogs;

    if (existingIndex !== -1) {
      updatedLogs = [...logs];
      updatedLogs[existingIndex] = newLog;
    } else {
      updatedLogs = [newLog, ...logs];
    }

    updatedLogs.sort(
      (a, b) =>
        new Date(b.date) - new Date(a.date)
    );

    saveLogs(updatedLogs);

    setSuccessMessage(
      existingIndex !== -1
        ? 'Your health log has been updated.'
        : 'Today’s health log has been saved.'
    );

    setShowForm(false);
  };

  const deleteLog = (id) => {
    const updatedLogs = logs.filter(
      (log) => log.id !== id
    );

    saveLogs(updatedLogs);
  };

  const editLog = (log) => {
    setForm({
      date: log.date || getToday(),
      sleep: log.sleep || '',
      water: log.water || '',
      mood: log.mood || '',
      energy: log.energy || '',
      symptoms: log.symptoms || [],
      notes: log.notes || '',
    });

    setShowForm(true);

    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  const formatDate = (date) => {
    if (!date) return '';

    return new Date(`${date}T00:00:00`).toLocaleDateString(
      'en-IN',
      {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
      }
    );
  };

  return (
    <div className="health-logs-page">

      {/* =================================================
          HEADER
      ================================================== */}

      <header className="health-logs-header">

        <div>
          <span className="health-logs-eyebrow">
            FEMORAAI · DAILY WELLNESS
          </span>

          <h1>Health Logs</h1>

          <p>
            Track how you feel each day and build a clearer
            picture of your health over time.
          </p>
        </div>

        <div className="health-logs-header-icon">
          ⌁
        </div>

      </header>


      {/* =================================================
          SUCCESS
      ================================================== */}

      {successMessage && (
        <div className="health-logs-success">
          <span>✓</span>
          {successMessage}
        </div>
      )}


      {/* =================================================
          ADD LOG BUTTON
      ================================================== */}

      {!showForm && (
        <button
          type="button"
          className="health-logs-add-button"
          onClick={() => {
            setForm(getInitialForm());
            setShowForm(true);
            setSuccessMessage('');
          }}
        >
          <span>+</span>
          Add Health Log
        </button>
      )}


      {/* =================================================
          FORM
      ================================================== */}

      {showForm && (
        <section className="health-logs-card">

          <div className="health-logs-section-header">

            <div className="health-logs-section-icon">
              +
            </div>

            <div>
              <span>DAILY CHECK-IN</span>

              <h2>
                How are you feeling today?
              </h2>

              <p>
                Add a few details about your day.
              </p>
            </div>

          </div>


          <form
            className="health-logs-form"
            onSubmit={handleSubmit}
          >

            {/* DATE */}

            <div className="health-logs-field health-logs-field--full">

              <label htmlFor="health-log-date">
                Date
              </label>

              <input
                id="health-log-date"
                type="date"
                className="health-logs-input"
                value={form.date}
                onChange={(event) =>
                  updateField(
                    'date',
                    event.target.value
                  )
                }
                required
              />

            </div>


            {/* SLEEP */}

            <div className="health-logs-field">

              <label htmlFor="health-log-sleep">
                Sleep
              </label>

              <div className="health-logs-unit-input">

                <input
                  id="health-log-sleep"
                  type="number"
                  min="0"
                  max="24"
                  step="0.5"
                  placeholder="e.g. 7.5"
                  className="health-logs-input"
                  value={form.sleep}
                  onChange={(event) =>
                    updateField(
                      'sleep',
                      event.target.value
                    )
                  }
                />

                <span>hours</span>

              </div>

            </div>


            {/* WATER */}

            <div className="health-logs-field">

              <label htmlFor="health-log-water">
                Water intake
              </label>

              <div className="health-logs-unit-input">

                <input
                  id="health-log-water"
                  type="number"
                  min="0"
                  max="20"
                  step="0.1"
                  placeholder="e.g. 2"
                  className="health-logs-input"
                  value={form.water}
                  onChange={(event) =>
                    updateField(
                      'water',
                      event.target.value
                    )
                  }
                />

                <span>litres</span>

              </div>

            </div>


            {/* MOOD */}

            <div className="health-logs-field">

              <label>
                Mood
              </label>

              <div className="health-logs-choice-grid">

                {moodOptions.map((option) => (

                  <button
                    type="button"
                    key={option}
                    className={`health-logs-choice ${
                      form.mood === option
                        ? 'health-logs-choice--selected'
                        : ''
                    }`}
                    onClick={() =>
                      updateField('mood', option)
                    }
                  >
                    <span>
                      {form.mood === option ? '✓' : ''}
                    </span>

                    {option}
                  </button>

                ))}

              </div>

            </div>


            {/* ENERGY */}

            <div className="health-logs-field">

              <label>
                Energy
              </label>

              <div className="health-logs-choice-grid">

                {energyOptions.map((option) => (

                  <button
                    type="button"
                    key={option}
                    className={`health-logs-choice ${
                      form.energy === option
                        ? 'health-logs-choice--selected'
                        : ''
                    }`}
                    onClick={() =>
                      updateField('energy', option)
                    }
                  >
                    <span>
                      {form.energy === option ? '✓' : ''}
                    </span>

                    {option}
                  </button>

                ))}

              </div>

            </div>


            {/* SYMPTOMS */}

            <div className="health-logs-field health-logs-field--full">

              <div className="health-logs-label-row">

                <label>
                  Symptoms
                </label>

                <span>
                  {form.symptoms.length} selected
                </span>

              </div>

              <div className="health-logs-symptoms">

                {symptomOptions.map((symptom) => {

                  const selected =
                    form.symptoms.includes(symptom);

                  return (
                    <button
                      type="button"
                      key={symptom}
                      className={`health-logs-symptom ${
                        selected
                          ? 'health-logs-symptom--selected'
                          : ''
                      }`}
                      onClick={() =>
                        toggleSymptom(symptom)
                      }
                      aria-pressed={selected}
                    >
                      <span>
                        {selected ? '✓' : ''}
                      </span>

                      {symptom}
                    </button>
                  );
                })}

              </div>

            </div>


            {/* NOTES */}

            <div className="health-logs-field health-logs-field--full">

              <label htmlFor="health-log-notes">
                Notes
              </label>

              <textarea
                id="health-log-notes"
                className="health-logs-input health-logs-textarea"
                rows="4"
                placeholder="Anything else you want to remember about today..."
                value={form.notes}
                onChange={(event) =>
                  updateField(
                    'notes',
                    event.target.value
                  )
                }
              />

            </div>


            {/* ACTIONS */}

            <div className="health-logs-actions">

              <button
                type="button"
                className="health-logs-cancel"
                onClick={() => {
                  setShowForm(false);
                  setSuccessMessage('');
                }}
              >
                Cancel
              </button>

              <button
                type="submit"
                className="health-logs-save"
              >
                Save Health Log
                <span>→</span>
              </button>

            </div>

          </form>

        </section>
      )}


      {/* =================================================
          HISTORY
      ================================================== */}

      <section className="health-logs-history">

        <div className="health-logs-history-header">

          <div>
            <span className="health-logs-eyebrow">
              YOUR HISTORY
            </span>

            <h2>
              Recent health logs
            </h2>
          </div>

          <span className="health-logs-count">
            {logs.length} {logs.length === 1 ? 'entry' : 'entries'}
          </span>

        </div>


        {logs.length === 0 ? (

          <div className="health-logs-empty">

            <div className="health-logs-empty-icon">
              ♡
            </div>

            <h3>
              No health logs yet
            </h3>

            <p>
              Start tracking your daily wellness to see your
              patterns over time.
            </p>

            {!showForm && (
              <button
                type="button"
                onClick={() => setShowForm(true)}
              >
                Add your first log →
              </button>
            )}

          </div>

        ) : (

          <div className="health-logs-list">

            {logs.map((log) => (

              <article
                className="health-log-entry"
                key={log.id}
              >

                <div className="health-log-entry-date">

                  <span>
                    {new Date(
                      `${log.date}T00:00:00`
                    ).toLocaleDateString(
                      'en-IN',
                      { weekday: 'short' }
                    )}
                  </span>

                  <strong>
                    {new Date(
                      `${log.date}T00:00:00`
                    ).getDate()}
                  </strong>

                  <small>
                    {new Date(
                      `${log.date}T00:00:00`
                    ).toLocaleDateString(
                      'en-IN',
                      { month: 'short' }
                    )}
                  </small>

                </div>


                <div className="health-log-entry-content">

                  <div className="health-log-entry-top">

                    <div>
                      <span className="health-log-entry-label">
                        DAILY CHECK-IN
                      </span>

                      <h3>
                        {formatDate(log.date)}
                      </h3>
                    </div>

                    <div className="health-log-entry-actions">

                      <button
                        type="button"
                        onClick={() => editLog(log)}
                      >
                        Edit
                      </button>

                      <button
                        type="button"
                        onClick={() =>
                          deleteLog(log.id)
                        }
                      >
                        Delete
                      </button>

                    </div>

                  </div>


                  <div className="health-log-stats">

                    {log.sleep && (
                      <div>
                        <span>Sleep</span>
                        <strong>
                          {log.sleep}h
                        </strong>
                      </div>
                    )}

                    {log.water && (
                      <div>
                        <span>Water</span>
                        <strong>
                          {log.water}L
                        </strong>
                      </div>
                    )}

                    {log.mood && (
                      <div>
                        <span>Mood</span>
                        <strong>
                          {log.mood}
                        </strong>
                      </div>
                    )}

                    {log.energy && (
                      <div>
                        <span>Energy</span>
                        <strong>
                          {log.energy}
                        </strong>
                      </div>
                    )}

                  </div>


                  {log.symptoms?.length > 0 && (
                    <div className="health-log-entry-symptoms">

                      <span>
                        Symptoms
                      </span>

                      <div>
                        {log.symptoms.map((symptom) => (
                          <small key={symptom}>
                            {symptom}
                          </small>
                        ))}
                      </div>

                    </div>
                  )}


                  {log.notes && (
                    <div className="health-log-entry-notes">
                      <span>Note</span>
                      <p>{log.notes}</p>
                    </div>
                  )}

                </div>

              </article>

            ))}

          </div>

        )}

      </section>


      {/* =================================================
          DISCLAIMER
      ================================================== */}

      <div className="health-logs-disclaimer">
        <span>ⓘ</span>

        <p>
          Health logs are user-provided and are intended for
          tracking and informational purposes. They are not a
          substitute for professional medical advice.
        </p>
      </div>

    </div>
  );
}

export default HealthLogs;