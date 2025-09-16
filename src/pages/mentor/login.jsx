import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';

const MentorLogin = () => {
  const [credentials, setCredentials] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [mounted, setMounted] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleInputChange = (e) => {
    setCredentials(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
    setError('');
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await fetch('/api/auth/mentor', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: credentials.email,
          password: credentials.password
        })
      });

      const data = await response.json();

      if (response.ok && data.success) {
        // Store mentor data in localStorage
        const mentorData = data.data;
        if (mentorData) {
          localStorage.setItem('mentorUserId', mentorData.id);
          localStorage.setItem('mentorName', mentorData.name);
          localStorage.setItem('mentorEmail', mentorData.email);
          localStorage.setItem('mentorSubject', mentorData.subject);
          localStorage.setItem('userId', mentorData.id);
          localStorage.setItem('authToken', 'mentor-token-' + Date.now());
        }
        
        // Redirect to dashboard
        window.location.href = '/mentor/dashboard';
      } else {
        setError(data.message || data.error || 'Invalid email or password');
      }
    } catch (error) {
      console.error('Login error:', error);
      setError('Network error. Please check your connection and try again.');
    } finally {
      setLoading(false);
    }
  };

  if (!mounted) {
    return null;
  }

  return (
    <div style={{
      fontFamily: 'Arial, sans-serif',
      background: '#f5f5f5',
      margin: 0,
      padding: '20px',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      minHeight: '100vh'
    }}>
      <div style={{
        background: 'white',
        padding: '40px',
        borderRadius: '8px',
        boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
        width: '100%',
        maxWidth: '400px'
      }}>
        <h1 style={{
          textAlign: 'center',
          color: '#333',
          marginBottom: '30px'
        }}>
          Mentor Login
        </h1>
        
        <form onSubmit={handleLogin}>
          <div style={{ marginBottom: '20px' }}>
            <label style={{
              display: 'block',
              marginBottom: '5px',
              color: '#555',
              fontWeight: 'bold'
            }}>
              Email
            </label>
            <input
              type="email"
              name="email"
              value={credentials.email}
              onChange={handleInputChange}
              required
              style={{
                width: '100%',
                padding: '12px',
                border: '1px solid #ddd',
                borderRadius: '4px',
                fontSize: '16px',
                boxSizing: 'border-box'
              }}
            />
          </div>
          
          <div style={{ marginBottom: '20px' }}>
            <label style={{
              display: 'block',
              marginBottom: '5px',
              color: '#555',
              fontWeight: 'bold'
            }}>
              Password
            </label>
            <input
              type="password"
              name="password"
              value={credentials.password}
              onChange={handleInputChange}
              required
              style={{
                width: '100%',
                padding: '12px',
                border: '1px solid #ddd',
                borderRadius: '4px',
                fontSize: '16px',
                boxSizing: 'border-box'
              }}
            />
          </div>
          
          <button
            type="submit"
            disabled={loading}
            style={{
              width: '100%',
              padding: '12px',
              background: loading ? '#ccc' : '#007bff',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              fontSize: '16px',
              cursor: loading ? 'not-allowed' : 'pointer'
            }}
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>
        
        {error && (
          <div style={{
            padding: '10px',
            margin: '15px 0',
            borderRadius: '4px',
            textAlign: 'center',
            background: '#f8d7da',
            color: '#721c24',
            border: '1px solid #f5c6cb'
          }}>
            {error}
          </div>
        )}
      </div>
    </div>
  );
};

export default MentorLogin;
