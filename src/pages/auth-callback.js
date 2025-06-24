import React, { useEffect, useState } from 'react';
import { navigate } from 'gatsby';

// This component runs in the user's BROWSER. It has NO secrets.
const AuthCallbackPage = ({ location }) => {
  const [status, setStatus] = useState('Completing secure connection...');

  useEffect(() => {
    const exchangeCode = async (code) => {
      // This is the secure bridge to your private backend
      const response = await fetch('/api/exchange', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code }),
      });
      // ... (handle response and navigate)
    };
    
    const code = new URLSearchParams(location.search).get('code');
    if (code) exchangeCode(code);
  }, [location.search]);

  return <h1>{status}</h1>;
};
export default AuthCallbackPage;