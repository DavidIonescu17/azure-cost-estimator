import React, { useState, useEffect, useReducer, useCallback } from 'react';
import ConfigForm from './components/ConfigForm';
import Results from './components/Results';
import './App.css';

const initialConfig = {
    vmSize: 'Standard_D2s_v3',
    region: 'West Europe',
    os: 'Linux',
    hours: 730,
    storageGb: 0,
    bandwidthGb: 0
  };

function configReducer(state, action) {
  return { ...state, [action.field]: action.value };
}
  
function App() {
  const [config, dispatch] = useReducer(configReducer, initialConfig);

  const handleConfigChange = useCallback((field, value) => {
    dispatch({ field, value });
  }, []);

  // Load config from sessionStorage on mount 
  useEffect(() => {
  const savedConfig = sessionStorage.getItem('azureConfig');
  if (savedConfig) {
    const parsed = JSON.parse(savedConfig);
    Object.entries(parsed).forEach(([field, value]) => {
      dispatch({ field, value });
    });
  }
}, []);

  // Save config to sessionStorage whenever it changes
  useEffect(() => {
    sessionStorage.setItem('azureConfig', JSON.stringify(config));
  }, [config]);

  return (
    <div className="App">
      <header className="app-header">
        <h1>Azure Cost Estimator</h1>
      </header>
      <main className="app-main">
        <ConfigForm config={config} onConfigChange={handleConfigChange} />
        <Results config={config} />
      </main>
    </div>
  );
}

export default App;
