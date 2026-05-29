import React, { useState, useEffect } from 'react';
import ConfigForm from './components/ConfigForm';
import Results from './components/Results';
import './App.css';

function App() {
  const [config, setConfig] = useState({
    vmSize: 'Standard_D2s_v3',
    region: 'East US',
    os: 'Linux',
    hours: 730,
    storageGb: 0,
    bandwidthGb: 0
  });

  // Load saved config from sessionStorage on initial render
  useEffect(() => {
    const savedConfig = sessionStorage.getItem('azureConfig');
    if (savedConfig) {
      setConfig(JSON.parse(savedConfig));
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
        <ConfigForm config={config} setConfig={setConfig} />
        <Results config={config} />
      </main>
    </div>
  );
}

export default App;
