// We'll use the Google AI SDK for this
// Run `npm install @google/generative-ai` in your terminal first.
import { GoogleGenerativeAI } from "@google/generative-ai";

// Initialize the client with your API key from environment variables
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export default async function handler(req, res) {
  // We only accept POST requests for this endpoint
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    // Get the transaction data sent from the front-end
    const transactions = req.body.transactions;
    console.log("Received transactions:", transactions);

    if (!transactions || transactions.length === 0) {
      return res.status(400).json({ error: 'No transaction data provided.' });
    }

    // --- Create the Prompt for Gemini ---
    // We will format the transaction data into a clear prompt.
    const prompt = `
      You are a helpful personal finance assistant named Fluium.
      Analyze the following spending data and provide a brief, friendly summary (2-3 paragraphs) of the user's spending habits.
      Identify the top 3 spending categories, and point out any obvious outliers or unusual spending patterns.
      Then, offer one or two actionable, encouraging, and specific pieces of advice for potential savings.
      Format your response in Markdown.

      Here is the spending data:
      ${JSON.stringify(transactions, null, 2)}
    `;

    // --- Call the Gemini API ---
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash-lite-preview-06-17" });
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    console.log(text);


    // Send the AI's response back to the front-end
    res.status(200).json({ analysis: text });

  } catch (error) {
    console.error("Gemini API Error:", error);
    res.status(500).json({ error: 'Failed to get analysis from Gemini API.' });
  }
}