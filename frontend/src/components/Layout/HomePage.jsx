import React from 'react';
import Navbar from './Navbar';
import Sidebar from './Sidebar';

const HomePage = () => {
  return (
    <div style={{ display: 'flex', height: '100vh' }}>
      <Sidebar />
      <div style={{ flex: 1, padding: '1rem' }}>
        <Navbar />
        <h2>Welcome to Logbook!</h2>
        {/* Future: RelationList component will render here */}
      </div>
    </div>
  );
};

export default HomePage;
