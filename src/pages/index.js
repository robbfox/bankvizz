import React, { useState, useEffect } from 'react';

// Import the two screens we can show the user
import WelcomeScreen from '../components/WelcomeScreen';
import LiveDashboard from '../components/LiveDashboard';

// This is the main "controller" for your app's homepage.
const IndexPage = () => {
  // 1. We need a state to hold the access token. It starts as null.
  const [accessToken, setAccessToken] = useState(null);
  const [isLoading, setIsLoading] = useState(true); // Add a loading state

  // 2. This runs ONCE when the page loads, to check for an existing session.
  useEffect(() => {
    // Look in the browser's session storage for our token.
    const storedToken = sessionStorage.getItem('bankvizz_token');
    
    if (storedToken) {
      console.log("Found token in session storage. Preparing to show dashboard.");
      setAccessToken(storedToken); // If we find it, put it in our state.
    } else {
      console.log("No token found. Showing welcome screen.");
    }
    
    // We are done checking, so we can stop showing the loading message.
    setIsLoading(false);
  }, []); // The empty `[]` means this effect runs only on the initial render.

  // 3. This function will handle logging out or if the token expires.
  const handleLogout = () => {
    console.log("Logging out: removing token from state and storage.");
    sessionStorage.removeItem('bankvizz_token');
    setAccessToken(null); // Clear the token from our state.
  };

  // While we are checking for the token, show a brief loading message.
  if (isLoading) {
    return <div>Loading...</div>;
  }

  // 4. This is the core logic: Conditional Rendering.
  return (
    <main>
      {/* If the `accessToken` state has a value, render the Dashboard. */}
      {/* Otherwise, render the Welcome Screen. */}
      {accessToken ? (
        <LiveDashboard 
          accessToken={accessToken} 
          onTokenExpired={handleLogout} 
        />
      ) : (
        <WelcomeScreen />
      )}
    </main>
  );
};

export default IndexPage;