import React, { useState, useEffect } from 'react';
import loadable from '@loadable/component';
import AIAnalysis from './AIAnalysis';
import * as styles from './LiveDashboard.module.css';    

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

const LiveDashboard = ({ accessToken, onTokenExpired }) => {
  const [chartData, setChartData] = useState(null);
  const [processedTransactions, setProcessedTransactions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const width = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
  const isMobile = width < 768;

  useEffect(() => {
    if (!accessToken) return;

    const fetchData = async () => {
      try {
        const response = await fetch('/api/get-transactions', {
          headers: { 'Authorization': `Bearer ${accessToken}` }
        });

        // === CATCH THE EXPIRED TOKEN ERROR HERE ===
        if (response.status === 401) {
          console.log("Token is expired or invalid. Logging out.");
          onTokenExpired(); // Call the parent's logout function
          return; // Stop processing further
        }
        // =========================================

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
          
        setProcessedTransactions(spendingTxs);
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
  }, [accessToken, onTokenExpired]);

  if (isLoading) return <div><p>Loading live financial data...</p><p>This may take a moment.</p></div>;
  if (error) return <div><p>Error loading live data:</p><p style={{color: 'red'}}>{error}</p></div>;
  if (!chartData) return <div>No chart data available.</div>;

  // 3. Chart Rendering (Using react-plotly.js)
   return (
    <div className={styles.dashboardContainer}>
      <div className={styles.dashboardTitle}>
        <h1>My Live Financial Dashboard</h1>
      </div>

      <div className={styles.dashboardGrid}>
        
        {/* Card 1: Line Chart (spans all columns) */}
        <div className={`${styles.chartCard} ${styles.fullWidthCard}`}>
          <h2>Weekly Spending</h2>
          <Plot
            data={[{ ...chartData.line, type: 'scatter', mode: 'lines+markers' }]}
            layout={{ yaxis: { tickprefix: '£' }, margin: { l: 40, r: 20, t: 40, b: 40 } }}
            config={{ responsive: true }}
            style={{ width: '100%', height: '100%', minHeight: '350px' }}
          />
        </div>

        {/* Card 2: Pie Chart */}
        <div className={styles.chartCard}>
          <h2>Category Breakdown</h2>
          <Plot
            data={[{ ...chartData.pie, type: 'pie', textinfo: 'label+percent', insidetextorientation: 'radial' }]}
            layout={{ showlegend: false, margin: { l: 20, r: 20, t: 40, b: 20 } }}
            config={{ responsive: true }}
            style={{ width: '100%', height: '100%', minHeight: '350px' }}
          />
        </div>
        
        {/* Card 3: Bar Chart */}
        <div className={styles.chartCard}>
          <h2>Top Spending Categories</h2>
          <Plot
            data={[{ ...chartData.bar, type: 'bar', orientation: 'h' }]}
            layout={{ yaxis: { autorange: 'reversed' }, xaxis: { tickprefix: '£' }, margin: { l: 120, r: 20, t: 40, b: 40 } }}
            config={{ responsive: true }}
            style={{ width: '100%', height: '100%', minHeight: '350px' }}
          />
        </div>

        {/* Card 4: AI Analysis (now part of the grid) */}
        <div className={styles.chartCard}>
          {processedTransactions.length > 0 ? (
            <AIAnalysis transactionData={processedTransactions} />
          ) : (
            <p>No spending data available for AI analysis.</p>
          )}
        </div>
        
      </div>
    </div>
  );
};

export default LiveDashboard;