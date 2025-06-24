import React from 'react';

const ConnectBankButton = () => {
  // Get the base URL (without the redirect_uri) from our new .env variable
  const baseAuthUrl = process.env.GATSBY_TRUELAYER_AUTH_BASE_URL;

  if (!baseAuthUrl) {
    console.error("GATSBY_TRUELAYER_AUTH_BASE_URL is not configured.");
    return <button disabled>Connection Unavailable</button>;
  }

  const handleClick = () => {
    // Dynamically get the current site's origin (e.g., http://localhost:8000)
    // On Vercel, this will be https://bankvizz-my-branch.vercel.app
    const redirectUri = `${window.location.origin}/auth-callback`;

    // Build the final, correct authorization link
    const authLink = `${baseAuthUrl}&redirect_uri=${encodeURIComponent(redirectUri)}`;
    
    // Send the user to TrueLayer
    window.location.href = authLink;
  };

  return (
    <button onClick={handleClick} className="connect-button">
      Connect to NatWest via TrueLayer
    </button>
  );
};

export default ConnectBankButton;