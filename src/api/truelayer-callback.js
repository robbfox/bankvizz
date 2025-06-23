import axios from 'axios';

export default async function handler(req, res) {
  // ... (all the code to get the token is the same)
  console.log("API function using Client ID:", process.env.TRUELAYER_CLIENT_ID);
  const { code } = req.query;

  if (!code) {
    return res.status(400).send('Error: No authorization code received.');
  }

  const isProduction = !!process.env.VERCEL_URL;
  const rootUrl = isProduction ? `https://${process.env.VERCEL_URL}` : 'http://localhost:8000';
  const redirectUriForApi = `${rootUrl}/api/truelayer-callback`;
  const tokenUrl = 'https://auth.truelayer.com/connect/token';
  const clientId = process.env.TRUELAYER_CLIENT_ID;
  const clientSecret = process.env.TRUELAYER_CLIENT_SECRET;

  const params = new URLSearchParams();
  params.append('grant_type', 'authorization_code');
  params.append('client_id', clientId);
  params.append('client_secret', clientSecret);
  params.append('redirect_uri', redirectUriForApi);
  params.append('code', code);

  try {
    const response = await axios.post(tokenUrl, params, {
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    });
    
    const accessToken = response.data.access_token;

    // =================================================================
    // === THE FIX IS HERE ===
    // We are now redirecting to the homepage with a standard query parameter `?token=...`
    // This is much more stable than using a URL hash.
    // =================================================================
    const frontendUrl = `/?token=${accessToken}`;
    
    res.writeHead(302, { Location: frontendUrl });
    res.end();

  } catch (error) {
    // ... (error handling is the same)
    console.error('Failed to exchange token:', error.response ? error.response.data : error.message);
    const errorMessage = error.response ? JSON.stringify(error.response.data) : error.message;
    res.writeHead(302, { Location: `/?status=error&message=${encodeURIComponent(errorMessage)}` });
    res.end();
  }
}