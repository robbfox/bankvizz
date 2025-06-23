import React, { useState, useEffect } from 'react';
import { navigate } from 'gatsby';

const AuthCallbackPage = ({ location }) => {
  const [status, setStatus] = useState('Initializing...');
  const [error, setError] = useState(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const exchangeCode = async () => {
        setStatus('Exchanging code for token...');
        const searchParams = new URLSearchParams(location.search);
        const code = searchParams.get('code');

        if (!code) {
          setError('No authorization code found.');
          setTimeout(() => navigate('/'), 3000);
          return;
        }

        try {
          const response = await fetch(`/api/exchange?code=${code}`);

          // === NEW, MORE ROBUST ERROR HANDLING ===
          if (!response.ok) {
            const status = response.status;
            const statusText = response.statusText;
            const body = await response.text(); // Get the raw response body
            console.error("API call failed!", { status, statusText, body });
            // Display a more useful error to the user
            throw new Error(`Server responded with ${status}. Please check Vercel logs.`);
          }
          // =======================================

          const data = await response.json();
          localStorage.setItem('bankvizz_access_token', data.accessToken);
          setStatus('Success! Redirecting to your dashboard...');
          setTimeout(() => navigate('/'), 1000);

        } catch (err) {
          setError(err.message);
          // Don't auto-redirect on failure so we can see the error
        }
      };
      exchangeCode();
    }
  }, [location.search]);

  return (
    <div style={{ padding: '2rem', fontFamily: 'sans-serif' }}>
      <h1>Authenticating</h1>
      <p>{status}</p>
      {error && <p style={{ color: 'red' }}>Error: {error}</p>}
    </div>
  );
};

export default AuthCallbackPage;