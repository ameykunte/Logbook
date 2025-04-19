// src/App.jsx

import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import LandingPage from './components/Layout/LandingPage';
import LoginPage from './components/Auth/LoginPage';
import SignUpPage from './components/Auth/SignUpPage';
import PrivateRoute from './components/Auth/PrivateRoute';
import Dashboard from './components/Layout/Dashboard';
import Search from './components/Layout/SearchLogs';

function App() {
  return (
    <Routes>
      {/* Public landing page */}
      <Route path="/" element={<LandingPage />} />

      {/* Auth pages */}
      <Route path="/signup" element={<SignUpPage />} />
      <Route path="/login" element={<LoginPage />} />

      {/* Protected dashboard */}
      <Route
        path="/dashboard/*"
        element={
          <PrivateRoute>
            <Dashboard />
          </PrivateRoute>
        }
      />

      {/* Protected search view */}
      <Route
        path="/search"
        element={
          <PrivateRoute>
            <Search />
          </PrivateRoute>
        }
      />

      {/* Redirect any unknown route back to landing */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;
