import axios from 'axios';

export default async function handler(req, res) {
      if (!req.query) {
    return res.status(200).send('Build-time invocation, skipping.');
  }
  // ... (all the logic to get the code and prepare params is the same)
  const { code } = req.query;
  const tokenUrl = 'https://auth.truelayer.com/connect/token';
  const clientId = process.env.TRUELAYER_CLIENT_ID;
  const clientSecret = process.env.TRUELAYER_CLIENT_SECRET;
  const rootUrl = process.env.GATSBY_VERCEL_URL ? `https://${process.env.GATSBY_VERCEL_URL}` : 'http://localhost:8000';
  const redirectUriForApi = `${rootUrl}/api/truelayer-callback`;

  const params = new URLSearchParams();
  params.append('grant_type', 'authorization_code');
  params.append('client_id', clientId);
  params.append('client_secret', clientSecret);
  params.append('redirect_uri', redirectUriForApi);
  params.append('code', code);
  
  try {
    const response = await axios.post(tokenUrl, params, { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } });
    const accessToken = response.data.access_token;

    // =================================================================
    // === THE CRITICAL FIX ===
    // Redirect to our dedicated front-end page with the token.
    // DO NOT redirect to the homepage ('/').
    // =================================================================
    const frontendCallbackUrl = `/auth-callback/?token=${accessToken}`;
    
    res.writeHead(302, { Location: frontendCallbackUrl });
    res.end();

  } catch (error) {
    // ... (error handling is the same)
  }
}