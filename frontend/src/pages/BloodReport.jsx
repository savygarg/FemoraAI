import { useEffect, useRef, useState } from 'react';
import api from '../services/api';

function BloodReport() {
  const fileInputRef = useRef(null);

  const [selectedFile, setSelectedFile] = useState(null);
  const [isScanning, setIsScanning] = useState(false);
  const [scanComplete, setScanComplete] = useState(false);
  const [error, setError] = useState('');
  const [savedReports, setSavedReports] = useState(null);
  const [savedReportId, setSavedReportId] = useState(null);
  const [viewingReport, setViewingReport] = useState(null);
  const [isLoadingReport, setIsLoadingReport] = useState(false);

  const [results, setResults] = useState([]);
  const [aiSummary, setAiSummary] = useState(null);

  useEffect(() => {
    let isMounted = true;

    const loadSavedReports = async () => {
      try {
        const { data } = await api.get('/api/blood-reports');

        if (isMounted && data?.success && Array.isArray(data.bloodReports)) {
          setSavedReports(data.bloodReports);
        }
      } catch {
        if (isMounted) {
          setError('Unable to load your saved blood reports.');
          setSavedReports([]);
        }
      }
    };

    loadSavedReports();

    return () => {
      isMounted = false;
    };
  }, []);

  const handleFileChange = (event) => {
    const file = event.target.files?.[0];

    if (!file) return;

    setError('');
    setScanComplete(false);
    setSavedReportId(null);

    const allowedTypes = [
      'application/pdf',
      'image/jpeg',
      'image/png',
      'image/jpg',
    ];

    if (!allowedTypes.includes(file.type)) {
      setError('Please upload a PDF, JPG, JPEG, or PNG file.');
      setSelectedFile(null);
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      setError('File size must be less than 10 MB.');
      setSelectedFile(null);
      return;
    }

    setSelectedFile(file);
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleScan = async () => {
    if (!selectedFile) {
      setError('Please upload a blood report first.');
      return;
    }

    setError('');
    setIsScanning(true);
    setScanComplete(false);
    setViewingReport(null);

    try {
      const formData = new FormData();
      formData.append('file', selectedFile);

      const { data } = await api.post('/api/blood-reports', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (!data?.success || !data.bloodReport) {
        throw new Error('Unable to save this blood report.');
      }

      setSavedReportId(data.bloodReport.id || null);
      setSavedReports((previous) => [
        data.bloodReport,
        ...(previous || []).filter((report) => report.id !== data.bloodReport.id),
      ]);
      setResults(data.bloodReport.extractedResults || []);
      setAiSummary(data.bloodReport.aiSummary || null);
      setIsScanning(false);
      setScanComplete(true);
    } catch (scanError) {
      setIsScanning(false);
      setScanComplete(false);
      setError(
        scanError.response?.data?.message ||
          scanError.message ||
          'Unable to save this blood report.'
      );
    }
  };

  const handleSelectReport = async (reportId) => {
    setError('');
    setIsLoadingReport(true);
    setScanComplete(false);
    setSelectedFile(null);

    try {
      const { data } = await api.get(`/api/blood-reports/${encodeURIComponent(reportId)}`);

      if (!data?.success || !data.bloodReport) {
        throw new Error('Unable to load this saved blood report.');
      }

      setViewingReport(data.bloodReport);
      setSavedReportId(data.bloodReport.id || null);
      setResults(Array.isArray(data.bloodReport.extractedResults)
        ? data.bloodReport.extractedResults
        : []);
      setAiSummary(data.bloodReport.aiSummary || null);
    } catch (loadError) {
      setViewingReport(null);
      setResults([]);
      setError(
        loadError.response?.data?.message ||
          loadError.message ||
          'Unable to load this saved blood report.'
      );
    } finally {
      setIsLoadingReport(false);
    }
  };

  const handleBackToHistory = () => {
    setViewingReport(null);
    setSavedReportId(null);
    setResults([]);
    setAiSummary(null);
    setError('');
  };

  const handleRemoveFile = () => {
    setSelectedFile(null);
    setScanComplete(false);
    setViewingReport(null);
    setSavedReportId(null);
    setResults([]);
    setAiSummary(null);
    setError('');

    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const getStatusClass = (status) => {
    if (status === 'Normal') {
      return 'blood-report__status blood-report__status--normal';
    }

    if (status === 'High') {
      return 'blood-report__status blood-report__status--high';
    }

    if (status === 'Low') {
      return 'blood-report__status blood-report__status--low';
    }

    return 'blood-report__status';
  };

  return (
    <main className="blood-report">
      <div className="blood-report__container">

        {/* PAGE HEADER */}
        <section className="blood-report__header">
          <div>
            <span className="blood-report__eyebrow">
              AI HEALTH ANALYSIS
            </span>

            <h1 className="blood-report__title">
              Blood Report
            </h1>

            <p className="blood-report__subtitle">
              Upload your blood test report and let the AI analyze
              important health markers for you.
            </p>
          </div>
        </section>

        {/* UPLOAD CARD */}
        <section className="blood-report__upload-card">

          <div className="blood-report__upload-icon">
            <svg
              width="32"
              height="32"
              viewBox="0 0 24 24"
              fill="none"
              aria-hidden="true"
            >
              <path
                d="M12 16V4m0 0L7 9m5-5 5 5M5 14v4a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-4"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>

          <h2>
            Upload your blood report
          </h2>

          <p>
            Upload a PDF or image of your laboratory report.
          </p>

          <input
            ref={fileInputRef}
            type="file"
            accept=".pdf,.jpg,.jpeg,.png"
            onChange={handleFileChange}
            hidden
          />

          <button
            type="button"
            className="blood-report__upload-button"
            onClick={handleUploadClick}
          >
            Choose File
          </button>

          <span className="blood-report__file-hint">
            PDF, JPG, JPEG or PNG • Maximum 10 MB
          </span>

        </section>

        {/* ERROR */}
        {error && (
          <div className="blood-report__error">
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              aria-hidden="true"
            >
              <circle
                cx="12"
                cy="12"
                r="9"
                stroke="currentColor"
                strokeWidth="2"
              />

              <path
                d="M12 8v5"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              />

              <circle
                cx="12"
                cy="16.5"
                r="1"
                fill="currentColor"
              />
            </svg>

            {error}
          </div>
        )}

        {/* SELECTED FILE */}
        {selectedFile && (
          <section className="blood-report__file-card">

            <div className="blood-report__file-info">

              <div className="blood-report__file-icon">
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                >
                  <path
                    d="M6 2h8l5 5v15H6a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2z"
                    stroke="currentColor"
                    strokeWidth="1.8"
                  />

                  <path
                    d="M14 2v6h5"
                    stroke="currentColor"
                    strokeWidth="1.8"
                  />
                </svg>
              </div>

              <div>
                <strong>
                  {selectedFile.name}
                </strong>

                <span>
                  {(selectedFile.size / (1024 * 1024)).toFixed(2)} MB
                </span>
              </div>

            </div>

            <button
              type="button"
              className="blood-report__remove"
              onClick={handleRemoveFile}
            >
              Remove
            </button>

          </section>
        )}

        {/* SCAN BUTTON */}
        {selectedFile && !scanComplete && (
          <button
            type="button"
            className="blood-report__scan-button"
            onClick={handleScan}
            disabled={isScanning}
          >
            {isScanning ? (
              <>
                <span className="blood-report__spinner" />
                Scanning Report...
              </>
            ) : (
              <>
                <svg
                  width="19"
                  height="19"
                  viewBox="0 0 24 24"
                  fill="none"
                >
                  <path
                    d="M4 7V5a1 1 0 0 1 1-1h2M17 4h2a1 1 0 0 1 1 1v2M20 17v2a1 1 0 0 1-1 1h-2M7 20H5a1 1 0 0 1-1-1v-2"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                  />

                  <circle
                    cx="12"
                    cy="12"
                    r="3"
                    stroke="currentColor"
                    strokeWidth="2"
                  />
                </svg>

                Scan Blood Report
              </>
            )}
          </button>
        )}

        {/* RESULTS */}
        {(scanComplete || viewingReport) && (
          <section className="blood-report__results">

            <div className="blood-report__results-header">

              <div>
                <span className="blood-report__eyebrow">
                  {viewingReport ? 'SAVED REPORT' : 'ANALYSIS COMPLETE'}
                </span>

                <h2>
                  {viewingReport
                    ? viewingReport.originalFileName
                    : 'Extracted Blood Values'}
                </h2>

                <p>
                  {viewingReport
                    ? 'Values saved from this report.'
                    : 'Values extracted from your uploaded PDF report.'}
                </p>
              </div>

              <div className="blood-report__success">
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                >
                  <circle
                    cx="12"
                    cy="12"
                    r="9"
                    stroke="currentColor"
                    strokeWidth="2"
                  />

                  <path
                    d="m8 12 2.5 2.5L16 9"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>

                {viewingReport ? 'Saved Report' : 'Scan Complete'}
              </div>

            </div>

            {/* SUMMARY */}
            <div className="blood-report__summary">

              <div className="blood-report__summary-card">
                <span>Total Markers</span>
                <strong>{results.length}</strong>
              </div>

              <div className="blood-report__summary-card">
                <span>Normal</span>
                <strong>
                  {results.filter(
                    (item) => item.status === 'Normal'
                  ).length}
                </strong>
              </div>

              <div className="blood-report__summary-card">
                <span>Needs Attention</span>
                <strong>
                  {results.filter(
                    (item) => item.status !== 'Normal'
                  ).length}
                </strong>
              </div>

            </div>

            {/* MARKERS TABLE */}
            <div className="blood-report__table-wrapper">

              <table className="blood-report__table">

                <thead>
                  <tr>
                    <th>Health Marker</th>
                    <th>Result</th>
                    <th>Reference Range</th>
                    <th>Status</th>
                  </tr>
                </thead>

                <tbody>
                  {results.length > 0 ? results.map((item) => (
                    <tr key={item.name}>

                      <td>
                        <strong>{item.name}</strong>
                      </td>

                      <td>
                        <span className="blood-report__value">
                          {item.value}
                        </span>

                        <span className="blood-report__unit">
                          {item.unit}
                        </span>
                      </td>

                      <td>
                        {item.range}
                      </td>

                      <td>
                        <span className={getStatusClass(item.status)}>
                          {item.status}
                        </span>
                      </td>

                    </tr>
                  )) : (
                    <tr>
                      <td colSpan="4">No extracted results were saved for this report.</td>
                    </tr>
                  )}
                </tbody>

              </table>

            </div>

            <div className="blood-report__medical-disclaimer" role="note">
              <strong>Important medical disclaimer</strong>
              <p>
                This blood report analysis is for informational purposes only. AI-generated
                explanations are not a medical diagnosis and should not replace professional
                medical advice. Please consult a qualified healthcare professional to interpret
                your results, especially if you have abnormal values, persistent symptoms, or
                concerns about your health.
              </p>
            </div>

            {/* AI HEALTH SUMMARY */}
            <div className="blood-report__insight">

              <div className="blood-report__insight-icon">
                <svg
                  width="22"
                  height="22"
                  viewBox="0 0 24 24"
                  fill="none"
                >
                  <path
                    d="M12 2a7 7 0 0 1 7 7c0 2.38-1.19 4.47-3 5.74V17a2 2 0 0 1-2 2h-4a2 2 0 0 1-2-2v-2.26C6.19 13.47 5 11.38 5 9a7 7 0 0 1 7-7z"
                    stroke="currentColor"
                    strokeWidth="1.8"
                  />

                  <path
                    d="M9 21h6"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                  />
                </svg>
              </div>

              <div>
                <h3>AI Health Summary</h3>

                <p>{aiSummary?.message}</p>

                {aiSummary?.withinRange?.length > 0 && (
                  <div className="blood-report__summary-group">
                    <strong>Within the provided reference range</strong>
                    <ul>
                      {aiSummary.withinRange.map((item) => <li key={item}>{item}</li>)}
                    </ul>
                  </div>
                )}

                {aiSummary?.outsideRange?.length > 0 && (
                  <div className="blood-report__summary-group">
                    <strong>May be outside the provided reference range</strong>
                    <ul>
                      {aiSummary.outsideRange.map((item) => <li key={item}>{item}</li>)}
                    </ul>
                  </div>
                )}

                {aiSummary?.markerContext?.length > 0 && (
                  <div className="blood-report__summary-group">
                    <strong>What the extracted markers generally relate to</strong>
                    <ul>
                      {aiSummary.markerContext.map((item) => (
                        <li key={item.marker}>
                          <strong>{item.marker}:</strong> {item.relatesTo}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {aiSummary?.discussionPoints?.length > 0 && (
                  <div className="blood-report__summary-group">
                    <strong>Possible areas to discuss with a doctor</strong>
                    <ul>
                      {aiSummary.discussionPoints.map((item) => <li key={item}>{item}</li>)}
                    </ul>
                  </div>
                )}

                <p className="blood-report__summary-disclaimer">
                  {aiSummary?.disclaimer || 'This is general information, not a diagnosis.'}
                </p>
              </div>

            </div>

            {viewingReport ? (
              <button
                type="button"
                className="blood-report__new-scan"
                onClick={handleBackToHistory}
              >
                Back to History and Upload
              </button>
            ) : (
              <button
                type="button"
                className="blood-report__new-scan"
                onClick={handleRemoveFile}
              >
                Upload Another Report
              </button>
            )}

          </section>
        )}

        <section className="blood-report__results">
          <div className="blood-report__results-header">
            <div>
              <span className="blood-report__eyebrow">SAVED REPORTS</span>
              <h2>Blood Report History</h2>
              <p>Your uploaded report records for this account.</p>
            </div>
          </div>

          {savedReports === null && (
            <p>Loading your saved blood reports...</p>
          )}

          {savedReports?.length === 0 && (
            <p>No saved blood reports yet.</p>
          )}

          {savedReports?.length > 0 && (
            <div className="blood-report__table-wrapper">
              <table className="blood-report__table">
                <thead>
                  <tr>
                    <th>File Name</th>
                    <th>Upload Date</th>
                  </tr>
                </thead>
                <tbody>
                  {savedReports.map((report) => (
                    <tr
                      key={report.id}
                      className="blood-report__history-row"
                      onClick={() => handleSelectReport(report.id)}
                      onKeyDown={(event) => {
                        if (event.key === 'Enter' || event.key === ' ') {
                          event.preventDefault();
                          handleSelectReport(report.id);
                        }
                      }}
                      role="button"
                      tabIndex={0}
                      aria-label={`View ${report.originalFileName}`}
                    >
                      <td><strong>{report.originalFileName}</strong></td>
                      <td>
                        {report.uploadedAt
                          ? new Date(report.uploadedAt).toLocaleDateString('en-IN', {
                              day: 'numeric',
                              month: 'short',
                              year: 'numeric',
                            })
                          : 'Date unavailable'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {isLoadingReport && <p>Loading saved report...</p>}
        </section>

      </div>
    </main>
  );
}

export default BloodReport;