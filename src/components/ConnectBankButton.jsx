// src/components/ConnectBankButton.jsx
import React from 'react';

const ConnectBankButton = () => {
  const buildAuthUrl = () => {
    // Vercel automatically provides process.env.VERCEL_URL in the build environment.
    // We fall back to the localhost URL for local development.
    // The GATSBY_ prefix is required by Gatsby to expose the variable to the browser.
    const rootUrl = process.env.GATSBY_VERCEL_URL || 'http://localhost:8000';
    const redirectUri = `${rootUrl}/api/truelayer_callback`;

    const authUrl = new URL('https://auth.truelayer.com/');
    authUrl.searchParams.append('response_type', 'code');
    authUrl.searchParams.append('client_id', process.env.GATSBY_TRUELAYER_CLIENT_ID); // Use env var
    authUrl.searchParams.append('scope', 'accounts transactions:read balance:read offline_access');
    authUrl.searchParams.append('redirect_uri', redirectUri); // Use the dynamic URI
    authUrl.searchParams.append('providers', 'uk-natwest');

    return authUrl.toString();
  };

  return (
    <a href={buildAuthUrl()} className="connect-button">
      Connect to NatWest via TrueLayer
    </a>
  );
};

export default ConnectBankButton;