import React from 'react';
import Plot from 'react-plotly.js';
import { graphql, useStaticQuery } from 'gatsby';
import '../styles/dashboard.css'; // Assuming you have a CSS file for styling

// This is a helper function to get the start of the week (Monday) for any given date
const getStartOfWeek = (date) => {
  const d = new Date(date);
  const day = d.getDay(); // Sunday - 0, Monday - 1, ...
  const diff = d.getDate() - day + (day === 0 ? -6 : 1); // Adjust when day is Sunday
  return new Date(d.setDate(diff)).toISOString().split('T')[0]; // Return as 'YYYY-MM-DD'
};

const Dashboard = () => {
  // 1. Get the data from Gatsby's GraphQL layer (no change here)
  const data = useStaticQuery(graphql`
    query {
      allTransactionsJson {
        nodes {
          date
          description
          value
          category
        }
      }
    }
  `);

  const transactionsArray = data.allTransactionsJson.nodes;

  // --- 2. DATA PROCESSING ---
  // First, get all spending transactions
  const spendingData = transactionsArray
    .filter(tx => tx.value < 0)
    .map(tx => ({
      ...tx,
      spending: Math.abs(tx.value),
    }));

  // --- Data for Pie Chart and Bar Chart ---
  const categoryTotals = spendingData.reduce((acc, tx) => {
    // Ensure category exists before adding to it
    const category = tx.category || 'Miscellaneous';
    acc[category] = (acc[category] || 0) + tx.spending;
    return acc;
  }, {});
  
  // --- Data for Line Chart (Weekly Spending) ---
// --- Data for Line Chart (Weekly Spending) ---
const weeklySpending = spendingData.reduce((acc, tx) => {
    // Make sure we're creating a new Date object to avoid mutation issues
    const transactionDate = new Date(tx.date);
    const weekStart = getStartOfWeek(transactionDate);
    
    // Add the spending to the correct week
    acc[weekStart] = (acc[weekStart] || 0) + tx.spending;
    return acc;
}, {});
  // --- 3. CHART DEFINITIONS ---

  // A. Pie Chart Data
  const pieChartTrace = {
    labels: Object.keys(categoryTotals),
    values: Object.values(categoryTotals),
    type: 'pie',
    hovertemplate: '<b>%{label}</b><br>£%{value:,.2f}<br>%{percent}<extra></extra>',
    textinfo: 'percent',
    textposition: 'inside',
  };

  // B. Line Chart Data
  const sortedWeeks = Object.keys(weeklySpending).sort();
  const lineChartTrace = {
    x: sortedWeeks,
    y: sortedWeeks.map(week => weeklySpending[week]),
    type: 'scatter',
    mode: 'lines+markers',
    hovertemplate: '<b>Week of:</b> %{x}<br><b>Spending:</b> £%{y:,.2f}<extra></extra>',
  };

  // C. Bar Chart Data (Top 10 categories)
  const topExpenses = Object.entries(categoryTotals)
    .sort(([, a], [, b]) => b - a) // Sort descending by value
    .slice(0, 10);
    
  const barChartTrace = {
    x: topExpenses.map(([, value]) => value),
    y: topExpenses.map(([category]) => category),
    type: 'bar',
    orientation: 'h', // Horizontal bar chart
    hovertemplate: '<b>%{y}</b><br>Spending: £%{x:,.2f}<extra></extra>',
    text: topExpenses.map(([, value]) => `£${value.toFixed(0)}`), // Format text
    textposition: 'inside', 
  };

  // --- 4. RENDER THE DASHBOARD ---
  return (
    <div className="dashboard-container">
      <div className="dashboard-title">
        <h1>My Financial Dashboard</h1>
      </div>
      
      <div className="dashboard-grid">
        <div className="chart-card large">
          <h2>Weekly Spending</h2>
          <Plot
            data={[lineChartTrace]}
            layout={{ yaxis: { tickprefix: '£', tickformat: ',.0f' } }}
            config={{ responsive: true }}
            className="plotly-chart"
          />
        </div>
        <div className="chart-card">
          <h2>Category Breakdown</h2>
          <Plot
            data={[pieChartTrace]}
            layout={{ showlegend: true}}
            config={{ responsive: true }}
            className="plotly-chart"
          />
        </div>
        <div className="chart-card">
          <h2>Top Spending Categories</h2>
          <Plot
            data={[barChartTrace]}
            layout={{ 
              yaxis: { autorange: 'reversed' }, // Show largest at the top
              xaxis: { tickprefix: '£', tickformat: ',.0f' }
            }}
            config={{ responsive: true }}
            className="plotly-chart"
          />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;