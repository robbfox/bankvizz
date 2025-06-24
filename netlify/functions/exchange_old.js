import axios from 'axios';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const { code } = req.body;

  // --- NEW, MORE DETAILED LOGGING ---
  console.log("\n--- Executing /api/exchange ---");
  console.log("Received code:", code);
  
  const clientId = process.env.TRUELAYER_CLIENT_ID;
  const clientSecret = process.env.TRUELAYER_CLIENT_SECRET;
  
  // These logs will definitively tell us if the environment variables are loaded.
  console.log("--> Using Client ID:", clientId); 
  console.log("--> Is Client Secret loaded:", !!clientSecret); // We log `true` or `false` for the secret

  if (!clientId || !clientSecret) {
    console.error("--> CRITICAL ERROR: Environment variables are missing.");
    return res.status(500).json({ error: 'Server configuration error: Missing API credentials.' });
  }
  // --- END OF NEW LOGGING ---

  if (!code) {
    return res.status(400).json({ error: 'Authorization code not provided.' });
  }

  const tokenUrl = 'https://auth.truelayer.com/connect/token';
  const redirectUri = process.env.VERCEL_URL
    ? `https://${process.env.VERCEL_URL}/auth-callback`
    : 'http://localhost:8000/auth-callback';
  
  console.log("--> Exchanging token using redirect_uri:", redirectUri);

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
    console.log("--- /api/exchange finished successfully ---");

  } catch (error) {
    console.error("--- /api/exchange FAILED ---");
    console.error('--> Failed to exchange token:', error.response ? error.response.data : error.message);
    res.status(500).json({ error: 'Token exchange failed.' });
  }
}