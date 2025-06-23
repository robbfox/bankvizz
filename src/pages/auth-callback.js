import React, { useEffect } from 'react';
import { navigate } from 'gatsby';

const AuthCallbackPage = ({ location }) => {
  useEffect(() => {
    // Look for '?token=' in the URL from the server redirect
    const searchParams = new URLSearchParams(location.search);
    const token = searchParams.get('token');

    if (token) {
      // If a token is found, save it to the one place our app looks
      localStorage.setItem('bankvizz_access_token', token);
    }
    
    // Immediately navigate to the homepage.
    navigate('/');

  }, [location.search]);

  return <p>Please wait, completing authentication...</p>;
};

export default AuthCallbackPage;