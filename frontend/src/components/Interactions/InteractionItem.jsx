import React, { useState, useContext } from 'react';
import { AuthContext } from '../../contexts/AuthContext';
import { createCalendarEvent, extractEventsFromInteraction, addExtractedEventToCalendar } from '../../services/api';
import Modal from '../Common/Modal'; // Create this component if not exists

const InteractionItem = ({ interaction, onEdit, onDelete, onSummarize }) => {
  const { googleCredentials } = useContext(AuthContext);
  const [showDropdown, setShowDropdown] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editedText, setEditedText] = useState(interaction.content);
  const [showEventsModal, setShowEventsModal] = useState(false);
  const [extractedEvents, setExtractedEvents] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const styles = {
    container: {
      backgroundColor: '#1a1a1a',
      borderRadius: '8px',
      padding: '16px',
      margin: '12px 0',
      position: 'relative',
      border: '1px solid #333',
      transition: 'border-color 0.2s ease',
    },
    textContainer: {
      flex: 1,
      marginRight: '40px',
    },
    text: {
      color: '#e0e0e0',
      margin: 0,
      fontSize: '14px',
      lineHeight: '1.5',
    },
    editForm: {
      display: 'flex',
      gap: '8px',
      width: '100%',
    },
    input: {
      flex: 1,
      padding: '8px 12px',
      backgroundColor: '#2a2a2a',
      border: '1px solid #444',
      borderRadius: '4px',
      color: '#e0e0e0',
      fontSize: '14px',
    },
    saveButton: {
      padding: '8px 16px',
      backgroundColor: '#4CAF50',
      color: 'white',
      border: 'none',
      borderRadius: '4px',
      cursor: 'pointer',
      transition: 'background-color 0.2s ease',
    },
    dropdownWrapper: {
      position: 'absolute',
      top: '16px',
      right: '16px',
    },
    dropdownToggle: {
      backgroundColor: 'transparent',
      border: 'none',
      color: '#888',
      fontSize: '20px',
      cursor: 'pointer',
      padding: '4px 8px',
      borderRadius: '4px',
      transition: 'background-color 0.2s ease',
    },
    dropdownMenu: {
      position: 'absolute',
      top: '100%',
      right: '0',
      backgroundColor: '#252525',
      borderRadius: '4px',
      boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
      minWidth: '150px',
      zIndex: 1000,
      border: '1px solid #333',
    },
    dropdownItem: {
      width: '100%',
      padding: '8px 16px',
      border: 'none',
      backgroundColor: 'transparent',
      color: '#e0e0e0',
      textAlign: 'left',
      cursor: 'pointer',
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
      transition: 'background-color 0.2s ease',
      ':hover': {
        backgroundColor: '#333',
      },
    },
    metadata: {
      display: 'flex',
      justifyContent: 'space-between',
      color: '#888',
      fontSize: '12px',
      marginBottom: '8px',
    },
    calendarButton: {
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
      padding: '8px 16px',
      backgroundColor: '#4285f4',
      color: 'white',
      border: 'none',
      borderRadius: '4px',
      cursor: 'pointer',
      fontSize: '14px',
      transition: 'background-color 0.2s'
    },
    showEventsButton: {
      padding: '8px 16px',
      backgroundColor: '#4285f4',
      color: 'white',
      border: 'none',
      borderRadius: '4px',
      cursor: 'pointer',
      marginTop: '8px'
    },
    modalContent: {
      padding: '20px',
      maxWidth: '500px',
      width: '100%'
    },
    eventCard: {
      backgroundColor: '#2a2a2a',
      padding: '16px',
      borderRadius: '8px',
      marginBottom: '16px',
      border: '1px solid #444',
      boxShadow: '0 2px 4px rgba(0,0,0,0.2)'
    },
    eventTitle: {
      color: '#fff',
      fontSize: '18px',
      marginBottom: '12px',
      borderBottom: '1px solid #444',
      paddingBottom: '8px'
    },
    eventDetail: {
      color: '#e0e0e0',
      margin: '8px 0',
      display: 'flex',
      alignItems: 'flex-start',
      gap: '8px'
    },
    eventIcon: {
      width: '20px',
      color: '#888'
    },
    participantsList: {
      display: 'flex',
      flexDirection: 'column',
      gap: '4px'
    },
    participant: {
      backgroundColor: '#3a3a3a',
      padding: '4px 8px',
      borderRadius: '4px',
      fontSize: '14px'
    },
    addToCalendarButton: {
      backgroundColor: '#4CAF50',
      color: 'white',
      padding: '8px 16px',
      border: 'none',
      borderRadius: '4px',
      cursor: 'pointer',
      marginTop: '8px'
    }
  };

  const handleEditClick = () => {
    setIsEditing(true);
    setShowDropdown(false);
  };

  const handleSaveEdit = async () => {
    try {
      await onEdit({ ...interaction, content: editedText });
      setIsEditing(false);
    } catch (error) {
      console.error('Failed to save edit:', error);
    }
  };

  const handleDeleteClick = async () => {
    if (window.confirm('Are you sure you want to delete this interaction?')) {
      try {
        await onDelete(interaction.log_id);
        setShowDropdown(false);
      } catch (error) {
        console.error('Failed to delete interaction:', error);
      }
    }
  };

  const handleSummarizeClick = async () => {
    try {
      await onSummarize(interaction);
      setShowDropdown(false);
    } catch (error) {
      console.error('Failed to summarize interaction:', error);
    }
  };

  const handleAddToCalendar = async (event) => {
    try {
      if (!googleCredentials) {
        alert('Please connect Google Calendar first');
        return;
      }

      await addExtractedEventToCalendar(event);
      alert('Event added to calendar successfully!');
      setShowEventsModal(false);
    } catch (error) {
      console.error('Failed to add event to calendar:', error);
      alert('Failed to add event to calendar');
    }
  };

  const handleShowEvents = async () => {
    setIsLoading(true);
    try {
      console.log('Debug interaction:', interaction);
      
      if (!interaction.content) {
        throw new Error('No interaction content to analyze');
      }
      
      if (!interaction.relationship_id) {
        throw new Error('No relation ID available');
      }
      
      const events = await extractEventsFromInteraction(
        interaction.content, 
        interaction.relationship_id,
        interaction.date // assuming this is the date field
      );
      
      if (Array.isArray(events)) {
        setExtractedEvents(events);
        setShowEventsModal(true);
      } else {
        throw new Error('Invalid events data received');
      }
    } catch (error) {
      console.error('Failed to extract events:', error);
      alert(error.message || 'Failed to extract events from interaction');
    } finally {
      setIsLoading(false);
    }
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <>
      <div style={styles.container}>
        <div style={styles.metadata}>
          <span>{formatDate(interaction.date)}</span>
          <span>{interaction.type || 'Note'}</span>
        </div>
        
        <div style={styles.textContainer}>
          {isEditing ? (
            <div style={styles.editForm}>
              <input
                style={styles.input}
                value={editedText}
                onChange={(e) => setEditedText(e.target.value)}
                autoFocus
              />
              <button style={styles.saveButton} onClick={handleSaveEdit}>
                Save
              </button>
            </div>
          ) : (
            <p style={styles.text}>{interaction.content}</p>
          )}
        </div>

        <div style={styles.dropdownWrapper}>
          <button
            style={styles.dropdownToggle}
            onClick={() => setShowDropdown((prev) => !prev)}
            onBlur={() => setTimeout(() => setShowDropdown(false), 200)}
          >
            ⋮
          </button>
          {showDropdown && (
            <div style={styles.dropdownMenu}>
              <button 
                onClick={handleEditClick} 
                style={styles.dropdownItem}
                onMouseEnter={(e) => e.target.style.backgroundColor = '#333'}
                onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}
              >
                ✏️ Edit
              </button>
              <button 
                onClick={handleDeleteClick} 
                style={styles.dropdownItem}
                onMouseEnter={(e) => e.target.style.backgroundColor = '#333'}
                onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}
              >
                🗑️ Delete
              </button>
              <button 
                onClick={handleSummarizeClick} 
                style={styles.dropdownItem}
                onMouseEnter={(e) => e.target.style.backgroundColor = '#333'}
                onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}
              >
                🧠 Summarize
              </button>
            </div>
          )}
        </div>
        {googleCredentials && (<button 
          onClick={handleShowEvents}
          style={styles.showEventsButton}
          disabled={isLoading}
        >
          {isLoading ? 'Extracting Events...' : '🔍 Show Events'}
        </button>)}
      </div>

      {showEventsModal && (
        <Modal onClose={() => setShowEventsModal(false)}>
          <div style={styles.modalContent}>
            <h3>Extracted Events</h3>
            {extractedEvents.length === 0 ? (
              <p>No events found in this interaction.</p>
            ) : (
              extractedEvents.map((event, index) => (
                <div key={index} style={styles.eventCard}>
                  <h4 style={styles.eventTitle}>{event.title}</h4>
                  
                  <div style={styles.eventDetail}>
                    <span style={styles.eventIcon}>🕒</span>
                    <div>
                      <div>Start: {new Date(event.start_time).toLocaleString()}</div>
                      {event.end_time && (
                        <div>End: {new Date(event.end_time).toLocaleString()}</div>
                      )}
                    </div>
                  </div>

                  {event.location && (
                    <div style={styles.eventDetail}>
                      <span style={styles.eventIcon}>📍</span>
                      <div>{event.location}</div>
                    </div>
                  )}

                  {event.description && (
                    <div style={styles.eventDetail}>
                      <span style={styles.eventIcon}>📝</span>
                      <div>{event.description}</div>
                    </div>
                  )}

                  {event.participants && event.participants.length > 0 && (
                    <div style={styles.eventDetail}>
                      <span style={styles.eventIcon}>👥</span>
                      <div style={styles.participantsList}>
                        {event.participants.map((participant, i) => (
                          <div key={i} style={styles.participant}>
                            {participant.name} ({participant.email})
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  <button
                    onClick={() => handleAddToCalendar(event)}
                    style={{
                      ...styles.addToCalendarButton,
                      marginTop: '16px',
                      width: '100%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '8px'
                    }}
                  >
                    <span>📅</span> Add to Google Calendar
                  </button>
                </div>
              ))
            )}
          </div>
        </Modal>
      )}
    </>
  );
};

export default InteractionItem;