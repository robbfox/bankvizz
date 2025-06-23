import React, { useState, useEffect } from 'react';
import { navigate } from 'gatsby';

const AuthCallbackPage = ({ location }) => {
  const [status, setStatus] = useState('Initializing...');
  const [error, setError] = useState(null);

  useEffect(() => {
    // === THIS IS THE FIX ===
    // We wrap our logic in this check to ensure it ONLY runs in the browser.
    if (typeof window !== 'undefined') {
      setStatus('Exchanging code for token...');
      
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
            // Try to get a more specific error message from the API
            const errorData = await response.json();
            throw new Error(errorData.error || 'Could not exchange token.');
          }

          const data = await response.json();
          localStorage.setItem('bankvizz_access_token', data.accessToken);
          setStatus('Success! Redirecting to your dashboard...');
          
          setTimeout(() => navigate('/'), 1000);

        } catch (err) {
          setError(`Authentication failed: ${err.message}`);
          setTimeout(() => navigate('/'), 3000);
        }
      };

      exchangeCode();
    }
  }, [location.search]); // The dependency array is correct

  return (
    <div style={{ padding: '2rem', fontFamily: 'sans-serif' }}>
      <h1>Authenticating</h1>
      <p>{status}</p>
      {error && <p style={{ color: 'red' }}>Error: {error}</p>}
    </div>
  );
};

export default AuthCallbackPage;