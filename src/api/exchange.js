// src/api/exchange.js

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  // --- VERCEL ENVIRONMENT DEBUGGER ---
  console.log("\n--- VERCEL DEBUGGER for /api/exchange ---");

  // These are Vercel's system environment variables, available at runtime.
  // We log them to see exactly what Vercel is providing for this deployment.
  console.log("Vercel System Variable 'URL':", process.env.URL);
  console.log("Vercel System Variable 'VERCEL_URL':", process.env.VERCEL_URL);
  console.log("Vercel System Variable 'VERCEL_ENV':", process.env.VERCEL_ENV);

  // --- CONSTRUCT THE REDIRECT URI ---
  // We use `process.env.URL` because it's the canonical URL for THIS specific deployment.
  // This is the most reliable variable for both production and preview deploys.
  const deploymentUrl = process.env.URL || `http://localhost:8000`; // Fallback for local
  
  // Ensure the URL has the https protocol if it's missing
  const redirectUri = deploymentUrl.startsWith('http') 
    ? `${deploymentUrl}/auth-callback`
    : `https://${deploymentUrl}/auth-callback`;

  console.log("\n--- CONSTRUCTED URI ---");
  console.log("Final derived redirect_uri:", redirectUri);
  
  // --- END OF DEBUGGING ---

  // For this test, we stop here and return a debug response.
  // This allows us to check the logs without causing further errors.
  return res.status(418).json({
    message: "This is a debug response. Please check your Vercel function logs.",
    derivedRedirectUri: redirectUri,
    vercelEnv: process.env.VERCEL_ENV,
    deploymentUrlUsed: process.env.URL,
  });

  /*
    The rest of your original code remains commented out for this test.
  */
}