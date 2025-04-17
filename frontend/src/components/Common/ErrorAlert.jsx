import React from 'react';

const ErrorAlert = ({ message }) => (
  <div style={{ color: 'red', margin: '1rem 0' }}>
    <strong>Error:</strong> {message}
  </div>
);

export default ErrorAlert;
