import React, { useState } from 'react';
import Navbar from './Navbar';
import Sidebar from './Sidebar';
import RelationList from '../Relations/RelationList';

const Dashboard = () => {
  const [selectedType, setSelectedType] = useState(null);

  const styles = {
    container: {
      display: 'flex',
      height: '100vh',
      backgroundColor: '#121212',
      color: '#f5f5f5'
    },
    content: {
      display: 'flex',
      flexDirection: 'column',
      flex: 1
    },
    main: {
      padding: '24px',
      overflowY: 'auto'
    },
    header: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: '24px'
    },
    heading: {
      fontSize: '24px',
      fontWeight: 'bold'
    }
  };

  return (
    <div style={styles.container}>
      <Sidebar onSelectType={setSelectedType} />
      <div style={styles.content}>
        <Navbar />
        <div style={styles.main}>
          <div style={styles.header}>
            <h2 style={styles.heading}>
              {selectedType ? `${selectedType} Contacts` : 'All Contacts'}
            </h2>
          </div>
          <RelationList filterType={selectedType} />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;