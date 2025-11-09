import { useState, useEffect } from 'react';
import { get } from '../util/util';

/**
 * Custom hook for fetching stock data with real-time updates
 */
export const useStockData = (refreshInterval = 1000) => {
    const [stocks, setStocks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [lastUpdated, setLastUpdated] = useState(null);
    const [isRefreshing, setIsRefreshing] = useState(false);

    useEffect(() => {
        fetchStockData();
        const interval = setInterval(fetchStockData, refreshInterval);
        return () => clearInterval(interval);
    }, [refreshInterval]);

    const fetchStockData = async () => {
        try {
            setIsRefreshing(true);
            const data = await get('/stocks');
            setStocks(data);
            setError(null);
            setLastUpdated(new Date());
        } catch (err) {
            console.error('Error fetching stock data:', err);
            setError('Failed to load stock data');
        } finally {
            setLoading(false);
            setIsRefreshing(false);
        }
    };

    return {
        stocks,
        loading,
        error,
        lastUpdated,
        isRefreshing,
        fetchStockData
    };
};