# Azure Cost Estimator

A React application for estimating Azure Virtual Machine costs using modern React hooks.

## Overview

This application helps users estimate the monthly and annual costs of running Azure Virtual Machines based on various configuration parameters including VM size, region, operating system, usage hours, storage, and bandwidth.

## Features

- **Configuration Form**: Select VM size, region, OS, and specify usage parameters
- **Real-time Cost Calculation**: Instant cost estimates as you adjust parameters
- **Cost Breakdown**: Detailed breakdown of costs by component (VM, storage, bandwidth)
- **Responsive Design**: Works on desktop and mobile devices
- **State Persistence**: Configuration persists in browser session storage
- **Loading & Error States**: Proper handling of async operations

## Technology Stack

- **Framework**: React 18
- **Build Tool**: Vite
- **Styling**: CSS3
- **State Management**: React Hooks (useState, useEffect, useMemo)
- **Custom Hook**: `useAzurePricing` for cost calculation logic

## Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd azure-cost-estimator
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

4. Open your browser to `http://localhost:5173`

## Building for Production

```bash
npm run build
```

Preview the production build:
```bash
npm run serve
```

## Usage

### Configuration Options

1. **VM Size**: Select from various Azure VM sizes (B-series, D-series, E-series)
2. **Region**: Choose Azure deployment region
3. **Operating System**: Select Linux or Windows
4. **Hours per Month**: Specify monthly usage (0-744 hours)
5. **Storage (GB)**: Specify attached storage in GB
6. **Bandwidth (GB)**: Specify outbound data transfer in GB

### Understanding Results

- **Hourly Cost**: Estimated cost per hour of operation
- **Monthly Cost**: Estimated cost for a full month based on specified hours
- **Annual Cost**: Projected yearly cost (monthly × 12)
- **Cost Breakdown**: Itemized costs for:
  - Virtual Machine compute
  - Storage
  - Bandwidth/data transfer

## Implementation Details

### Custom Hook: `useAzurePricing`

The core logic is implemented in a custom React hook that:

1. Accepts configuration parameters
2. Manages loading and error states
3. Calculates costs using mock Azure pricing data
4. Uses `useMemo` to optimize performance and prevent unnecessary recalculations
5. Returns an object with all necessary data for the UI

### React Hooks Usage

- **useState**: Manages form state, loading states, and error states
- **useEffect**: 
  - Fetches/calculates pricing data when configuration changes
  - Persists configuration to sessionStorage
  - Loads saved configuration on initial render
- **useMemo**: Memoizes expensive calculations to prevent recomputation on every render

### Data Flow

1. User adjusts configuration in the form
2. Form state updates and persists to sessionStorage
3. `useEffect` in the hook triggers recalculation
4. Hook calculates costs and updates state
5. Results component receives new data via props and re-renders
6. Loading states shown during calculations
7. Error handling for invalid inputs or calculation failures

## File Structure

```
azure-cost-estimator/
├── public/
│   └── index.html          # Main HTML template
├── src/
│   ├── assets/             # Static assets (images, icons)
│   ├── components/         # React components
│   │   ├── ConfigForm.js   # Configuration form component
│   │   └── Results.js      # Results display component
│   ├── hooks/              # Custom React hooks
│   │   └── useAzurePricing.js # Main pricing calculation logic
│   ├── App.jsx             # Main application component
│   ├── main.jsx            # Application entry point
│   ├── index.css           # Global styles
│   └── App.css             # Component-specific styles
├── index.html              # Root HTML file (for build process)
├── package.json            # Project dependencies and scripts
└── vite.config.js          # Vite configuration
```

## Customization

### Modifying Pricing Data

To adjust the pricing model or use real Azure API data:

1. Edit `src/hooks/useAzurePricing.js`
2. Modify the mock pricing data in the `vmPriceMap` object
3. Adjust the storage and bandwidth pricing constants
4. For production use, replace the mock data with actual API calls to:
   ```
   https://prices.azure.com/api/retail/prices
   ```
   (Note: Would require a backend proxy to avoid CORS issues)

### Styling

Modify the CSS files to change the appearance:
- `src/index.css` - Global styles and base styling
- `src/App.css` - Component-specific styling

## Limitations

- Uses mock pricing data rather than live Azure API (due to CORS restrictions in browser)
- Pricing estimates are approximate and may not reflect actual Azure costs
- Does not account for reserved instances, spot pricing, or enterprise discounts
- Limited to the VM sizes and regions defined in the component

## Future Enhancements

1. Integrate with actual Azure Retail Prices API via a backend proxy
2. Add support for more Azure services (databases, app services, etc.)
3. Implement currency conversion options
4. Add export functionality (CSV, PDF)
5. Include cost optimization recommendations
6. Add user authentication for saving multiple configurations
7. Implement historical pricing data for trend analysis

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Ensure the application builds and runs correctly
5. Submit a pull request

## License

This project is open source and available under the MIT License.

## Acknowledgments

- Azure pricing information based on publicly available Azure pricing data
- Built with Vite and React for optimal developer experience
- Inspired by the need for simple cloud cost estimation tools