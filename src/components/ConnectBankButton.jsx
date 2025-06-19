import React from 'react';

const ConnectBankButton = () => {
  // We will build the authorization URL here
  const buildAuthUrl = () => {
    const authUrl = new URL('https://auth.truelayer.com/');

    // These parameters tell TrueLayer what we want
    authUrl.searchParams.append('response_type', 'code');
    authUrl.searchParams.append('client_id', 'YOUR_CLIENT_ID_HERE'); // You can hardcode this for now
    authUrl.searchParams.append('scope', 'accounts transactions:read balance:read offline_access');
    authUrl.searchParams.append('redirect_uri', 'http://localhost:8000/api/truelayer_callback');
    authUrl.searchParams.append('providers', 'uk-natwest'); // Pre-select the bank to make it easier

    return authUrl.toString();
  };

  return (
    <a href={buildAuthUrl()} className="connect-button">
      Connect to NatWest via TrueLayer
    </a>
  );
};

export default ConnectBankButton;