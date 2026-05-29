# Azure Cost Estimator

A React application for estimating Azure Virtual Machine costs using modern React hooks.

## Overview

This application estimates the monthly and annual costs of running Azure Virtual Machines based on configuration parameters including VM size, region, operating system, usage hours, storage, and bandwidth. Pricing data is fetched in real time from the [Azure Retail Prices API](https://prices.azure.com/api/retail/prices).

## Features

- Real-time cost estimates powered by the Azure Retail Prices API
- Configuration form for VM size, region, OS, hours, storage, and bandwidth
- Itemized cost breakdown by component (compute, storage, bandwidth)
- Configuration persists across page refreshes via sessionStorage
- Loading and error states for all async operations
- Auto-focus on first form field on page load

## Technology Stack

- **Framework**: React 18
- **Build Tool**: Vite
- **Styling**: CSS3
- **State Management**: React Hooks (`useState`, `useEffect`, `useReducer`, `useMemo`, `useRef`, `useCallback`)
- **Custom Hook**: `useAzurePricing` — encapsulates all pricing logic
- **API**: Azure Retail Prices API (proxied via Vite dev server to avoid CORS)

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
npm run preview
```

> **Note:** The Vite proxy that forwards requests to `prices.azure.com` is only available in development. A production deployment would require a backend proxy (e.g. an Express server or Azure Function) to avoid CORS restrictions.

## Usage

### Configuration Options

- **VM Size**: B-series, D-series, and E-series Azure VM sizes
- **Region**: 14 Azure regions across US, Europe, and Asia
- **Operating System**: Linux or Windows
- **Hours per Month**: Monthly usage hours (0–744)
- **Storage (GB)**: Attached managed disk size
- **Bandwidth (GB)**: Outbound data transfer

### Understanding Results

- **Hourly Cost**: Retail price per hour from the Azure Pricing API
- **Monthly Cost**: Hourly rate × specified hours + storage + bandwidth
- **Annual Cost**: Monthly cost × 12
- **Cost Breakdown**: Itemized by compute, storage, and bandwidth

## File Structure

```
azure-cost-estimator/
├── src/
│   ├── components/
│   │   ├── ConfigForm.jsx      # Configuration form (useRef, useCallback)
│   │   └── Results.jsx         # Cost results display
│   ├── hooks/
│   │   └── useAzurePricing.js  # Custom hook — API fetch, useState, useEffect, useMemo
│   ├── App.jsx                 # Root component — useReducer, useCallback, useEffect
│   ├── main.jsx                # Entry point
│   ├── index.css               # Global styles
│   └── App.css                 # Component styles
├── vite.config.js              # Vite config — includes proxy for Azure Pricing API
└── package.json
```

## Limitations

- Prices reflect the Azure retail/pay-as-you-go rate and do not account for reserved instances, spot pricing, or enterprise discounts
- Storage and bandwidth costs use fixed estimates; actual Azure billing may vary
- The Vite dev proxy is not suitable for production deployments

## License

MIT