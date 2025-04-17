import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from '../../services/api';
import { AuthContext } from '../../contexts/AuthContext';
import './SignUpPage.css';

const SignUpPage = () => {
  const { login } = useContext(AuthContext); // Use login from AuthContext to set token after signup
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [userName, setUserName] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSignUp = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // Call the signup API
      const response = await axios.post('/auth/signup', {
        email,
        password,
        user_name: userName,
      });

      // Automatically log in the user after signup
      await login({ email, password });

      // Redirect to the home page
      navigate('/home');
    } catch (err) {
      setError(err.response?.data?.error || 'Sign Up failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="signup-container">
      <form className="signup-form" onSubmit={handleSignUp}>
        <h2>Sign Up</h2>
        {error && <p className="error">{error}</p>}
        <div className="form-group">
          <label>User Name</label>
          <input
            type="text"
            value={userName}
            onChange={(e) => setUserName(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label>Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label>Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit" disabled={loading}>
          {loading ? 'Signing Up...' : 'Sign Up'}
        </button>
        <p className="switch-auth">
          Already a user?{' '}
          <span onClick={() => navigate('/login')} className="auth-link">
            Login here
          </span>
        </p>
      </form>
    </div>
  );
};

export default SignUpPage;