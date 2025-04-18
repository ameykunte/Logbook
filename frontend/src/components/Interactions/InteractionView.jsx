import React, { useState, useEffect } from 'react';
import { createInteraction, fetchInteractions, updateInteraction, deleteInteraction } from '../../services/api';
import InteractionItem from './InteractionItem';

const InteractionView = ({ relation, onClose, onUpdate }) => {
  const [interactions, setInteractions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [interactionText, setInteractionText] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);
  const [isSummarizing, setIsSummarizing] = useState(false);
  const [summary, setSummary] = useState('');
  const [showInteractionForm, setShowInteractionForm] = useState(false);

  const styles = {
    container: {
      height: '100%',
      width: '100%',
      backgroundColor: '#121212',
      display: 'flex',
      flexDirection: 'column',
      overflow: 'hidden'
    },
    header: {
      padding: '16px',
      borderBottom: '1px solid #333',
      backgroundColor: '#1e1e1e',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center'
    },
    title: {
      margin: 0,
      fontSize: '20px',
      fontWeight: 'bold',
      color: '#fff'
    },
    subtitle: {
      margin: '8px 0 0',
      fontSize: '14px',
      color: '#888'
    },
    closeButton: {
      background: 'none',
      border: 'none',
      color: '#888',
      cursor: 'pointer',
      fontSize: '20px'
    },
    content: {
      padding: '16px',
      flex: 1,
      overflow: 'auto'
    },
    actionButtons: {
      display: 'flex',
      gap: '10px',
      margin: '16px 0'
    },
    button: {
      padding: '10px 16px',
      borderRadius: '4px',
      cursor: 'pointer',
      fontWeight: 'medium',
      border: '1px solid #333',
      transition: 'all 0.2s ease'
    },
    primaryButton: {
      backgroundColor: '#0D47A1',
      color: 'white',
      border: 'none'
    },
    secondaryButton: {
      backgroundColor: 'transparent',
      color: '#ccc'
    },
    interactionForm: {
      backgroundColor: '#222',
      padding: '16px',
      borderRadius: '8px',
      marginBottom: '16px'
    },
    textarea: {
      width: '100%',
      minHeight: '120px',
      backgroundColor: '#1a1a1a',
      border: '1px solid #333',
      borderRadius: '4px',
      padding: '12px',
      color: '#ddd',
      fontSize: '14px',
      resize: 'vertical',
      marginBottom: '12px'
    },
    fileInput: {
      display: 'none'
    },
    fileInputLabel: {
      display: 'inline-block',
      padding: '10px 16px',
      backgroundColor: '#333',
      color: '#ccc',
      borderRadius: '4px',
      cursor: 'pointer',
      marginRight: '10px'
    },
    fileInfo: {
      marginTop: '10px',
      fontSize: '14px',
      color: '#888'
    },
    formButtons: {
      display: 'flex',
      justifyContent: 'flex-end',
      gap: '10px',
      marginTop: '16px'
    },
    interactionList: {
      display: 'flex',
      flexDirection: 'column',
      gap: '16px'
    },
    interactionCard: {
      backgroundColor: '#222',
      borderRadius: '8px',
      padding: '16px',
      borderLeft: '4px solid #0D47A1'
    },
    interactionHeader: {
      display: 'flex',
      justifyContent: 'space-between',
      marginBottom: '12px',
      fontSize: '14px',
      color: '#888'
    },
    interactionContent: {
      color: '#ddd',
      fontSize: '15px',
      lineHeight: '1.5'
    },
    emptyState: {
      textAlign: 'center',
      padding: '32px',
      color: '#888'
    }
  };

  useEffect(() => {
    if (relation) {
      loadInteractions();
    }
  }, [relation]);

  const loadInteractions = async () => {
    setLoading(true);
    try {
      // If we're in development and we have mock interactions, use those
      // if (process.env.NODE_ENV === 'development' && relation.interactions) {
      //   setInteractions(relation.interactions);
      // } else {
        // Otherwise, fetch from API
        const data = await fetchInteractions(relation.relationship_id);
        setInteractions(data || []);
      // }
      setError(null);
    } catch (err) {
      console.error("Failed to load interactions:", err);
      setError("Could not load interaction history.");
      setInteractions([]);
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const summarizeText = async () => {
    setIsSummarizing(true);
    try {
      // In a real implementation, this would call an API to summarize the text
      // For now, we'll simulate the AI summarization with a timeout
      await new Promise(resolve => setTimeout(resolve, 1000));
      setSummary(interactionText);
    } catch (err) {
      setError("Failed to summarize text. Please try again.");
    } finally {
      setIsSummarizing(false);
    }
  };

  // Add these imports at the top
// import { createInteraction, fetchInteractions, deleteInteraction, updateInteraction } from '../../services/api';

  // Add these new state variables in the component
  const [selectedInteraction, setSelectedInteraction] = useState(null);

  // Add these event handlers after the existing functions
  const handleEdit = async (updatedInteraction) => {
    try {
      // Call API to update the interaction
      await updateInteraction(updatedInteraction.log_id, updatedInteraction);
      
      // Update the interactions list
      setInteractions(interactions.map(interaction => 
        interaction.log_id === updatedInteraction.log_id ? updatedInteraction : interaction
      ));
      
      setError(null);
    } catch (err) {
      console.error("Failed to edit interaction:", err);
      setError("Failed to edit interaction. Please try again.");
    }
  };

  const handleDelete = async (interactionId) => {
    try {
      // Call API to delete the interaction
      await deleteInteraction(interactionId);
      
      // Remove the interaction from the list
      setInteractions(interactions.filter(interaction => interaction.log_id !== interactionId));
      
      setError(null);
    } catch (err) {
      console.error("Failed to delete interaction:", err);
      setError("Failed to delete interaction. Please try again.");
    }
  };

  const handleSummarize = async (interaction) => {
    try {
      setIsSummarizing(true);
      
      // In a real implementation, this would call an AI API to summarize the content
      // For now, we'll simulate the API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      const aiSummary = `AI Summary of interaction from ${formatDate(interaction.date)}: ${interaction.content.substring(0, 100)}...`;
      
      // You could either update the interaction with the summary or display it separately
      alert(aiSummary); // For demonstration, just showing in an alert
      
      setError(null);
    } catch (err) {
      console.error("Failed to summarize interaction:", err);
      setError("Failed to summarize interaction. Please try again.");
    } finally {
      setIsSummarizing(false);
    }
  };

  const summarizeFile = async () => {
    if (!selectedFile) return;
    
    setIsSummarizing(true);
    try {
      // In a real implementation, this would upload the file and call an API to summarize it
      // For now, we'll simulate the AI summarization with a timeout
      await new Promise(resolve => setTimeout(resolve, 1500));
      setSummary(`Summary of file: ${selectedFile.name}. This is an AI-generated summary of the document's key points and insights. In a real implementation, this would contain a detailed analysis of the document's content using AI tools.`);
    } catch (err) {
      setError("Failed to summarize file. Please try again.");
    } finally {
      setIsSummarizing(false);
    }
  };

  const saveInteraction = async () => {
    try {
      const newInteraction = {
        "date": new Date().toISOString(),
        "content": summary || interactionText,
        "embeddings": [],
      };
      
      // In a real implementation, this would create the interaction via API
      // For now, we'll simulate the API call
      await createInteraction(relation.relationship_id, newInteraction);
      await loadInteractions();
      setInteractions([newInteraction, ...interactions]);
      
      // Reset form
      setInteractionText('');
      setSelectedFile(null);
      setSummary('');
      setShowInteractionForm(false);
      
      if (onUpdate) onUpdate();
    } catch (err) {
      setError("Failed to save interaction. Please try again.");
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getInteractionTypeIcon = (type) => {
    switch (type) {
      case 'meeting': return '🤝';
      case 'call': return '📞';
      case 'document': return '📄';
      default: return '💬';
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <div>
          <h2 style={styles.title}>{relation.name}</h2>
          <p style={styles.subtitle}>{relation.relationshipType} • {relation.city}</p>
        </div>
        <button style={styles.closeButton} onClick={onClose}>×</button>
      </div>
      
      <div style={styles.content}>
        <div style={styles.actionButtons}>
          <button 
            style={{...styles.button, ...styles.primaryButton}}
            onClick={() => setShowInteractionForm(true)}
          >
            New Interaction
          </button>
        </div>
        
        {error && <div style={{color: '#ff5555', margin: '10px 0'}}>{error}</div>}
        
        {showInteractionForm && (
          <div style={styles.interactionForm}>
            <h3 style={{color: '#fff', marginTop: 0}}>Add New Interaction</h3>
            
            <textarea
              style={styles.textarea}
              value={interactionText}
              onChange={(e) => setInteractionText(e.target.value)}
              placeholder="Enter notes about your interaction..."
            />
            
            <div>
              <input
                type="file"
                id="file-upload"
                style={styles.fileInput}
                onChange={handleFileChange}
              />
              <label htmlFor="file-upload" style={styles.fileInputLabel}>
                Upload File
              </label>
              {selectedFile && (
                <span style={styles.fileInfo}>
                  Selected: {selectedFile.name}
                </span>
              )}
            </div>
            
            {summary && (
              <div style={{marginTop: '16px'}}>
                <h4 style={{color: '#ccc'}}>AI Summary:</h4>
                <div style={{
                  backgroundColor: '#1a1a1a',
                  padding: '12px',
                  borderRadius: '4px',
                  color: '#ddd'
                }}>
                  {summary}
                </div>
              </div>
            )}
            
            <div style={styles.formButtons}>
              <button 
                style={{...styles.button, ...styles.secondaryButton}}
                onClick={() => {
                  setShowInteractionForm(false);
                  setInteractionText('');
                  setSelectedFile(null);
                  setSummary('');
                }}
              >
                Cancel
              </button>
              
              {interactionText && !summary && (
                <button 
                  style={{...styles.button, ...styles.secondaryButton}}
                  onClick={summarizeText}
                  disabled={isSummarizing}
                >
                  {isSummarizing ? 'Summarizing...' : 'Summarize Text'}
                </button>
              )}
              
              {selectedFile && !summary && (
                <button 
                  style={{...styles.button, ...styles.secondaryButton}}
                  onClick={summarizeFile}
                  disabled={isSummarizing}
                >
                  {isSummarizing ? 'Summarizing...' : 'Summarize File'}
                </button>
              )}
              
              <button 
                style={{...styles.button, ...styles.primaryButton}}
                onClick={saveInteraction}
                disabled={(!interactionText && !selectedFile) || isSummarizing}
              >
                Save
              </button>
            </div>
          </div>
        )}
        
        {loading ? (
          <div style={styles.emptyState}>Loading interactions...</div>
        ) : interactions.length === 0 ? (
          <div style={styles.emptyState}>
            No interaction history yet. Add your first interaction to start tracking your relationship.
          </div>
        ) : (
          <div style={styles.interactionList}>
            {interactions.map((interaction) => (
              <div key={interaction.id} style={styles.interactionCard}>
                <InteractionItem
                  interaction={interaction}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                  onSummarize={handleSummarize}
                />
                {/* <div style={styles.interactionHeader}>
                <span>
                  {getInteractionTypeIcon(interaction?.type || '')} 
                  {interaction?.type ? interaction.type.charAt(0).toUpperCase() + interaction.type.slice(1) : 'Unknown'}
                </span>
                <span>{formatDate(interaction.date)}</span>
                </div>
                <div style={styles.interactionContent}>
                  {interaction.content}
                </div> */}
              </div>
            ))}
          </div>
        )}  
      </div>
    </div>
  );
};

export default InteractionView;