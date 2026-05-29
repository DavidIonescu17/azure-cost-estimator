import { useState, useEffect, useMemo } from 'react';

const useAzurePricing = ({ vmSize, region, os, hours, storageGb, bandwidthGb }) => {
  const [priceData, setPriceData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch pricing data from Azure Pricing API
  useEffect(() => {
    const fetchPricingData = async () => {
      if (!vmSize || !region || !os) {
        setError('Please complete all required fields');
        return;
      }

      setLoading(true);
      setError(null);

      try {
        // Map region display names to Azure ARM region names
        const regionMap = {
          'East US': 'eastus',
          'East US 2': 'eastus2',
          'West US': 'westus',
          'West US 2': 'westus2',
          'West US 3': 'westus3',
          'Central US': 'centralus',
          'North Central US': 'northcentralus',
          'South Central US': 'southcentralus',
          'North Europe': 'northeurope',
          'West Europe': 'westeurope',
          'Southeast Asia': 'southeastasia',
          'East Asia': 'eastasia',
          'Japan East': 'japaneast',
          'Japan West': 'japanwest',
        };

        const armRegion = regionMap[region] || 'eastus';
        const osFamily = os === 'Windows' ? 'Windows' : 'Linux';

        const filter = `armRegionName eq '${armRegion}' and armSkuName eq '${vmSize}' and priceType eq 'Consumption'`;
        const url = `/api/pricing?$filter=${encodeURIComponent(filter)}`;
        const response = await fetch(url);
        if (!response.ok) throw new Error('Failed to fetch pricing data');

        const data = await response.json();
        const item = data.Items?.[0];

        if (!item) throw new Error('No pricing data found for this configuration');

        const hourlyRate = item.retailPrice;
        const vmCost = hourlyRate * hours;
        const storageCost = storageGb * 0.018;
        const bandwidthCost = bandwidthGb * 0.087;
        const totalMonthly = vmCost + storageCost + bandwidthCost;

        setPriceData({
          hourly: totalMonthly / hours,
          monthly: totalMonthly,
          annual: totalMonthly * 12,
          breakdown: [
            { component: 'Virtual Machine', cost: vmCost },
            { component: `Storage (${storageGb} GB)`, cost: storageCost },
            { component: `Bandwidth (${bandwidthGb} GB)`, cost: bandwidthCost },
          ]
        });
      } catch (err) {
        setError(err.message || 'Failed to fetch pricing');
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
