import React, { useState, useEffect } from "react";
import Layout from "../components/layout";
import Seo from "../components/seo";
import ConnectBankButton from "../components/ConnectBankButton";
import Dashboard from "../components/Dashboard"; // Your original static dashboard
import LiveDashboard from "../components/LiveDashboard"; // The new live dashboard

const IndexPage = () => {
  const [accessToken, setAccessToken] = useState(null);
  const [connectionStatus, setConnectionStatus] = useState(null);

  useEffect(() => {
    // This runs once on page load to check for a token
    
    // Check for a token saved in localStorage first
    const savedToken = localStorage.getItem('bankvizz_access_token');
    if (savedToken) {
      setAccessToken(savedToken);
      return; // Stop here if we found a saved token
    }

    // If no saved token, check the URL fragment from the redirect
    const hash = window.location.hash;
    const searchParams = new URLSearchParams(window.location.search);
    const status = searchParams.get('status');

    if (status) {
      setConnectionStatus(status);
      // Clean up the URL so the status message doesn't stay on refresh
      window.history.replaceState({}, document.title, window.location.pathname);
    }
    
    if (hash.includes('token=')) {
      const token = hash.split('token=')[1];
      setAccessToken(token);
      // Save the token to localStorage for future visits
      localStorage.setItem('bankvizz_access_token', token);
      // Clean the token from the URL bar for security
      window.location.hash = ''; 
    }
  }, []);

  return (
    <Layout>
      <Seo title="Home" />
      
      {connectionStatus === 'error' && (
        <div style={{ padding: '1rem', backgroundColor: '#ffdddd', border: '1px solid red' }}>
          Connection failed. Please try again.
        </div>
      )}
      
      {!accessToken ? (
        <>
          <ConnectBankButton />
          <Dashboard /> 
        </>
      ) : (
        <LiveDashboard accessToken={accessToken} />
      )}
      
    </Layout>
  );
};

export default IndexPage;