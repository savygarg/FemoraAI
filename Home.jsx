import { Link } from "react-router-dom";

function Home() {
  return (
    <div className="home-page">

      {/* Navbar */}
      <nav className="home-navbar">
        <Link to="/" className="home-logo">
          <span className="home-logo-mark">F</span>
          <span>FemoraAI</span>
        </Link>

        <div className="home-nav-actions">
          <Link to="/login" className="home-login-btn">
            Login
          </Link>

          <Link to="/register" className="home-register-btn">
            Register
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <main className="home-hero">

        <section className="home-hero-content">
          <div className="home-badge">
            AI-powered women's health intelligence
          </div>

          <h1>
            Smarter insights.
            <br />
            <span>Better health decisions.</span>
          </h1>

          <p>
            FemoraAI combines intelligent health risk assessment,
            personalized health tracking, and meaningful health trends
            to help women make more informed decisions about their health.
          </p>

          <div className="home-hero-actions">
            <Link to="/register" className="home-primary-btn">
              Get Started
            </Link>

            <Link to="/login" className="home-secondary-btn">
              I already have an account
            </Link>
          </div>

          <div className="home-trust">
            <span>✓ Personalized</span>
            <span>✓ Data-driven</span>
            <span>✓ Easy to track</span>
          </div>
        </section>

        {/* Hero visual */}
        <section className="home-visual">
          <div className="health-card">

            <div className="health-card-header">
              <div>
                <small>HEALTH OVERVIEW</small>
                <h3>Your wellness snapshot</h3>
              </div>

              <div className="health-icon">✦</div>
            </div>

            <div className="health-score">
              <div className="score-circle">
                <strong>82</strong>
                <span>Good</span>
              </div>

              <div className="score-info">
                <strong>Overall wellness</strong>
                <p>Your health profile is looking positive.</p>
              </div>
            </div>

            <div className="health-metrics">

              <div className="metric">
                <span>Cycle</span>
                <strong>28 days</strong>
                <div className="metric-bar">
                  <span style={{ width: "82%" }}></span>
                </div>
              </div>

              <div className="metric">
                <span>Sleep</span>
                <strong>7.4 hrs</strong>
                <div className="metric-bar">
                  <span style={{ width: "72%" }}></span>
                </div>
              </div>

              <div className="metric">
                <span>Activity</span>
                <strong>Active</strong>
                <div className="metric-bar">
                  <span style={{ width: "88%" }}></span>
                </div>
              </div>

            </div>

            <div className="ai-insight">
              <div className="ai-insight-icon">✦</div>
              <div>
                <strong>AI Insight</strong>
                <p>
                  Keep tracking your health patterns for more personalized
                  insights.
                </p>
              </div>
            </div>

          </div>

          <div className="floating-card floating-card-one">
            <span>AI Risk Analysis</span>
            <strong>Personalized</strong>
          </div>

          <div className="floating-card floating-card-two">
            <span>Health trends</span>
            <strong>Tracking ✓</strong>
          </div>
        </section>

      </main>

      {/* Features */}
      <section className="home-features">

        <div className="section-heading">
          <span>WHY FEMORAAI</span>
          <h2>Healthcare intelligence, made personal.</h2>
          <p>
            Everything you need to understand and track your health in one
            simple platform.
          </p>
        </div>

        <div className="feature-grid">

          <div className="feature-card">
            <div className="feature-icon teal">✦</div>
            <h3>AI-Powered Insights</h3>
            <p>
              Analyze health information and receive intelligent risk
              insights designed to support informed decisions.
            </p>
          </div>

          <div className="feature-card">
            <div className="feature-icon blue">◉</div>
            <h3>Personalized Tracking</h3>
            <p>
              Keep your health profile and daily health information organized
              in one secure and accessible place.
            </p>
          </div>

          <div className="feature-card">
            <div className="feature-icon coral">↗</div>
            <h3>Health Trends</h3>
            <p>
              Monitor changes over time and understand patterns through
              simple visual health trends.
            </p>
          </div>

        </div>
      </section>

      {/* Disclaimer */}
      <section className="home-disclaimer">
        <div>
          <strong>Important:</strong>
          <p>
            FemoraAI provides AI-generated health risk estimates for
            informational purposes only. It is not a medical diagnosis and
            should not replace professional medical advice.
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="home-footer">
        <div className="home-logo">
          <span className="home-logo-mark">F</span>
          <span>FemoraAI</span>
        </div>

        <span>© 2026 FemoraAI</span>
      </footer>

    </div>
  );
}

export default Home;