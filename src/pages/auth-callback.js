import React, { useState, useEffect } from 'react';
import { navigate } from 'gatsby';

const AuthCallbackPage = ({ location }) => {
  const [status, setStatus] = useState('Exchanging code for token...');
  const [error, setError] = useState(null);

  useEffect(() => {
    const exchangeCode = async () => {
      const searchParams = new URLSearchParams(location.search);
      const code = searchParams.get('code');

      if (!code) {
        setError('No authorization code found. Returning home.');
        setTimeout(() => navigate('/'), 3000);
        return;
      }

      try {
        const response = await fetch('/api/exchange-token', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ code }),
        });

        if (!response.ok) {
          throw new Error('Could not exchange token.');
        }

        const data = await response.json();
        localStorage.setItem('bankvizz_access_token', data.accessToken);
        setStatus('Success! Redirecting to your dashboard...');
        
        // Redirect to homepage after a short delay
        setTimeout(() => navigate('/'), 1000);

      } catch (err) {
        setError('Authentication failed. Please try again.');
        setTimeout(() => navigate('/'), 3000);
      }
    };

    exchangeCode();
  }, [location.search]);

  return (
    <div style={{ padding: '2rem' }}>
      <h1>Authenticating</h1>
      <p>{status}</p>
      {error && <p style={{ color: 'red' }}>Error: {error}</p>}
    </div>
  );
};

export default AuthCallbackPage;