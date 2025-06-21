import React, { useEffect, useState } from 'react';

const ConnectBankButton = () => {
  const [authUrl, setAuthUrl] = useState('#');

  useEffect(() => {
    const buildAuthUrl = () => {
      const clientId = process.env.GATSBY_TRUELAYER_CLIENT_ID;
      const rootUrl = window.location.origin;
      const redirectUri = `${rootUrl}/api/truelayer-callback`;

      if (!clientId) {
        console.error("GATSBY_TRUELAYER_CLIENT_ID is not configured.");
        return "#";
      }
      
      const url = new URL('https://auth.truelayer-sandbox.com/');
      url.searchParams.append('response_type', 'code');
      url.searchParams.append('client_id', clientId);
      
      // === THE FIX IS HERE ===
      // Corrected scope string without the ":read" suffixes.
      url.searchParams.append('scope', 'accounts transactions balance offline_access');
      
      url.searchParams.append('redirect_uri', redirectUri);
      url.searchParams.append('providers', 'uk-ob-sandbox-natwest');
      
      return url.toString();
    };

    setAuthUrl(buildAuthUrl());
  }, []);

  return (
    <a href={authUrl} className="connect-button">
      Connect to Bank via TrueLayer
    </a>
  );
};

export default ConnectBankButton;