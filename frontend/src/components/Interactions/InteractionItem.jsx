import React, { useState, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../../contexts/AuthContext';
import { createCalendarEvent } from '../../services/api';
const InteractionItem = ({ interaction, onEdit, onDelete, onSummarize }) => {
  const { googleCredentials } = useContext(AuthContext);
  const [showDropdown, setShowDropdown] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editedText, setEditedText] = useState(interaction.content);

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

  const handleAddToCalendar = async () => {
    try {
      if (!googleCredentials) {
        alert('Please connect Google Calendar first');
        return;
      }

      console.log('[Debug] Creating calendar event for interaction:', interaction);

      const eventData = {
        summary: `Meeting with ${interaction.name || 'Contact'}`,
        description: interaction.content,
        start_time: new Date(interaction.timestamp || interaction.date),
        end_time: new Date(new Date(interaction.timestamp || interaction.date).getTime() + 60 * 60 * 1000), // 1 hour duration
        location: 'Virtual Meeting',
        attendees: [] // Optional: Add attendees if needed
      };

      console.log('[Debug] Event data:', eventData);

      const response = createCalendarEvent(eventData);

      console.log('[Debug] Calendar event created:', response.data);
      alert('Event added to Google Calendar!');
      setShowDropdown(false);

    } catch (error) {
      console.error('[Debug] Failed to add event:', error);
      alert('Failed to add event to calendar. Please try again.');
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
            {googleCredentials && (
              <button 
                onClick={handleAddToCalendar} 
                style={styles.dropdownItem}
                onMouseEnter={(e) => e.target.style.backgroundColor = '#333'}
                onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}
              >
                📅 Add to Calendar
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default InteractionItem;