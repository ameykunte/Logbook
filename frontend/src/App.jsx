import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './components/Auth/LoginPage';
import PrivateRoute from './components/Auth/PrivateRoute';
import HelloMessage from './components/Hello/HelloMessage';
import SignUpPage from './components/Auth/SignUpPage';
import Dashboard from './components/Layout/Dashboard';

function App() {
  return (
    <Routes>
      <Route path="/signup" element={<SignUpPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route
        path="/dashboard"
        element={
          <PrivateRoute>
            <Dashboard />
          </PrivateRoute>
        }
      />
      <Route path="/hello" element={
        <PrivateRoute>
        <HelloMessage />
        </PrivateRoute>} />
    </Routes>
  );
}

export default App;
