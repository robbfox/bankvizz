import axios from 'axios';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }


  // === FIX #2: Get the code from the query string, not the body ===
  const { code } = req.query;

  if (!code) {
    return res.status(400).json({ error: 'Authorization code not provided.' });
  }

  // The rest of the logic is exactly the same
  const tokenUrl = 'https://auth.truelayer.com/connect/token';
  const clientId = process.env.TRUELAYER_CLIENT_ID;
  const clientSecret = process.env.TRUELAYER_CLIENT_SECRET;
  const redirectUri = process.env.VERCEL_URL 
    ? `https://${process.env.VERCEL_URL}/auth-callback` 
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
    
    res.status(200).json({ accessToken: response.data.access_token });

  } catch (error) {
    console.error('Failed to exchange token:', error.response ? error.response.data : error.message);
    res.status(500).json({ error: 'Token exchange failed.' });
  }
}