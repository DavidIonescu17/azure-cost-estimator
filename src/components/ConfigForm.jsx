import React, { useRef, useEffect } from 'react';

const ConfigForm = ({ config, onConfigChange }) => {
  const vmSizes = [
    'Standard_B1s',
    'Standard_B1ms',
    'Standard_B2s',
    'Standard_B2ms',
    'Standard_D2s_v3',
    'Standard_D4s_v3',
    'Standard_D8s_v3',
    'Standard_E2s_v3',
    'Standard_E4s_v3',
    'Standard_E8s_v3'
  ];

  const regions = [
    'East US',
    'East US 2',
    'West US',
    'West US 2',
    'West US 3',
    'Central US',
    'North Central US',
    'South Central US',
    'North Europe',
    'West Europe',
    'Southeast Asia',
    'East Asia',
    'Japan East',
    'Japan West'
  ];

  const operatingSystems = ['Linux', 'Windows'];

  const handleChange = (e) => {
    const { name, value, type } = e.target;
    const newValue = type === 'number' ? Number(value) : value;
    onConfigChange(name, newValue);
  };

  const vmSizeRef = useRef(null);
  useEffect(() => { vmSizeRef.current?.focus(); }, []);

  return (
    <section className="form-section">
      <h2>Configuration</h2>
      <div className="form-grid">
        <div className="form-group">
          <label htmlFor="vmSize">VM Size</label>
          <select
            ref={vmSizeRef}
            id="vmSize"
            name="vmSize"
            value={config.vmSize}
            onChange={handleChange}
          >
            {vmSizes.map(size => (
              <option key={size} value={size}>{size}</option>
            ))}
          </select>
        </div>
        
        <div className="form-group">
          <label htmlFor="region">Region</label>
          <select
            id="region"
            name="region"
            value={config.region}
            onChange={handleChange}
          >
            {regions.map(region => (
              <option key={region} value={region}>{region}</option>
            ))}
          </select>
        </div>
        
        <div className="form-group">
          <label htmlFor="os">Operating System</label>
          <select
            id="os"
            name="os"
            value={config.os}
            onChange={handleChange}
          >
            {operatingSystems.map(os => (
              <option key={os} value={os}>{os}</option>
            ))}
          </select>
        </div>
        
        <div className="form-group">
          <label htmlFor="hours">Hours per Month</label>
          <input
            type="number"
            id="hours"
            name="hours"
            min="0"
            max="744"
            value={config.hours}
            onChange={handleChange}
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="storageGb">Storage (GB)</label>
          <input
            type="number"
            id="storageGb"
            name="storageGb"
            min="0"
            value={config.storageGb}
            onChange={handleChange}
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="bandwidthGb">Bandwidth (GB)</label>
          <input
            type="number"
            id="bandwidthGb"
            name="bandwidthGb"
            min="0"
            value={config.bandwidthGb}
            onChange={handleChange}
          />
        </div>
      </div>
    </section>
  );
};

export default ConfigForm;
