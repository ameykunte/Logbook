import React from 'react';
import { useNavigate } from 'react-router-dom';

const LandingPage = () => {
  const navigate = useNavigate();

  const styles = {
    container: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      padding: '4rem 2rem',
      fontFamily: 'sans-serif',
      color: '#fafafa',
      background: '#121212',
      minHeight: '100vh',
    },
    header: {
      textAlign: 'center',
      marginBottom: '3rem',
    },
    title: {
      fontSize: '3rem',
      margin: 0,
    },
    subtitle: {
      fontSize: '1.25rem',
      color: '#bbb',
      marginTop: '0.5rem',
    },
    features: {
      maxWidth: '600px',
      marginBottom: '3rem',
    },
    featureList: {
      listStyle: 'none',
      padding: 0,
    },
    featureItem: {
      margin: '0.75rem 0',
      fontSize: '1.1rem',
    },
    cta: {
      display: 'flex',
      gap: '1rem',
    },
    primaryButton: {
      padding: '0.75rem 1.5rem',
      fontSize: '1rem',
      background: '#0d47a1',
      color: '#fff',
      border: 'none',
      borderRadius: '4px',
      cursor: 'pointer',
    },
    secondaryButton: {
      padding: '0.75rem 1.5rem',
      fontSize: '1rem',
      background: 'transparent',
      color: '#0d47a1',
      border: '1px solid #0d47a1',
      borderRadius: '4px',
      cursor: 'pointer',
    },
  };

  return (
    <div style={styles.container}>
      <header style={styles.header}>
        <h1 style={styles.title}>Logbook</h1>
        <p style={styles.subtitle}>Your AI‑powered personal relationship manager.</p>
      </header>

      <section style={styles.features}>
        <h2>Key Features</h2>
        <ul style={styles.featureList}>
          <li style={styles.featureItem}>📇 Centralize contacts: friends, family, colleagues.</li>
          <li style={styles.featureItem}>📝 Log interactions with text & images—auto‑summarized by AI.</li>
          <li style={styles.featureItem}>🔍 Natural‑language search over your entire history.</li>
          <li style={styles.featureItem}>🔒 Secure, private, and easy to use.</li>
        </ul>
      </section>

      <div style={styles.cta}>
        <button
          style={styles.primaryButton}
          onClick={() => navigate('/signup')}
        >
          Sign Up
        </button>
        <button
          style={styles.secondaryButton}
          onClick={() => navigate('/login')}
        >
          Log In
        </button>
      </div>
    </div>
  );
};

export default LandingPage;
