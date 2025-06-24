// src/pages/auth-callback.js

import React, { useEffect, useState } from 'react';
import { navigate } from 'gatsby';

const AuthCallbackPage = ({ location }) => {
  // MOVED a and b TO THE TOP LEVEL of the component
  const [status, setStatus] = useState('Completing secure connection, please wait...');
  const [error, setError] = useState(null);

  useEffect(() => {
    const exchangeCodeForToken = async (code) => {
      try {
        const response = await fetch('/api/exchange', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ code }),
        });

        if (!response.ok) {
          let errorMessage = `API Error: Status ${response.status}`;
          try {
            const errData = await response.json();
            errorMessage = errData.details?.error || errData.error || 'Token exchange failed.';
          } catch (e) {
            errorMessage = `The server returned a non-JSON error. Check function logs.`;
          }
          throw new Error(errorMessage);
        }

        const { accessToken } = await response.json();
        sessionStorage.setItem('bankvizz_token', accessToken);
        navigate('/');

      } catch (err) {
        // NOW c and d CAN BE ACCESSED HERE
        setStatus('Authentication Failed');
        setError(err.message);
      }
    };

    const code = new URLSearchParams(location.search).get('code');
    if (code) {
      exchangeCodeForToken(code);
    } else {
      setStatus('Authentication Error');
      setError('Authorization code not found in URL.');
    }
  }, [location.search]);

  return (
    <div style={{ padding: '4rem', textAlign: 'center' }}>
      <h1>{status}</h1>
      {error && <p style={{ color: 'red' }}>Error: {error}</p>}
    </div>
  );
};

export default AuthCallbackPage;