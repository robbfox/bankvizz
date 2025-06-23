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

  // This robust useEffect handles the token logic perfectly.
  useEffect(() => {
    const savedToken = localStorage.getItem('bankvizz_access_token');
    if (savedToken) {
      setAccessToken(savedToken);
      setIsLoading(false);
      return;
    }

    const searchParams = new URLSearchParams(location.search);
    const tokenFromUrl = searchParams.get('token');
    
    if (tokenFromUrl) {
      setAccessToken(tokenFromUrl);
      localStorage.setItem('bankvizz_access_token', tokenFromUrl);
      window.history.replaceState({}, document.title, window.location.pathname);
    }
    
    setIsLoading(false);
  }, [location.search]);

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