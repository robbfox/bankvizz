// /api/exchange.js -- CANARY TEST

export default async function handler(req, res) {
  // This is the very first thing the function will do.
  console.log("--- CANARY TEST: /api/exchange function was successfully invoked! ---");
  
  // We will immediately return a custom error so we can see it on the frontend.
  // This proves the function ran and was able to send a response.
  res.status(500).json({ 
    error: 'CANARY_SUCCESS', 
    message: 'The canary function ran. The problem is in the original exchange.js code.' 
  });
}