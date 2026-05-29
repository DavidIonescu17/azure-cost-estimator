import React from 'react';
import useAzurePricing from '../hooks/useAzurePricing';

const Results = ({ config }) => {
  const {
    vmSize,
    region,
    os,
    hours,
    storageGb,
    bandwidthGb
  } = config;

  const {
    hourly,
    monthly,
    annual,
    breakdown,
    loading,
    error
  } = useAzurePricing({
    vmSize,
    region,
    os,
    hours,
    storageGb,
    bandwidthGb
  });

  if (loading) {
    return (
      <div className="loading">
        <p>Calculating costs...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error">
        <p>Error: {error}</p>
      </div>
    );
  }

  if (!hourly && !monthly && !annual) {
    return (
      <div className="loading">
        <p>Please configure your settings to see cost estimates</p>
      </div>
    );
  }

  return (
    <section className="results-section">
      <h2>Estimated Costs</h2>
      <div className="metrics-grid">
        <div className="metric-card">
          <h3>Hourly</h3>
          <div className="value">${hourly?.toFixed(4) ?? 0}</div>
          <div className="unit">per hour</div>
        </div>
        
        <div className="metric-card">
          <h3>Monthly</h3>
          <div className="value">${monthly?.toFixed(2) ?? 0}</div>
          <div className="unit">per month</div>
        </div>
        
        <div className="metric-card">
          <h3>Annual</h3>
          <div className="value">${annual?.toFixed(2) ?? 0}</div>
          <div className="unit">per year</div>
        </div>
      </div>
      
      <div className="breakdown-section">
        <h3>Cost Breakdown</h3>
        <table className="breakdown-table">
          <thead>
            <tr>
              <th>Component</th>
              <th>Monthly Cost</th>
            </tr>
          </thead>
          <tbody>
            {breakdown && breakdown.map((item, index) => (
              <tr key={index}>
                <td>{item.component}</td>
                <td>${item.cost.toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
};

export default Results;
