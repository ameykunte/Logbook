import React from 'react';

const Modal = ({ children, onClose }) => {
  const styles = {
    overlay: {
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.75)',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      zIndex: 1000
    },
    content: {
      backgroundColor: '#1a1a1a',
      padding: '20px',
      borderRadius: '8px',
      maxWidth: '90%',
      maxHeight: '90%',
      overflow: 'auto',
      position: 'relative'
    },
    closeButton: {
      position: 'absolute',
      top: '10px',
      right: '10px',
      background: 'none',
      border: 'none',
      color: '#fff',
      fontSize: '24px',
      cursor: 'pointer'
    }
  };

  return (
    <div style={styles.overlay}>
      <div style={styles.content}>
        <button style={styles.closeButton} onClick={onClose}>×</button>
        {children}
      </div>
    </div>
  );
};

export default Modal;