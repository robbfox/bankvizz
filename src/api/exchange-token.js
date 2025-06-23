import axios from 'axios';

export default async function handler(req, res) {
  // This function only accepts POST requests from our front-end
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const { code } = req.body;

  if (!code) {
    return res.status(400).json({ error: 'Authorization code not provided.' });
  }

  const tokenUrl = 'https://auth.truelayer.com/connect/token';
  const clientId = process.env.TRUELAYER_CLIENT_ID;
  const clientSecret = process.env.TRUELAYER_CLIENT_SECRET;
  
  // The redirect_uri here MUST MATCH what's in your main auth URL
  const redirectUri = process.env.GATSBY_VERCEL_URL 
    ? `https://${process.env.GATSBY_VERCEL_URL}/auth-callback` 
    : 'http://localhost:8000/auth-callback';

  const params = new URLSearchParams();
  params.append('grant_type', 'authorization_code');
  params.append('client_id', clientId);
  params.append('client_secret', clientSecret);
  params.append('redirect_uri', redirectUri);
  params.append('code', code);

  try {
    const response = await axios.post(tokenUrl, params, {
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    });
    
    // Send the access token back to the front-end page
    res.status(200).json({ accessToken: response.data.access_token });

  } catch (error) {
    console.error('Failed to exchange token:', error.response ? error.response.data : error.message);
    res.status(500).json({ error: 'Token exchange failed.' });
  }
}