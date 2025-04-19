import React, { useState, useEffect } from 'react';
import { fetchAllInteractionsForToday, summarizeDailyInteractions } from '../../services/api';
import { Clock, Calendar, UserCircle, RefreshCw, X } from 'lucide-react';
import ReactMarkdown from 'react-markdown';

const DailySummaryModal = ({ isOpen, onClose }) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [summary, setSummary] = useState('');
  const [interactions, setInteractions] = useState([]);
  const [date, setDate] = useState('');

  useEffect(() => {
    if (isOpen) {
      fetchDailySummary();
      setDate(new Date().toLocaleDateString('en-US', { 
        weekday: 'long', 
        month: 'long', 
        day: 'numeric', 
        year: 'numeric' 
      }));
    }
  }, [isOpen]);

  const fetchDailySummary = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const todaysInteractions = await fetchAllInteractionsForToday();
      setInteractions(todaysInteractions);
      
      if (!todaysInteractions || todaysInteractions.length === 0) {
        setSummary("No interactions recorded for today.");
        setLoading(false);
        return;
      }
      
      const summaryResult = await summarizeDailyInteractions(todaysInteractions);
      setSummary(summaryResult);
      
    } catch (err) {
      console.error("Failed to fetch daily summary:", err);
      setError(`Could not generate daily summary: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  // Process summary to convert markdown to styled HTML
  const renderMarkdown = (text) => {
    return <ReactMarkdown>{text}</ReactMarkdown>;
  };

  const styles = {
    overlay: {
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      display: isOpen ? 'flex' : 'none',
      justifyContent: 'center',
      alignItems: 'center',
      zIndex: 1000,
      backdropFilter: 'blur(5px)'
    },
    modal: {
      backgroundColor: '#1e1e1e',
      borderRadius: '12px',
      width: '800px',
      maxWidth: '90%',
      maxHeight: '85vh',
      overflow: 'hidden',
      // boxShadow: '0 8px 32px rgba(0, 0, 0, 0.5)',
      display: 'flex',
      flexDirection: 'column',
      // border: '1px solid rgba(255, 255, 255, 0.1)'
    },
    header: {
      padding: '24px 28px',
      borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      background: 'linear-gradient(180deg, #2c2c2c 0%, #1e1e1e 100%)'
    },
    title: {
      margin: 0,
      fontSize: '35px',
      fontWeight: 'bold',
      color: '#fff',
      display: 'flex',
      alignItems: 'center',
      gap: '12px',
      marginBottom: '12px'
    },
    closeButton: {
      background: 'none',
      border: 'none',
      color: '#888',
      cursor: 'pointer',
      fontSize: '24px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '8px',
      borderRadius: '8px',
      transition: 'all 0.2s ease',
      ':hover': {
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
        color: '#fff'
      }
    },
    dateContainer: {
      display: 'flex',
      alignItems: 'center',
      gap: '6px',
      color: '#aaa',
      fontSize: '14px',
      marginTop: '6px'
    },
    content: {
      padding: '32px',
      overflow: 'auto',
      flex: 1
    },
    summaryContainer: {
      backgroundColor: '#2a2a2a',
      borderRadius: '8px',
      padding: '24px',
      border: '1px solid rgba(255, 255, 255, 0.05)'
    },
    summaryText: {
      color: '#eee',
      fontSize: '16px',
      lineHeight: '1.8',
      fontFamily: 'Inter, system-ui, sans-serif'
    },
    heading: {
      color: '#fff',
      fontSize: '20px',
      fontWeight: 'bold',
      marginTop: '24px',
      marginBottom: '12px',
      paddingBottom: '8px',
      borderBottom: '1px solid rgba(255, 255, 255, 0.1)'
    },
    subheading: {
      color: '#0D47A1',
      fontSize: '18px',
      fontWeight: 'bold',
      marginTop: '16px',
      marginBottom: '8px'
    },
    interactionInfo: {
      display: 'flex',
      alignItems: 'center',
      gap: '16px',
      marginBottom: '24px'
    },
    interactionCount: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: 'rgba(13, 71, 161, 0.2)',
      borderRadius: '8px',
      padding: '12px',
      width: '100px'
    },
    interactionNumber: {
      fontSize: '24px',
      fontWeight: 'bold',
      color: '#fff'
    },
    interactionLabel: {
      fontSize: '12px',
      color: '#aaa',
      marginTop: '4px'
    },
    loading: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '60px',
      color: '#888',
      gap: '16px'
    },
    loadingSpinner: {
      animation: 'spin 1.5s linear infinite',
      color: '#0D47A1'
    },
    '@keyframes spin': {
      '0%': { transform: 'rotate(0deg)' },
      '100%': { transform: 'rotate(360deg)' }
    },
    error: {
      color: '#ff5555',
      padding: '24px',
      textAlign: 'center',
      backgroundColor: 'rgba(255, 85, 85, 0.1)',
      borderRadius: '8px',
      border: '1px solid rgba(255, 85, 85, 0.3)',
      margin: '16px 0'
    },
    footer: {
      padding: '20px 28px',
      borderTop: '1px solid rgba(255, 255, 255, 0.1)',
      display: 'flex',
      justifyContent: 'flex-end',
      gap: '12px'
    },
    button: {
      padding: '10px 20px',
      backgroundColor: '#0D47A1',
      color: 'white',
      border: 'none',
      borderRadius: '6px',
      fontSize: '15px',
      fontWeight: '600',
      cursor: 'pointer',
      transition: 'background-color 0.3s ease',
      display: 'flex',
      alignItems: 'center',
      gap: '8px'
    },
    secondaryButton: {
      backgroundColor: 'transparent',
      border: '1px solid rgba(255, 255, 255, 0.2)',
      color: '#ddd'
    },
    debug: {
      backgroundColor: '#333',
      padding: '12px',
      margin: '16px 0',
      borderRadius: '6px',
      fontSize: '12px',
      color: '#aaa'
    },
    customMarkdownStyles: {
      '& h1': {
        fontSize: '24px',
        fontWeight: 'bold',
        color: '#fff',
        marginTop: '24px',
        marginBottom: '16px',
        borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
        paddingBottom: '8px'
      },
      '& h2': {
        fontSize: '20px',
        fontWeight: 'bold',
        color: '#0D47A1',
        marginTop: '20px',
        marginBottom: '12px'
      },
      '& h3': {
        fontSize: '18px',
        fontWeight: 'bold',
        color: '#aaa',
        marginTop: '16px',
        marginBottom: '8px'
      },
      '& p': {
        marginBottom: '16px',
        lineHeight: '1.8'
      },
      '& ul': {
        paddingLeft: '24px',
        marginBottom: '16px'
      },
      '& li': {
        marginBottom: '8px'
      },
      '& strong': {
        color: '#fff',
        fontWeight: 'bold'
      }
    }
  };

  if (!isOpen) return null;

  return (
    <div style={styles.overlay}>
      <div style={styles.modal}>
        <div style={styles.header}>
          <div>
            <h2 style={styles.title}>
              Daily Summary
            </h2>
            <div style={styles.dateContainer}>
              <Calendar size={14} />
              <span>{date}</span>
            </div>
          </div>
          <button style={styles.closeButton} onClick={onClose}>
            <X size={24} />
          </button>
        </div>

        <div style={styles.content}>
          {loading ? (
            <div style={styles.loading}>
              <RefreshCw size={36} style={{
                animation: 'spin 1.5s linear infinite',
                '@keyframes spin': {
                  '0%': { transform: 'rotate(0deg)' },
                  '100%': { transform: 'rotate(360deg)' }
                }
              }} />
              <div>Generating your daily summary...</div>
            </div>
          ) : error ? (
            <div style={styles.error}>{error}</div>
          ) : (
            <>
              <div style={styles.interactionInfo}>
                <div style={styles.interactionCount}>
                  <div style={styles.interactionNumber}>{interactions.length}</div>
                  <div style={styles.interactionLabel}>Interactions</div>
                </div>
                <div style={styles.interactionCount}>
                  <div style={styles.interactionNumber}>
                    {new Set(interactions.map(i => i.relationName)).size}
                  </div>
                  <div style={styles.interactionLabel}>Contacts</div>
                </div>
              </div>
              
              <div style={styles.summaryContainer}>
                <div 
                  style={{
                    ...styles.summaryText,
                    ...styles.customMarkdownStyles
                  }}
                  className="markdown-body"
                >
                  {renderMarkdown(summary)}
                </div>
              </div>
            </>
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
          {error && (
            <button 
              style={{...styles.button}} 
              onClick={fetchDailySummary}
            >
              <RefreshCw size={16} />
              Try Again
            </button>
          )}
          <button 
            style={{...styles.button, ...(error ? styles.secondaryButton : {})}}
            onClick={onClose}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default DailySummaryModal;