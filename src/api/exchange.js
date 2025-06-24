import axios from 'axios';

export default async function handler(req, res) {
  console.log("\n--- /api/exchange function initiated ---");

  if (req.method !== 'POST') {
    console.error("Error: Method was not POST.");
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const { code } = req.body;
  if (!code) {
    console.error("Error: 'code' not found in request body.");
    return res.status(400).json({ error: 'Authorization code not provided.' });
  }
  
  // --- LOGGING ALL VARIABLES ---
  console.log("Received authorization code.");
  const clientId = process.env.TRUELAYER_CLIENT_ID;
  const clientSecret = process.env.TRUELAYER_CLIENT_SECRET;
  const deploymentUrl = process.env.URL || 'http://localhost:8000';
  const redirectUri = `${deploymentUrl}/auth-callback`;

  console.log("Client ID loaded:", !!clientId); 
  console.log("Client Secret loaded:", !!clientSecret); 
  console.log("Constructed redirect_uri:", redirectUri);
  // --- END LOGGING ---

  if (!clientId || !clientSecret) {
    console.error("CRITICAL: Environment variables for TrueLayer are missing.");
    return res.status(500).json({ error: 'Server configuration error.' });
  }

  const params = new URLSearchParams();
  params.append('grant_type', 'authorization_code');
  params.append('client_id', clientId);
  params.append('client_secret', clientSecret);
  params.append('redirect_uri', redirectUri);
  params.append('code', code);
  
  try {
    console.log("Attempting to POST to TrueLayer's token URL...");
    
    // --- THIS IS THE FIX ---
    // The variable is defined here (camelCase 'U').
    const tokenUrl = 'https://auth.truelayer.com/connect/token';
    
    // The variable is used here (must match exactly).
    const response = await axios.post(tokenUrl, params); 
    // --- END OF FIX ---
    
    console.log("Successfully received access token from TrueLayer.");
    return res.status(200).json({ accessToken: response.data.access_token });

  } catch (error) {
    console.error("--- AXIOS REQUEST FAILED ---");
    console.error("TrueLayer API Error:", error.response?.data || error.message);
    return res.status(500).json({ 
      error: 'Token exchange failed.', 
      details: error.response?.data || 'An unknown error occurred.'
    });
  }
}