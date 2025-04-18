import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './components/Auth/LoginPage';
import PrivateRoute from './components/Auth/PrivateRoute';
import SignUpPage from './components/Auth/SignUpPage';
import Dashboard from './components/Layout/Dashboard';
import Search from './components/Layout/SearchLogs';
// import DailySummary from './components/Layout/DailySummaryModal';

function App() {
  return (
    <Routes>
      <Route path="/signup" element={<SignUpPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route
        path="/"
        element={
          <PrivateRoute>
            <Dashboard />
          </PrivateRoute>
        }
      />
      <Route
        path="/search"
        element={
          <PrivateRoute>
            <Search />
          </PrivateRoute>
        }
      />
      {/* <Route
        path="/daily-summary"
        element={
          <PrivateRoute>
            <DailySummary />
          </PrivateRoute>
        }
      /> */}
    </Routes>
  );
}

export default App;
