import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './components/Auth/LoginPage';
import PrivateRoute from './components/Auth/PrivateRoute';
import HomePage from './components/Layout/HomePage';
import HelloMessage from './components/Hello/HelloMessage';
import SignUpPage from './components/Auth/SignUpPage';

function App() {
  return (
    <Routes>
      <Route path="/signup" element={<SignUpPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route
        path="/home"
        element={
          <PrivateRoute>
            <HomePage />
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
