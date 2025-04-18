// DailySummaryModal.jsx
import React, { useState, useEffect } from 'react';
import { fetchAllInteractionsForToday, summarizeDailyInteractions } from '../../services/api';

const DailySummaryModal = ({ isOpen, onClose }) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [summary, setSummary] = useState('');
  const [interactions, setInteractions] = useState([]);

  console.log("DailySummaryModal rendered, isOpen:", isOpen); // Debug log

  useEffect(() => {
    if (isOpen) {
      console.log("Modal is open, fetching daily summary"); // Debug log
      fetchDailySummary();
    }
  }, [isOpen]);

  const fetchDailySummary = async () => {
    setLoading(true);
    setError(null);
    
    try {
      console.log("Fetching today's interactions..."); // Debug log
      // Step 1: Fetch all interactions for today
      const todaysInteractions = await fetchAllInteractionsForToday();
      console.log(`Retrieved ${todaysInteractions.length} interactions for today`); // Debug log
      setInteractions(todaysInteractions);
      
      if (!todaysInteractions || todaysInteractions.length === 0) {
        setSummary("No interactions recorded for today.");
        setLoading(false);
        return;
      }
      
      // Step 2: Combine all interaction content
      const allContent = todaysInteractions.map(interaction => interaction.content).join('\n\n');
      console.log("Combined content length:", allContent.length); // Debug log
      console.log("Combined contentttttttttt:", allContent); // Debug log
      // Step 3: Send to Gemini API for summarization
      console.log("Sending to Gemini API for summarization..."); // Debug log
      const summaryResult = await summarizeDailyInteractions(allContent);
      console.log("Received summary from API"); // Debug log
      setSummary(summaryResult);
      
    } catch (err) {
      console.error("Failed to fetch daily summary:", err);
      setError(`Could not generate daily summary: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const styles = {
    overlay: {
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.75)',
      display: isOpen ? 'flex' : 'none',
      justifyContent: 'center',
      alignItems: 'center',
      zIndex: 1000
    },
    modal: {
      backgroundColor: '#1e1e1e',
      borderRadius: '8px',
      width: '700px',
      maxWidth: '90%',
      maxHeight: '80vh',
      overflow: 'hidden',
      boxShadow: '0 5px 20px rgba(0, 0, 0, 0.3)',
      display: 'flex',
      flexDirection: 'column'
    },
    header: {
      padding: '20px',
      borderBottom: '1px solid #333',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center'
    },
    title: {
      margin: 0,
      fontSize: '24px',
      fontWeight: 'bold',
      color: '#fff'
    },
    closeButton: {
      background: 'none',
      border: 'none',
      color: '#888',
      cursor: 'pointer',
      fontSize: '24px'
    },
    content: {
      padding: '24px',
      overflow: 'auto',
      flex: 1
    },
    summaryText: {
      color: '#ddd',
      fontSize: '16px',
      lineHeight: '1.6',
      whiteSpace: 'pre-wrap'
    },
    loading: {
      textAlign: 'center',
      padding: '40px',
      color: '#888'
    },
    error: {
      color: '#ff5555',
      padding: '20px',
      textAlign: 'center'
    },
    footer: {
      padding: '16px 24px',
      borderTop: '1px solid #333',
      display: 'flex',
      justifyContent: 'flex-end'
    },
    button: {
      padding: '10px 16px',
      backgroundColor: '#0D47A1',
      color: 'white',
      border: 'none',
      borderRadius: '4px',
      fontSize: '16px',
      cursor: 'pointer',
      transition: 'background-color 0.3s ease'
    },
    debug: {
      backgroundColor: '#333',
      padding: '10px',
      margin: '10px 0',
      borderRadius: '4px',
      fontSize: '12px',
      color: '#aaa'
    }
  };

  if (!isOpen) return null;

  return (
    <div style={styles.overlay}>
      <div style={styles.modal}>
        <div style={styles.header}>
          <h2 style={styles.title}>✨ Your Daily Summary</h2>
          <button style={styles.closeButton} onClick={onClose}>×</button>
        </div>

        <div style={styles.content}>
          {loading ? (
            <div style={styles.loading}>Generating your daily summary...</div>
          ) : error ? (
            <div style={styles.error}>{error}</div>
          ) : (
            <div style={styles.summaryText}>
              {summary}
            </div>
          )}
          
          {/* Debug info - remove in production */}
          {process.env.NODE_ENV !== 'production' && (
            <div style={styles.debug}>
              <div>Debug Info:</div>
              <div>Interactions found: {interactions.length}</div>
              <div>Modal state: {loading ? 'Loading' : error ? 'Error' : 'Loaded'}</div>
            </div>
          )}
        </div>

        <div style={styles.footer}>
          <button style={styles.button} onClick={onClose}>
            Close
          </button>
          {error && (
            <button 
              style={{...styles.button, marginLeft: '10px'}} 
              onClick={fetchDailySummary}
            >
              Try Again
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default DailySummaryModal;