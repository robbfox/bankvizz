import axios from 'axios';

// This function runs on a SECURE SERVER. It has access to secrets.
export default async function handler(req, res) {
  const { code } = req.body;
  
  // These are retrieved securely from Vercel's environment variables
  const clientId = process.env.TRUELAYER_CLIENT_ID;
  const clientSecret = process.env.TRUELAYER_CLIENT_SECRET;
  
  // ... (build params and make axios call to TrueLayer with the secret)
  await axios.post(tokenUrl, params);
  
  // ... (send only the safe access_token back to the browser)
}