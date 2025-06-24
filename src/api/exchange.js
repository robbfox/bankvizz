import axios from 'axios';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const { code } = req.body;
  if (!code) {
    return res.status(400).json({ error: 'Authorization code not provided.' });
  }
  
  const clientId = process.env.TRUELAYER_CLIENT_ID;
  const clientSecret = process.env.TRUELAYER_CLIENT_SECRET;

  if (!clientId || !clientSecret) {
    console.error("CRITICAL ERROR: Server environment variables are missing.");
    return res.status(500).json({ error: 'Server configuration error.' });
  }

  // Vercel's `URL` variable gives us the canonical URL for the deployment.
  const deploymentUrl = process.env.URL || 'http://localhost:8000';
  const redirectUri = `${deploymentUrl}/auth-callback`;

  console.log("Exchanging token using redirect_uri:", redirectUri);

  const params = new URLSearchParams();
  params.append('grant_type', 'authorization_code');
  params.append('client_id', clientId);
  params.append('client_secret', clientSecret);
  params.append('redirect_uri', redirectUri);
  params.append('code', code);
  
  try {
    const tokenUrl = 'https://auth.truelayer.com/connect/token';
    const response = await axios.post(tokenUrl, params);
    
    res.status(200).json({ accessToken: response.data.access_token });

  } catch (error) {
    console.error("Token exchange FAILED. TrueLayer Error:", error.response ? error.response.data : error.message);
    res.status(500).json({ 
      error: 'Token exchange failed.', 
      details: error.response ? error.response.data : 'No response from server.'
    });
  }
}
