// src/api/get-transactions.js

import axios from 'axios';

export default async function handler(req, res) {
  console.log(`\n--- Initiating /api/get-transactions with method: ${req.method} ---`);

  // A GET request is for fetching data. This is the correct method.
  // We add this check to be explicit and prevent other methods from being used.
  if (req.method !== 'GET') {
    return res.status(405).json({ error: `Method ${req.method} Not Allowed` });
  }
  
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    console.error("Error: Authorization header is missing or malformed.");
    return res.status(401).json({ error: 'Unauthorized: No token provided.' });
  }

  const accessToken = authHeader.split(' ')[1];
  const accountsUrl = 'https://api.truelayer.com/data/v1/accounts';

  try {
    console.log("Step 1: Fetching accounts...");
    const accountsResponse = await axios.get(accountsUrl, {
      headers: { 'Authorization': `Bearer ${accessToken}` },
    });

    if (accountsResponse.data.results.length === 0) {
      console.warn("Warning: No accounts found for this user.");
      return res.status(404).json({ error: 'No accounts found for this token.' });
    }
    
    const accountId = accountsResponse.data.results[0].account_id;
    console.log(`Step 2: Found account ID: ${accountId}. Fetching transactions...`);
    
    const transactionsUrl = `https://api.truelayer.com/data/v1/accounts/${accountId}/transactions`;
    const transactionsResponse = await axios.get(transactionsUrl, {
      headers: { 'Authorization': `Bearer ${accessToken}` },
    });
    
    console.log("Step 3: Successfully fetched transactions. Sending to client.");
    return res.status(200).json(transactionsResponse.data.results);

  } catch (error) {
    console.error("--- API Error in get-transactions ---");
    const status = error.response?.status || 500;
    const message = error.response?.data || 'An internal server error occurred.';
    console.error(`Status: ${status}, Details:`, message);
    
    // Send the detailed error back to the frontend
    return res.status(status).json({ 
        error: 'Failed to fetch data from TrueLayer.', 
        details: message 
    });
  }
}