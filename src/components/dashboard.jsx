import React, { useState, useEffect } from 'react';
import loadable from '@loadable/component';

// Dynamically import Plotly to prevent server-side rendering issues
const Plot = loadable(() => import('react-plotly.js'), {
  fallback: <div>Loading Chart...</div>
});

const getStartOfWeek = (date) => {
  const d = new Date(date);
  const day = d.getDay();
  const diff = d.getDate() - day + (day === 0 ? -6 : 1);
  return new Date(d.setDate(diff)).toISOString().split('T')[0];
};

const Dashboard = () => {
  // State to hold all our processed chart data
  const [chartData, setChartData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // This function will run once, on the client-side, after the page loads.
    const fetchData = async () => {
      try {
        // Fetch the data from the /static folder
        const response = await fetch('/transactions.json');
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const transactionsArray = await response.json();

        // --- All data processing now happens here, on the client ---
        const spendingData = transactionsArray
          .filter(tx => tx.value < 0)
          .map(tx => ({ ...tx, spending: Math.abs(tx.value) }));

        const categoryTotals = spendingData.reduce((acc, tx) => {
          const category = tx.category || 'Miscellaneous';
          acc[category] = (acc[category] || 0) + tx.spending;
          return acc;
        }, {});

        const weeklySpending = spendingData.reduce((acc, tx) => {
          const weekStart = getStartOfWeek(tx.date);
          acc[weekStart] = (acc[weekStart] || 0) + tx.spending;
          return acc;
        }, {});

        // Process data for charts
        const sortedWeeks = Object.keys(weeklySpending).sort();
        const topExpenses = Object.entries(categoryTotals).sort(([, a], [, b]) => b - a).slice(0, 10);

        // Set all chart data at once
        setChartData({
          pie: { labels: Object.keys(categoryTotals), values: Object.values(categoryTotals) },
          line: { x: sortedWeeks, y: sortedWeeks.map(week => weeklySpending[week]) },
          bar: { x: topExpenses.map(([, val]) => val), y: topExpenses.map(([cat]) => cat) }
        });

      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []); // The empty array ensures this runs only once on mount

  if (isLoading) {
    return <div>Loading dashboard data...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  // --- RENDER THE DASHBOARD ---
  return (
    <div className="dashboard-container">
      <div className="dashboard-title"><h1>My Financial Dashboard</h1></div>
      <div className="dashboard-grid">
        <div className="chart-card large">
          <h2>Weekly Spending</h2>
          <Plot data={[{ ...chartData.line, type: 'scatter', mode: 'lines+markers' }]} layout={{ yaxis: { tickprefix: '£' } }} className="plotly-chart" config={{ responsive: true }} />
        </div>
        <div className="chart-card">
          <h2>Category Breakdown</h2>
          <Plot data={[{ ...chartData.pie, type: 'pie' }]} layout={{ showlegend: true }} className="plotly-chart" config={{ responsive: true }} />
        </div>
        <div className="chart-card">
          <h2>Top Spending Categories</h2>
          <Plot data={[{ ...chartData.bar, type: 'bar', orientation: 'h' }]} layout={{ yaxis: { autorange: 'reversed' }, xaxis: { tickprefix: '£' } }} className="plotly-chart" config={{ responsive: true }} />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;