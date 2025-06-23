import axios from 'axios';

export default async function handler(req, res) {
  // ... (all the logic to get the code and prepare params is the same)
  const { code } = req.query;
  // ...
  const tokenUrl = 'https://auth.truelayer.com/connect/token';
  // ...
  
  try {
    const response = await axios.post(tokenUrl, params, { /* ... */ });
    const accessToken = response.data.access_token;

    // =================================================================
    // === THE CRITICAL FIX ===
    // Redirect to our dedicated front-end page with the token.
    // DO NOT redirect to the homepage ('/').
    // =================================================================
    const frontendCallbackUrl = `/auth-callback/?token=${accessToken}`;
    
    res.writeHead(302, { Location: frontendCallbackUrl });
    res.end();



  } catch (error) {
    // ... (error handling is the same)
    console.error('Failed to exchange token:', error.response ? error.response.data : error.message);
    const errorMessage = error.response ? JSON.stringify(error.response.data) : error.message;
    res.writeHead(302, { Location: `/?status=error&message=${encodeURIComponent(errorMessage)}` });
    res.end();
  }
}