import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

import './App.css';

import ProtectedRoute from './components/ProtectedRoute';
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

function App() {
  return (
    <BrowserRouter>
      <Routes>
       <Route path="/" element={<Home />} />

        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        <Route element={<ProtectedRoute />}>
          <Route element={<AppLayout />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/profile" element={<HealthProfile />} />
            <Route path="/health-logs" element={<HealthLogs />} />
            <Route path="/prediction" element={<Prediction />} />
            <Route path="/results" element={<Results />} />
            <Route path="/chatbot" element={<Chatbot />} />
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
