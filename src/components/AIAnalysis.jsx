import React, { useState } from 'react';


const AIAnalysis = ({ transactionData }) => {
  const [analysis, setAnalysis] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleGetAnalysis = async () => {
    setIsLoading(true);
    setError(null);
    setAnalysis('');

    try {
      const response = await fetch('/api/get-ai-analysis', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ transactions: transactionData }),
      });

      if (!response.ok) {
        throw new Error('The AI analysis failed. Please try again.');
      }

      const data = await response.json();
      setAnalysis(data.analysis);

    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="ai-analysis-container">
      <h2>AI Spending Analysis</h2>
      <button onClick={handleGetAnalysis} disabled={isLoading}>
        {isLoading ? 'Generating...' : 'Get AI Spending Advice'}
      </button>


      {error && <p style={{ color: 'red' }}>{error}</p>}
      
      {analysis && (
        <div className="ai-response">
          {/* We'll need a Markdown renderer for a nice display, but for now, this works */}
          <pre style={{ whiteSpace: 'pre-wrap', fontFamily: 'inherit', fontSize: '1rem' }}>
            {analysis}
          </pre>
        </div>
      )}
    </div>
  );
};

export default AIAnalysis;