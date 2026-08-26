import { Link, useNavigate } from 'react-router-dom';

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area,
} from 'recharts';

import RiskCard from '../components/RiskCard';
import { getDemoUser } from '../utils/auth';

import {
  DASHBOARD_SUMMARY,
  DASHBOARD_RISKS,
  WEIGHT_TREND_DATA,
  SLEEP_TREND_DATA,
  RECENT_ACTIVITY,
} from '../data/mockData';

function Dashboard() {
  const navigate = useNavigate();

  const user = getDemoUser();
  const firstName = user?.name?.split(' ')[0] || 'there';

  const hour = new Date().getHours();

  const greeting =
    hour < 12
      ? 'Good morning'
      : hour < 17
        ? 'Good afternoon'
        : 'Good evening';

  return (
    <div className="dashboard">

      {/* =====================================================
          DECORATIVE BACKGROUND
      ====================================================== */}

      <div className="dashboard-orb dashboard-orb--one" />
      <div className="dashboard-orb dashboard-orb--two" />


      {/* =====================================================
          HERO
      ====================================================== */}

      <section className="dashboard-hero">

        <div className="dashboard-hero__content">

          <span className="dashboard-eyebrow">
            YOUR PERSONAL HEALTH SPACE
          </span>

          <h1>
            {greeting}, <span>{firstName}</span> ♡
          </h1>

          <p>
            Your health, your data, your decisions — all in one place.
          </p>

          <div className="hero-actions">

            {/* AI ASSESSMENT */}

            <button
              type="button"
              className="dashboard-primary-btn"
              onClick={() => navigate('/prediction')}
            >
              <span>✦</span>
              Start AI Assessment
            </button>


            {/* HEALTH PROFILE */}

            <Link
              to="/profile"
              className="dashboard-secondary-btn"
            >
              Update Profile
            </Link>

          </div>

        </div>


        {/* HERO DECORATION */}

        <div className="hero-decoration">

          <div className="hero-circle">
            <span>♀</span>
          </div>

          <div className="hero-small-circle">
            ♡
          </div>

        </div>

      </section>



      {/* =====================================================
          SUMMARY CARDS
      ====================================================== */}

      <section className="dashboard-summary">

        {Object.values(DASHBOARD_SUMMARY).map((item, index) => (

          <article
            className="dashboard-stat"
            key={item.label}
          >

            <div className={`stat-icon stat-icon-${index}`}>
              {['♡', '⌁', '✦', '♥'][index]}
            </div>

            <div>

              <p>
                {item.label}
              </p>

              <strong>
                {item.value}
              </strong>

              <span>
                {item.status}
              </span>

            </div>

          </article>

        ))}

      </section>



      {/* =====================================================
          BLOOD REPORT
      ====================================================== */}

      <section className="report-upload-card">

        <div className="report-upload-content">

          <div className="report-icon">
            ⌁
          </div>

          <div>

            <span className="dashboard-eyebrow">
              HEALTH DOCUMENTS
            </span>

            <h2>
              Upload your blood report
            </h2>

            <p>
              Keep your health reports organised and use them for
              personalised AI-powered insights.
            </p>

            <div className="report-tags">

              <span>
                ✓ Blood tests
              </span>

              <span>
                ✓ CBC reports
              </span>

              <span>
                ✓ Lab reports
              </span>

            </div>

          </div>

        </div>


        <Link
          to="/reports"
          className="report-upload-btn"
        >
          Upload Report →
        </Link>

      </section>



      {/* =====================================================
          RISK OVERVIEW
      ====================================================== */}

      <section className="dashboard-section">

        <div className="dashboard-section-header">

          <div>

            <span className="dashboard-eyebrow">
              AI INSIGHTS
            </span>

            <h2>
              Health risk overview
            </h2>

            <p>
              Your latest personalised health indicators.
            </p>

          </div>

          <Link
            to="/results"
            className="view-all-link"
          >
            View details →
          </Link>

        </div>


        <div className="risk-grid">

          {DASHBOARD_RISKS.map((risk) => (

            <RiskCard
              key={risk.title}
              {...risk}
            />

          ))}

        </div>

      </section>



      {/* =====================================================
          WELLNESS TRENDS
      ====================================================== */}

      <section className="dashboard-section">

        <div className="dashboard-section-header">

          <div>

            <span className="dashboard-eyebrow">
              YOUR WELLNESS
            </span>

            <h2>
              Trends over time
            </h2>

          </div>

        </div>


        <div className="charts-grid">


          {/* WEIGHT */}

          <article className="dashboard-chart-card">

            <div className="chart-heading">

              <div>

                <h3>
                  Weight
                </h3>

                <p>
                  Your recent weight trend
                </p>

              </div>

              <span className="chart-badge">
                kg
              </span>

            </div>


            <ResponsiveContainer
              width="100%"
              height={260}
            >

              <LineChart
                data={WEIGHT_TREND_DATA}
              >

                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="#FFDADA"
                  vertical={false}
                />

                <XAxis
                  dataKey="date"
                  tick={{
                    fontSize: 12,
                  }}
                  stroke="#165823"
                  axisLine={false}
                  tickLine={false}
                />

                <YAxis
                  domain={[
                    'dataMin - 1',
                    'dataMax + 1',
                  ]}
                  tick={{
                    fontSize: 12,
                  }}
                  stroke="#165823"
                  axisLine={false}
                  tickLine={false}
                />

                <Tooltip />

                <Line
                  type="monotone"
                  dataKey="weight"
                  stroke="#FF788D"
                  strokeWidth={3}
                  dot={{
                    fill: '#FF788D',
                    stroke: '#FFF2F2',
                    strokeWidth: 2,
                    r: 5,
                  }}
                />

              </LineChart>

            </ResponsiveContainer>

          </article>



          {/* SLEEP */}

          <article className="dashboard-chart-card">

            <div className="chart-heading">

              <div>

                <h3>
                  Sleep
                </h3>

                <p>
                  Your recent sleep pattern
                </p>

              </div>

              <span className="chart-badge">
                hours
              </span>

            </div>


            <ResponsiveContainer
              width="100%"
              height={260}
            >

              <AreaChart
                data={SLEEP_TREND_DATA}
              >

                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="#FFDADA"
                  vertical={false}
                />

                <XAxis
                  dataKey="date"
                  tick={{
                    fontSize: 12,
                  }}
                  stroke="#165823"
                  axisLine={false}
                  tickLine={false}
                />

                <YAxis
                  domain={[5, 9]}
                  tick={{
                    fontSize: 12,
                  }}
                  stroke="#165823"
                  axisLine={false}
                  tickLine={false}
                />

                <Tooltip />

                <Area
                  type="monotone"
                  dataKey="hours"
                  stroke="#FF788D"
                  fill="#FFDADA"
                  fillOpacity={0.65}
                  strokeWidth={3}
                />

              </AreaChart>

            </ResponsiveContainer>

          </article>

        </div>

      </section>



      {/* =====================================================
          BOTTOM SECTION
      ====================================================== */}

      <div className="dashboard-bottom-grid">


        {/* ===================================================
            RECENT ACTIVITY
        ==================================================== */}

        <section className="dashboard-panel">

          <div className="dashboard-section-header compact">

            <div>

              <span className="dashboard-eyebrow">
                ACTIVITY
              </span>

              <h2>
                Recent activity
              </h2>

            </div>

          </div>


          <div className="activity-timeline">

            {RECENT_ACTIVITY.map((item) => (

              <div
                className="timeline-item"
                key={item.id}
              >

                <div className="timeline-dot" />

                <div>

                  <span>
                    {item.date}
                  </span>

                  <p>
                    {item.text}
                  </p>

                </div>

              </div>

            ))}

          </div>

        </section>



        {/* ===================================================
            QUICK ACTIONS
        ==================================================== */}

        <section className="dashboard-panel">

          <div className="dashboard-section-header compact">

            <div>

              <span className="dashboard-eyebrow">
                QUICK ACCESS
              </span>

              <h2>
                What would you like to do?
              </h2>

            </div>

          </div>


          <div className="quick-action-grid">


            {/* PROFILE */}

            <Link
              to="/profile"
              className="modern-action"
            >

              <span>
                ♡
              </span>

              <div>

                <strong>
                  Health Profile
                </strong>

                <small>
                  Manage your information
                </small>

              </div>

              <b>
                →
              </b>

            </Link>



            {/* HEALTH LOG */}

            <Link
              to="/health-logs"
              className="modern-action"
            >

              <span>
                ⌁
              </span>

              <div>

                <strong>
                  Add Health Log
                </strong>

                <small>
                  Record today's health
                </small>

              </div>

              <b>
                →
              </b>

            </Link>



            {/* REPORTS */}

            <Link
              to="/reports"
              className="modern-action"
            >

              <span>
                ▱
              </span>

              <div>

                <strong>
                  Blood Reports
                </strong>

                <small>
                  Upload & manage reports
                </small>

              </div>

              <b>
                →
              </b>

            </Link>



            {/* AI ASSESSMENT */}

            <Link
              to="/prediction"
              className="modern-action modern-action--primary"
            >

              <span>
                ✦
              </span>

              <div>

                <strong>
                  AI Assessment
                </strong>

                <small>
                  Get personalised insights
                </small>

              </div>

              <b>
                →
              </b>

            </Link>


          </div>

        </section>

      </div>

    </div>
  );
}

export default Dashboard;