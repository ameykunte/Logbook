import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './components/Auth/LoginPage';
import PrivateRoute from './components/Auth/PrivateRoute';
import HomePage from './components/Layout/HomePage';
import HelloMessage from './components/Hello/HelloMessage';

function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route
        path="/*"
        element={
          <PrivateRoute>
            <HomePage />
          </PrivateRoute>
        }
      />
      <Route path="/hello" element={<HelloMessage />} />
    </Routes>
  );
}

export default App;
