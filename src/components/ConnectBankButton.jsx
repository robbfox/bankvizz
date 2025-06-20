import React from 'react';

const ConnectBankButton = () => {
  const buildAuthUrl = () => {
    // Gatsby exposes environment variables prefixed with GATSBY_ to the client-side.
    // This will be populated from your .env.development file or Vercel environment variables.
    const clientId = process.env.GATSBY_TRUELAYER_CLIENT_ID;
    
    // Vercel automatically provides the deployment URL. We fall back to localhost for local dev.
    const rootUrl = `https://${process.env.GATSBY_VERCEL_URL}` || 'http://localhost:8000';
    const redirectUri = `${rootUrl}/api/truelayer-callback`;

    // Ensure the Client ID is configured before building the URL.
    if (!clientId) {
      console.error("GATSBY_TRUELAYER_CLIENT_ID is not configured. The 'Connect Bank' button will not work.");
      // Return a non-functional link to prevent errors, or you could disable the button.
      return "#"; 
    }

    const authUrl = new URL('https://auth.truelayer-sandbox.com/');
    authUrl.searchParams.append('response_type', 'code');
    // CORRECTED: Used camelCase `searchParams` instead of `search_params`.
    authUrl.searchParams.append('client_id', clientId);
    authUrl.searchParams.append('scope', 'accounts transactions:read balance:read offline_access');
    authUrl.searchParams.append('redirect_uri', redirectUri);
    // Note: The 'providers' parameter can be customized to allow users to select their bank.
    authUrl.searchParams.append('providers', 'uk-natwest');

    return authUrl.toString();
  };
  
  const authLink = buildAuthUrl();

  return (
    <a 
      href={authLink} 
      className="connect-button" 
      // Disable the button visually and functionally if the Client ID is missing.
      disabled={authLink === "#"}
      title={authLink === "#" ? "Client ID not configured. See console." : "Connect to your bank"}
    >
      Connect to NatWest via TrueLayer
    </a>
  );
};

export default ConnectBankButton;