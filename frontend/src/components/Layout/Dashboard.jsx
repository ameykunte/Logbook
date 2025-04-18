import React, { useState } from 'react';
import Navbar from './Navbar';
import Sidebar from './Sidebar';
import DailySummaryModal from './DailySummaryModal';
import RelationList from '../Relations/RelationList';
import SearchLogs from './SearchLogs'; // Import SearchLogs

const Dashboard = () => {
  const [selectedType, setSelectedType] = useState(null);
  const [showSearch, setShowSearch] = useState(false); // Track if search is open
  const [isDailySummaryOpen, setIsDailySummaryOpen] = useState(false);
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
      overflowY: 'auto',
      scrollbarWidth: 'none', // Hide scrollbar in Firefox
  msOverflowStyle: 'none',
    },
    header: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      width: '30%',
      marginBottom: '24px'
    },
    heading: {
      fontSize: '24px',
      fontWeight: 'bold'
    }
  };

  // Handler for sidebar search button
  const handleSidebarSearch = () => {
    setShowSearch(true);
  };

  // Handler to go back to relations (optional: you can add a back button in SearchLogs)
  const handleBackToRelations = () => {
    setShowSearch(false);
  };

  const handleOpenDailySummary = () => {
    setIsDailySummaryOpen(true);
  };

  const handleCloseDailySummary = () => {
    setIsDailySummaryOpen(false);
  };

  return (
    <div style={styles.container}>
      <Sidebar 
        onSelectType={(type) => {
          setSelectedType(type);
          setShowSearch(false); // Hide search if a type is selected
        }}
        onSearch={handleSidebarSearch} // Pass search handler
        onDailySummary={handleOpenDailySummary} // Pass daily summary handler
      />
      <div style={styles.content}>
        <Navbar />
        <div style={styles.main}>
          {!showSearch ? (
            <>
              <div style={styles.header}>
                <h2 style={styles.heading}>
                  {selectedType ? `${selectedType} Contacts` : 'All Contacts'}
                </h2>
              </div>
              <RelationList filterType={selectedType} />
            </>
          ) : (
            <SearchLogs /* Optionally pass handleBackToRelations as a prop */ />
          )}
        </div>
      </div>
      <DailySummaryModal 
        isOpen={isDailySummaryOpen}
        onClose={handleCloseDailySummary}
      />
    </div>
  );
};

export default Dashboard;