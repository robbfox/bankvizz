import React, { useState, useEffect } from "react";
import Layout from "../components/layout";
import Seo from "../components/seo";
import WelcomeScreen from "../components/WelcomeScreen";
import LiveDashboard from "../components/LiveDashboard";

const IndexPage = ({ location }) => {
  const [accessToken, setAccessToken] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const handleLogout = () => {
    localStorage.removeItem('bankvizz_access_token');
    setAccessToken(null);
  };

  // This useEffect will run whenever the URL query string changes
  useEffect(() => {
    // First, check for a token from a previous session
    const savedToken = localStorage.getItem('bankvizz_access_token');
    if (savedToken) {
      setAccessToken(savedToken);
      setIsLoading(false);
      return;
    }

    // If no saved token, check the URL for a new one from the redirect
    const searchParams = new URLSearchParams(location.search);
    const tokenFromUrl = searchParams.get('token');
    
    if (tokenFromUrl) {
      setAccessToken(tokenFromUrl);
      localStorage.setItem('bankvizz_access_token', tokenFromUrl);
      // Clean the token from the URL bar for a better user experience
      window.history.replaceState({}, document.title, window.location.pathname);
    }
    
    setIsLoading(false);
  }, [location.search]);

  // --- Render Logic ---

  if (isLoading) {
    return (
      <Layout>
        <Seo title="Home" /><p>Loading...</p>
      </Layout>
    );
  }

  return (
    <Layout>
      <Seo title="Home" />
      
      {/* === THIS IS THE CLEANED-UP CONDITIONAL BLOCK === */}
      {!accessToken ? (
        // If the user is logged OUT, show the welcome screen.
        <WelcomeScreen />
      ) : (
        // If the user is logged IN, show the dashboard and logout button.
        <>
          <button 
            onClick={handleLogout} 
            style={{ float: 'right', padding: '0.5rem 1rem', cursor: 'pointer', zIndex: 10, position: 'relative' }}
          >
            Disconnect Bank
          </button>
          <LiveDashboard 
            accessToken={accessToken} 
            onTokenExpired={handleLogout} 
          />
        </>
      )}
    </Layout>
  );
};

export default IndexPage;