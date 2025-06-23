import React, { useState, useEffect } from "react";
import Layout from "../components/layout";
import Seo from "../components/seo";

import LiveDashboard from "../components/LiveDashboard";
import AIAnalysis from "../components/AIAnalysis";
import WelcomeScreen from "../components/WelcomeScreen";

// === CHANGE 1: Accept the `location` prop from Gatsby ===
const IndexPage = ({ location }) => {
  const [accessToken, setAccessToken] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const handleLogout = () => {
    console.log("Logging out: clearing token from state and localStorage.");
    localStorage.removeItem('bankvizz_access_token');
    setAccessToken(null);
  };

  // === CHANGE 2: Add `location.search` to the dependency array ===
  useEffect(() => {
    console.log("Homepage useEffect is running because the URL changed.");
    console.log("Current URL search string:", location.search);

    // First, check localStorage for a saved token from a previous session
    const savedToken = localStorage.getItem('bankvizz_access_token');
    if (savedToken) {
      console.log("Found token in localStorage.");
      setAccessToken(savedToken);
      setIsLoading(false);
      return; 
    }

    // If no saved token, check the URL's search parameters using the `location` prop
    const searchParams = new URLSearchParams(location.search);
    const tokenFromUrl = searchParams.get('token');
    
    if (tokenFromUrl) {
      console.log("Found token in URL. Saving to localStorage...");
      setAccessToken(tokenFromUrl);
      localStorage.setItem('bankvizz_access_token', tokenFromUrl);
      
      // Clean up the URL for a better user experience
      window.history.replaceState({}, document.title, window.location.pathname);
    }
    
    setIsLoading(false);
  }, [location.search]); // <-- This tells React to re-run the effect when the query string changes!

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
      {!accessToken ? (
        <>
         
          <WelcomeScreen />
        </>
      ) : (
        <>
          <h1>Welcome to Your Financial Dashboard</h1>
          <p>Your bank is connected. You can now view your live financial data.</p>
        </>
      )}
      {accessToken && (
        <>
        <LiveDashboard accessToken={accessToken}
        onTokenExpired={handleLogout} 
         />
        <button onClick={handleLogout} className="logout-button">
          Logout
        </button>
   

        </>
      )}
    </Layout>
  );
};

export default IndexPage;