// src/api/exchange.js

import axios from 'axios';

export default async function handler(req, res) {
  // This function MUST receive a POST request.
  // This check ensures it does, otherwise it returns a 405.
  if (req.method !== 'POST') {
    return res.status(405).json({ error: `Method ${req.method} Not Allowed` });
  }

  const { code } = req.body;
  if (!code) {
    return res.status(400).json({ error: 'Authorization code not provided.' });
  }
  
  const clientId = process.env.TRUELAYER_CLIENT_ID;
  const clientSecret = process.env.TRUELAYER_CLIENT_SECRET;

  if (!clientId || !clientSecret) {
    console.error("CRITICAL: Missing TrueLayer environment variables on Vercel.");
    return res.status(500).json({ error: 'Server configuration error.' });
  }

  const deploymentUrl = process.env.URL || 'http://localhost:8000';
  const redirectUri = `${deploymentUrl}/auth-callback`;

  const params = new URLSearchParams();
  params.append('grant_type', 'authorization_code');
  params.append('client_id', clientId);
  params.append('client_secret', clientSecret);
  params.append('redirect_uri', redirectUri);
  params.append('code', code);
  
  try {
    const tokenUrl = 'https://auth.truelayer.com/connect/token';
    const response = await axios.post(tokenUrl, params);
    
    return res.status(200).json({ accessToken: response.data.access_token });

  } catch (error) {
    console.error("TrueLayer API Error:", error.response?.data || error.message);
    return res.status(500).json({ 
      error: 'Token exchange failed.', 
      details: error.response?.data || 'An unknown error occurred.'
    });
  }
}