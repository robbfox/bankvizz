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
    sessionStorage.removeItem('bankvizz_token');
    setAccessToken(null);
  };

  if (isLoading) {
    // You can keep a simple loading state or make it fancier
    return <div style={{ textAlign: 'center', padding: '5rem' }}>Loading...</div>;
  }

  // This is the key change: apply the Layout conditionally.
  // The <main> wrapper is also removed as <Layout> provides its own.
  if (accessToken) {
    // If the user is logged in, show the Dashboard WITH the Layout
    return (
      <Layout>
        <LiveDashboard 
          accessToken={accessToken} 
          onTokenExpired={handleLogout} 
        />
      </Layout>
    );
  } else {
    // If the user is not logged in, show the Welcome Screen WITHOUT the Layout
    return <WelcomeScreen />;
  }
};

export default IndexPage;