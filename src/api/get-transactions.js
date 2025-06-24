// src/api/exchange.js

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  // --- VERCEL ENVIRONMENT DEBUGGER ---
  console.log("\n--- VERCEL DEBUGGER for /api/exchange ---");

  // Log all relevant Vercel environment variables
  console.log("process.env.VERCEL_URL:", process.env.VERCEL_URL);
  console.log("process.env.VERCEL_BRANCH_URL:", process.env.VERCEL_BRANCH_URL);
  console.log("process.env.VERCEL_ENV:", process.env.VERCEL_ENV);
  console.log("process.env.URL:", process.env.URL); // Another Vercel alias for the deployment URL

  // --- CONSTRUCT THE REDIRECT URI ---
  // Let's use the most reliable variable: `VERCEL_URL` is for the main site URL.
  // `URL` is the canonical URL for THIS specific deployment (best for previews).
  const deploymentUrl = process.env.URL || `http://localhost:8000`;
  const redirectUri = deploymentUrl.startsWith('http') 
    ? `${deploymentUrl}/auth-callback`
    : `https://${deploymentUrl}/auth-callback`;

  console.log("\n--- CONSTRUCTED URI ---");
  console.log("Final derived redirect_uri:", redirectUri);
  
  // --- END OF DEBUGGING ---

  // For this test, we will not call TrueLayer. We will just return the
  // URI we constructed so you can see it in your browser's network tab.
  // This helps confirm the frontend is calling this function correctly.
  return res.status(418).json({
    message: "This is a debug response. Check your Vercel function logs.",
    derivedRedirectUri: redirectUri,
    vercelEnv: process.env.VERCEL_ENV,
    vercelUrl: process.env.URL,
  });

  // The rest of your original code is temporarily commented out below
  /*
    const { code } = req.body;
    const clientId = process.env.TRUELAYER_CLIENT_ID;
    const clientSecret = process.env.TRUELAYER_CLIENT_SECRET;

    if (!clientId || !clientSecret) {
      // ... error handling
    }

    const params = new URLSearchParams();
    params.append('grant_type', 'authorization_code');
    params.append('client_id', clientId);
    params.append('client_secret', clientSecret);
    params.append('redirect_uri', redirectUri);
    params.append('code', code);

    try {
      // ... axios call
    } catch (error) {
      // ... error handling
    }
  */
}