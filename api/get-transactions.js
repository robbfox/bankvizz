import axios from 'axios';

export default async function handler(req, res) {
  // We expect the token to be sent in the Authorization header.
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Unauthorized: No token provided.' });
  }

  const accessToken = authHeader.split(' ')[1];
  
  // Use the correct Live API endpoint
  const accountsUrl = 'https://api.truelayer.com/data/v1/accounts';

  try {
    // 1. First, get the list of accounts to find the account ID
    const accountsResponse = await axios.get(accountsUrl, {
      headers: { 'Authorization': `Bearer ${accessToken}` },
    });

    if (accountsResponse.data.results.length === 0) {
      return res.status(404).json({ error: 'No accounts found for this token.' });
    }
    
    // Use the first account found
    const accountId = accountsResponse.data.results[0].account_id;
    
    // 2. Now, fetch transactions for that account ID
    const transactionsUrl = `https://api.truelayer.com/data/v1/accounts/${accountId}/transactions`;
    const transactionsResponse = await axios.get(transactionsUrl, {
      headers: { 'Authorization': `Bearer ${accessToken}` },
    });
    
    // 3. Send the transactions back to the front-end
    res.status(200).json(transactionsResponse.data.results);

  } catch (error) {
    console.error('API Error:', error.response ? error.response.data : error.message);
    const status = error.response ? error.response.status : 500;
    const message = error.response ? error.response.data : 'Internal Server Error';
    res.status(status).json({ error: 'Failed to fetch data from TrueLayer.', details: message });
  }
}