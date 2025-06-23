import axios from 'axios';

export default async function handler(req, res) {
  // This is the bulletproof guard clause to prevent build-time crashes.
  // It checks if it's a real request before doing anything.
  if (!req || !req.query || !res) {
    return; 
  }

  const { code } = req.query;

  if (!code) {
    return res.status(400).send('Authorization code is missing.');
  }

  const tokenUrl = 'https://auth.truelayer.com/connect/token';
  const clientId = process.env.GATSBY_TRUELAYER_CLIENT_ID;
  const clientSecret = process.env.TRUELAYER_CLIENT_SECRET;
  
  const redirectUri = req.headers.host.includes('localhost')
    ? 'http://localhost:8000/api/truelayer-callback'
    : 'https://bankvizz.vercel.app/api/truelayer-callback';

  const params = new URLSearchParams();
  params.append('grant_type', 'authorization_code');
  params.append('client_id', clientId);
  params.append('client_secret', clientSecret);
  params.append('redirect_uri', redirectUri);
  params.append('code', code);

  try {
    const response = await axios.post(tokenUrl, params);
    const accessToken = response.data.access_token;
    
    // Redirect to the homepage with the token in the query string.
    res.writeHead(302, { Location: `/?token=${accessToken}` });
    res.end();

  } catch (error) {
    const errorMsg = error.response ? JSON.stringify(error.response.data) : error.message;
    console.error('Final token exchange failed:', errorMsg);
    res.writeHead(302, { Location: `/?status=error&message=${encodeURIComponent(errorMsg)}` });
    res.end();
  }
}