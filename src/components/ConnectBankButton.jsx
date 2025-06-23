import React from 'react';

const ConnectBankButton = () => {
  const authLink = process.env.GATSBY_AUTH_URL;

  if (!authLink) {
    console.error("GATSBY_AUTH_URL is not configured.");
    return (
      <button className="connect-button" disabled title="Missing TrueLayer auth URL">
        Connect to NatWest via TrueLayer
      </button>
    );
  }

  const handleClick = () => {
    window.location.href = authLink;
  };

  return (
    <button 
      onClick={handleClick} 
      className="connect-button" 
      title="Connect to your bank"
    >
      Connect to NatWest via TrueLayer
    </button>
  );
};

export default ConnectBankButton;
