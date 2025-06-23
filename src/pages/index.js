import React, { useState, useEffect } from "react";
import Layout from "../components/layout";
import Seo from "../components/seo";
import WelcomeScreen from "../components/WelcomeScreen";
import LiveDashboard from "../components/LiveDashboard";

const IndexPage = () => {
  const [accessToken, setAccessToken] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const handleLogout = () => {
    localStorage.removeItem('bankvizz_access_token');
    setAccessToken(null);
  };

  // The useEffect hook is now very simple.
  useEffect(() => {
    const savedToken = localStorage.getItem('bankvizz_access_token');
    if (savedToken) {
      setAccessToken(savedToken);
    }
    setIsLoading(false);
  }, []); // It only needs to run once when the page loads.

  if (isLoading) {
    return <Layout><Seo title="Home" /><p>Loading...</p></Layout>;
  }

  return (
    <Layout>
      <Seo title="Home" />
      {!accessToken ? (
        <WelcomeScreen />
      ) : (
        <>
          <button onClick={handleLogout} style={{ float: 'right', padding: '0.5rem 1rem', cursor: 'pointer', zIndex: 10, position: 'relative' }}>
            Disconnect Bank
          </button>
          <LiveDashboard accessToken={accessToken} onTokenExpired={handleLogout} />
        </>
      )}
    </Layout>
  );
};

export default IndexPage;