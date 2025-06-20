// /api/truelayer-callback.js
import axios from 'axios';


// This is the main handler for the Vercel Serverless Function
export default async function handler(req, res) {
  // 1. Get the one-time 'code' from the URL TrueLayer sent the user back with
  const { code } = req.query;

  if (!code) {
    return res.status(400).send('Error: No authorization code received.');
  }

  // 2. Prepare to exchange the 'code' for an 'access_token'
  const tokenUrl = 'https://auth.truelayer.com/connect/token';
  
  // Get your secrets from Vercel Environment Variables (no change here)
  const clientId = process.env.TRUELAYER_CLIENT_ID;
  const clientSecret = process.env.TRUELAYER_CLIENT_SECRET;
  
  // The redirect URI must still match what's in the TrueLayer console
  const rootUrl = process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'http://localhost:8000';
  const redirectUri = `${rootUrl}/api/truelayer-callback`;

  const params = new URLSearchParams();
  params.append('grant_type', 'authorization_code');
  params.append('client_id', clientId);
  params.append('client_secret', clientSecret);
  params.append('redirect_uri', redirectUri);
  params.append('code', code);

  // 3. Make the secure, back-end API call to TrueLayer using axios
  try {
    const response = await axios.post(tokenUrl, params, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    });

    const accessToken = response.data.access_token;

    // SUCCESS! You now have the token.
    // In a real app, you would securely store this in a database or cookie.
    // For now, we'll redirect the user back to the homepage with a success message.
    
    console.log('Successfully retrieved access token:', accessToken.substring(0, 8) + '...');
    res.writeHead(302, { Location: '/?status=success' });
    res.end();

  } catch (error) {
    console.error('Failed to exchange token:', error.response ? error.response.data : error.message);
    
    // Redirect back with an error
    const errorMessage = error.response ? JSON.stringify(error.response.data) : error.message;
    res.writeHead(302, { Location: `/?status=error&message=${encodeURIComponent(errorMessage)}` });
    res.end();
  }
}