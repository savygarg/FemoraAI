import { Routes, Route, useLocation, Navigate } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import LandingPage from './pages/LandingPage';
import { LoginPage, SignupPage } from './pages/AuthPage';
import DashboardPage from './pages/DashboardPage';
import PlaceholderPage from './pages/PlaceholderPage';
import DashboardLayout from './layouts/DashboardLayout';
import AuthLayout from './layouts/AuthLayout';

export default function App() {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="/landing" element={<LandingPage />} />

        <Route element={<AuthLayout />}>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
        </Route>

        <Route element={<DashboardLayout />}>
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route
            path="/dashboard/health-log"
            element={
              <PlaceholderPage
                title="Health Log"
                description="Track and review your daily health entries in one place."
              />
            }
          />
          <Route
            path="/dashboard/reports"
            element={
              <PlaceholderPage
                title="Reports"
                description="View detailed health reports and export your data."
              />
            }
          />
          <Route
            path="/dashboard/insights"
            element={
              <PlaceholderPage
                title="Insights"
                description="Discover AI-powered patterns and personalized recommendations."
              />
            }
          />
          <Route
            path="/dashboard/settings"
            element={
              <PlaceholderPage
                title="Settings"
                description="Manage your profile, preferences, and notifications."
              />
            }
          />
        </Route>
      </Routes>
    </AnimatePresence>
  );
}
