import React, { useState, useEffect } from 'react';
import loadable from '@loadable/component';

const Plot = loadable(() => import('react-plotly.js'));

// 1. Categorization Logic (Translated to JavaScript)
const CATEGORY_KEYWORDS = {
  'SAINSBURYS': 'Groceries',
  'LIDL': 'Groceries',
  'WAITROSE': 'Groceries',
  'MARKS&SPENCER': 'Groceries/Lunch',
  'TFL': 'Transport',
  'BRITISH GAS': 'Utilities',
  'THAMES WATER': 'Utilities',
  'COMMUNITYFIBRE': 'Utilities',
  'COUNCIL TAX': 'Bills',
  'ROBERT': 'Rent/Transfer',
  'SPARTA GLOBAL': 'Income',
  'H3G': 'Phone Bill',
  'GOOGLE CLOUD': 'Subscriptions',
  'PAYPAL': 'Subscriptions',
  'AMAZON': 'Shopping', // Simplified for broader match
  'ALIEXPRESS': 'Shopping',
  'PRIMARK': 'Shopping',
  'TK MAXX': 'Shopping',
  'MATALAN': 'Shopping',
  'SCREWFIX': 'Shopping',
  'DEICHMANN': 'Shopping',
  'KWIK FIT': 'Car Maintenance',
  'DVLA': 'Car Maintenance',
  'INSURANCE': 'Car Maintenance',
  'TV LICENCE': 'Bills',
};

const categorizeTransaction = (description) => {
  const upperDesc = String(description).toUpperCase();
  for (const keyword in CATEGORY_KEYWORDS) {
    if (upperDesc.includes(keyword)) {
      return CATEGORY_KEYWORDS[keyword];
    }
  }
  return 'Miscellaneous';
};

// Helper function to get the Monday of a given week (equivalent to 'W-MON')
const getStartOfWeek = (date) => {
  const d = new Date(date);
  const day = d.getDay();
  const diff = d.getDate() - day + (day === 0 ? -6 : 1); 
  return new Date(d.setDate(diff)).toISOString().split('T')[0];
};

const LiveDashboard = ({ accessToken }) => {
  const [chartData, setChartData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!accessToken) {
      setError("Access Token is missing.");
      setIsLoading(false);
      return;
    }

    const fetchData = async () => {
      try {
        const response = await fetch('/api/get-transactions', {
          headers: { 'Authorization': `Bearer ${accessToken}` }
        });

        if (!response.ok) {
          const errData = await response.json();
          throw new Error(errData.details?.error_description || 'Failed to fetch transactions');
        }
        
        const rawTxs = await response.json();

        // 2. Data Processing (JavaScript equivalent of your Pandas script)
        const processedTxs = rawTxs.map(tx => ({
          date: new Date(tx.timestamp),
          value: parseFloat(tx.amount),
          description: tx.description,
          category: categorizeTransaction(tx.description)
        }));

        const spendingTxs = processedTxs
          .filter(tx => tx.value < 0 && tx.category !== 'Rent/Transfer')
          .map(tx => ({ ...tx, spending: Math.abs(tx.value) }));
        
        // Aggregation: Weekly Spending (like .resample())
        const weeklySpending = spendingTxs.reduce((acc, tx) => {
          const weekStart = getStartOfWeek(tx.date);
          acc[weekStart] = (acc[weekStart] || 0) + tx.spending;
          return acc;
        }, {});
        const sortedWeeks = Object.keys(weeklySpending).sort();

        // Aggregation: Category Totals (like .groupby())
        const categoryTotals = spendingTxs.reduce((acc, tx) => {
          acc[tx.category] = (acc[tx.category] || 0) + tx.spending;
          return acc;
        }, {});

        const sortedCategoryTotals = Object.entries(categoryTotals).sort(([,a],[,b]) => b-a);
        
        // Pie Chart data with "Other" category
        const topCategories = sortedCategoryTotals.slice(0, 6);
        const otherValue = sortedCategoryTotals.slice(6).reduce((sum, current) => sum + current[1], 0);
        if (otherValue > 0) {
          topCategories.push(['Other', otherValue]);
        }
        
        const pieLabels = topCategories.map(([cat]) => cat);
        const pieValues = topCategories.map(([, val]) => val);
        
        // Bar Chart data
        const top10Expenses = sortedCategoryTotals.slice(0, 10);

        setChartData({
          line: { x: sortedWeeks, y: sortedWeeks.map(week => weeklySpending[week]) },
          pie: { labels: pieLabels, values: pieValues },
          bar: { x: top10Expenses.map(([, val]) => val), y: top10Expenses.map(([cat]) => cat) }
        });

      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [accessToken]);

  if (isLoading) return <div><p>Loading live financial data...</p><p>This may take a moment.</p></div>;
  if (error) return <div><p>Error loading live data:</p><p style={{color: 'red'}}>{error}</p></div>;
  if (!chartData) return <div>No chart data available.</div>;

  // 3. Chart Rendering (Using react-plotly.js)
  return (
    <div className="dashboard-container">
      <div className="dashboard-title"><h1>My Live Financial Dashboard</h1></div>
      <Plot
        data={[
          {
            ...chartData.line,
            type: 'scatter',
            mode: 'lines+markers',
            name: 'Weekly Spending',
            xaxis: 'x',
            yaxis: 'y'
          },
          {
            ...chartData.pie,
            type: 'pie',
            name: 'Categories',
            domain: { row: 1, column: 0 },
          },
          {
            ...chartData.bar,
            type: 'bar',
            orientation: 'h',
            name: 'Top Categories',
            xaxis: 'x2',
            yaxis: 'y2'
          }
        ]}
        layout={{
          title: 'Live Spending Analysis',
          grid: { rows: 2, columns: 2, pattern: 'independent' },
          height: 800,
          template: 'plotly_white',
          showlegend: false,
          yaxis: { title: 'Weekly Spending', tickprefix: '£' },
          yaxis2: { autorange: 'reversed' },
          xaxis2: { title: 'Total Spending', tickprefix: '£' }
        }}
        config={{ responsive: true }}
        className="full-width-chart"
      />
    </div>
  );
};

export default LiveDashboard;