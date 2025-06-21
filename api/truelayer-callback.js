import axios from 'axios';

export default async function handler(req, res) {
  const { code } = req.query;

  if (!code) {
    return res.status(400).send('Error: No authorization code received.');
  }

  const tokenUrl = 'https://auth.truelayer-sandbox.com/connect/token';
  const clientId = process.env.TRUELAYER_CLIENT_ID;
  const clientSecret = process.env.TRUELAYER_CLIENT_SECRET;
  const rootUrl = process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'http://localhost:8000';
  const redirectUri = `${rootUrl}/api/truelayer-callback`;

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
    
    // GRAB THE TOKEN from the response data
    const accessToken = response.data.access_token;
    console.log('Successfully retrieved access token.');

    // Redirect to a new page (or the same page with a token parameter)
    // We'll pass the token in a URL fragment (#) so it's not sent to servers.
    res.writeHead(302, { Location: `/?status=success#token=${accessToken}` });
    res.end();

  } catch (error) {
    console.error('Failed to exchange token:', error.response ? error.response.data : error.message);
    const errorMessage = error.response ? JSON.stringify(error.response.data) : error.message;
    res.writeHead(302, { Location: `/?status=error&message=${encodeURIComponent(errorMessage)}` });
    res.end();
  }
}