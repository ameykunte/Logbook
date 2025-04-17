import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../../contexts/AuthContext';

const PrivateRoute = ({ children }) => {
  const { access_token } = useContext(AuthContext);

  if (!access_token) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default PrivateRoute;
