import { BrowserRouter, Routes, Route } from 'react-router-dom';

import './App.css';

import ProtectedRoute from './components/ProtectedRoute';
import GuestRoute from './components/GuestRoute';
import AppLayout from './components/AppLayout';
import Home from "./pages/Home";
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/DashBoard';
import HealthProfile from './pages/HealthProfile';
import HealthLogs from './pages/HealthLogs';
import Prediction from './pages/Prediction';
import Results from './pages/Results';
import Chatbot from './pages/Chatbot';
import BloodReport from './pages/BloodReport';
import MyProfile from './pages/MyProfile';
import Journal from './pages/Journal';

function App() {
  return (
    <BrowserRouter>
      <Routes>
       <Route path="/" element={<Home />} />

        <Route element={<GuestRoute />}>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
        </Route>

        <Route element={<ProtectedRoute />}>
          <Route element={<AppLayout />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/profile" element={<HealthProfile />} />
            <Route path="/my-profile" element={<MyProfile />} />
            <Route path="/health-logs" element={<HealthLogs />} />
            <Route path="/journal" element={<Journal />} />
            <Route path="/prediction" element={<Prediction />} />
            <Route path="/results" element={<Results />} />
            <Route path="/chatbot" element={<Chatbot />} />
            <Route path="/blood-report" element={<BloodReport />} />
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
