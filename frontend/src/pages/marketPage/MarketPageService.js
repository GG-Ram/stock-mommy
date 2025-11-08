import { get, post, put, del } from '../apiUtils';

export const getStockData = async (symbol) => {
    try {
        const data = await get(`/stocks/${symbol}`);
        console.log('Stock data:', data);
        return data;
    } catch (error) {
        console.error('Error fetching stock data:', error);
        throw error;
    }
};