import { useState, useEffect, useMemo } from 'react';

const useAzurePricing = ({ vmSize, region, os, hours, storageGb, bandwidthGb }) => {
  const [priceData, setPriceData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch pricing data from Azure Pricing API
  useEffect(() => {
    const fetchPricingData = async () => {
      // Validate inputs
      if (!vmSize || !region || !os) {
        setError('Please complete all required fields');
        return;
      }

      setLoading(true);
      setError(null);

      try {
        // For demonstration purposes, we'll use mock data since the actual Azure API
        // might have CORS restrictions or require authentication in some contexts
        // In a production app, you would use a backend proxy to avoid CORS issues
        
        // Mock prices based on typical Azure pricing (these are example values)
        const vmPriceMap = {
          'Standard_B1s': 0.0104,
          'Standard_B1ms': 0.0208,
          'Standard_B2s': 0.0416,
          'Standard_B2ms': 0.0832,
          'Standard_D2s_v3': 0.096,
          'Standard_D4s_v3': 0.192,
          'Standard_D8s_v3': 0.384,
          'Standard_E2s_v3': 0.083,
          'Standard_E4s_v3': 0.167,
          'Standard_E8s_v3': 0.334
        };

        const storagePricePerGb = 0.018; // Standard SSD disk pricing
        const bandwidthPricePerGb = 0.087; // Outbound data transfer pricing

        // Get VM price based on size
        const vmPrice = vmPriceMap[vmSize] || 0.1; // Default fallback
        
        // Adjust for OS (Windows typically costs more)
        const osMultiplier = os === 'Windows' ? 1.3 : 1.0;
        const adjustedVmPrice = vmPrice * osMultiplier;

        // Calculate costs
        const vmCost = adjustedVmPrice * hours;
        const storageCost = storagePricePerGb * storageGb;
        const bandwidthCost = bandwidthPricePerGb * bandwidthGb;
        
        const totalMonthly = vmCost + storageCost + bandwidthCost;
        const hourlyRate = totalMonthly / hours;
        const annualCost = totalMonthly * 12;

        // Build breakdown
        const breakdown = [
          { 
            component: 'Virtual Machine', 
            cost: vmCost 
          },
          { 
            component: `Storage (${storageGb} GB)`, 
            cost: storageCost 
          },
          { 
            component: `Bandwidth (${bandwidthGb} GB)`, 
            cost: bandwidthCost 
          }
        ];

        setPriceData({
          hourly: hourlyRate,
          monthly: totalMonthly,
          annual: annualCost,
          breakdown
        });
      } catch (err) {
        setError(err.message || 'Failed to calculate pricing');
        setPriceData(null);
      } finally {
        setLoading(false);
      }
    };

    fetchPricingData();
  }, [vmSize, region, os, hours, storageGb, bandwidthGb]);

  // Memoize the result to prevent unnecessary recalculations
  const result = useMemo(() => {
    if (!priceData) {
      return {
        hourly: null,
        monthly: null,
        annual: null,
        breakdown: [],
        loading,
        error
      };
    }

    return {
      hourly: priceData.hourly,
      monthly: priceData.monthly,
      annual: priceData.annual,
      breakdown: priceData.breakdown,
      loading,
      error
    };
  }, [priceData, loading, error]);

  return result;
};

export default useAzurePricing;
