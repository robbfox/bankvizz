import React, { useEffect, useState } from 'react';
import { navigate } from 'gatsby';

// A simple component to show a loading/status message
const AuthCallbackPage = ({ location }) => {
  const [statusMessage, setStatusMessage] = useState('Completing secure connection, please wait...');
  const [error, setError] = useState(null);

  useEffect(() => {
    // This function will run once the component mounts
    const exchangeCode = async (code) => {
      try {
        const response = await fetch('/api/exchange', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ code }),
        });

        if (!response.ok) {
          const errData = await response.json();
          throw new Error(errData.error || 'Failed to connect to your bank.');
        }

        const { accessToken } = await response.json();

        // IMPORTANT: Store the token securely. sessionStorage is good for this.
        sessionStorage.setItem('bankvizz_token', accessToken);

        // Redirect the user to the homepage, which will now find the token
        // and show the dashboard.
        navigate('/');

      } catch (err) {
        console.error("Authentication error:", err);
        setStatusMessage('Authentication Failed');
        setError(err.message);
      }
    };

    // location.search will contain the query string, e.g., "?code=..."
    const params = new URLSearchParams(location.search);
    const code = params.get('code');

    if (code) {
      exchangeCode(code);
    } else {
      setStatusMessage('Authentication Error');
      setError('Could not find authorization code from bank.');
    }
  }, [location.search]);

  // Render a user-friendly status screen
  return (
    <div style={{ padding: '4rem', textAlign: 'center' }}>
      <h1>{statusMessage}</h1>
      {error && <p style={{ color: 'red', marginTop: '1rem' }}>Details: {error}</p>}
      {error && <button onClick={() => navigate('/')}>Return to Homepage</button>}
    </div>
  );
};

export default AuthCallbackPage;