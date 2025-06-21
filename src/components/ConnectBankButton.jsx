import React, { useEffect, useState } from 'react';

const ConnectBankButton = () => {
  const [authUrl, setAuthUrl] = useState('#');

  useEffect(() => {
    // This code now runs only on the client-side, where window is available.
    const buildAuthUrl = () => {
      const clientId = process.env.GATSBY_TRUELAYER_CLIENT_ID;
      
      // SUPERIOR METHOD: Use the browser's current location.
      // This works perfectly for localhost, production, and Vercel preview deployments.
      const rootUrl = window.location.origin;
      const redirectUri = `${rootUrl}/api/truelayer-callback`;

      if (!clientId) {
        console.error("GATSBY_TRUELAYER_CLIENT_ID is not configured.");
        return "#";
      }
      
      const url = new URL('https://auth.truelayer-sandbox.com/');
      url.searchParams.append('response_type', 'code');
      url.searchParams.append('client_id', clientId);
      url.searchParams.append('scope', 'accounts transactions:read balance:read offline_access');
      url.searchParams.append('redirect_uri', redirectUri);
      url.searchParams.append('providers', 'uk-ob-sandbox-natwest'); // Using sandbox provider
      
      return url.toString();
    };

    setAuthUrl(buildAuthUrl());
  }, []); // Empty dependency array ensures this runs once after component mounts.

  return (
    <a href={authUrl} className="connect-button">
      Connect to Bank via TrueLayer
    </a>
  );
};

export default ConnectBankButton;