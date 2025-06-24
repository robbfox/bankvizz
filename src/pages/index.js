import React, { useState, useEffect } from 'react';
import WelcomeScreen from '../components/WelcomeScreen';
import LiveDashboard from '../components/LiveDashboard';
import Layout from '../components/layout';

const IndexPage = () => {
  const [accessToken, setAccessToken] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const storedToken = sessionStorage.getItem('bankvizz_token');
    if (storedToken) {
      setAccessToken(storedToken);
    }
    setIsLoading(false);
  }, []);

  const handleLogout = () => {
    console.log("Logging out: removing token from state and storage.");
    sessionStorage.removeItem('bankvizz_token');
    setAccessToken(null);
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return accessToken ? (
    <Layout 
      isFullWidth={true} 
      isLoggedIn={true} 
      onLogout={handleLogout}
    >
      <LiveDashboard 
        accessToken={accessToken} 
        onTokenExpired={handleLogout} 
      />
    </Layout>
  ) : (
    <WelcomeScreen />
  );
};

export default IndexPage;
