import { useRef, useState } from 'react';

function BloodReport() {
  const fileInputRef = useRef(null);

  const [selectedFile, setSelectedFile] = useState(null);
  const [isScanning, setIsScanning] = useState(false);
  const [scanComplete, setScanComplete] = useState(false);
  const [error, setError] = useState('');

  const [results, setResults] = useState([
    {
      name: 'Hemoglobin',
      value: '13.2',
      unit: 'g/dL',
      range: '12.0 – 15.5',
      status: 'Normal',
    },
    {
      name: 'WBC Count',
      value: '7,400',
      unit: '/µL',
      range: '4,000 – 11,000',
      status: 'Normal',
    },
    {
      name: 'Platelet Count',
      value: '245,000',
      unit: '/µL',
      range: '150,000 – 450,000',
      status: 'Normal',
    },
    {
      name: 'Glucose',
      value: '108',
      unit: 'mg/dL',
      range: '70 – 100',
      status: 'High',
    },
    {
      name: 'Vitamin B12',
      value: '310',
      unit: 'pg/mL',
      range: '200 – 900',
      status: 'Normal',
    },
    {
      name: 'Vitamin D',
      value: '18',
      unit: 'ng/mL',
      range: '30 – 100',
      status: 'Low',
    },
  ]);

  const handleFileChange = (event) => {
    const file = event.target.files?.[0];

    if (!file) return;

    setError('');
    setScanComplete(false);

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

    /*
      TEMPORARY FRONTEND SCANNING

      Later replace this section with:

      const formData = new FormData();
      formData.append('file', selectedFile);

      const response = await fetch(
        'http://127.0.0.1:5000/api/blood-report/analyze',
        {
          method: 'POST',
          body: formData,
        }
      );

      const data = await response.json();
      setResults(data.results);
    */

    setTimeout(() => {
      setIsScanning(false);
      setScanComplete(true);
    }, 2500);
  };

  const handleRemoveFile = () => {
    setSelectedFile(null);
    setScanComplete(false);
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
        {scanComplete && (
          <section className="blood-report__results">

            <div className="blood-report__results-header">

              <div>
                <span className="blood-report__eyebrow">
                  ANALYSIS COMPLETE
                </span>

                <h2>
                  Your Blood Report Results
                </h2>

                <p>
                  The report has been analyzed and the detected
                  health markers are shown below.
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

                Scan Complete
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
                  {results.map((item) => (
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
                  ))}
                </tbody>

              </table>

            </div>

            {/* AI INSIGHT */}
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
                <h3>
                  AI Health Insight
                </h3>

                <p>
                  Some markers may require attention based on the
                  provided reference ranges. This analysis is intended
                  for informational purposes and should not replace
                  professional medical advice.
                </p>
              </div>

            </div>

            <button
              type="button"
              className="blood-report__new-scan"
              onClick={handleRemoveFile}
            >
              Upload Another Report
            </button>

          </section>
        )}

      </div>
    </main>
  );
}

export default BloodReport;