import {post} from "../util/util";

/**
 * Buy stock shares
 * @param {string} symbol - Stock symbol (e.g., "AAPL")
 * @param {number} shares - Number of shares to buy
 * @returns {Promise} - Response with updated user data
 */
export const buyStock = async (symbol, shares) => {
    return await post('/buy', {
        symbol: symbol,
        shares: shares
    });
};

/**
 * Sell stock shares
 * @param {string} symbol - Stock symbol (e.g., "AAPL")
 * @param {number} shares - Number of shares to sell
 * @returns {Promise} - Response with updated user data
 */
export const sellStock = async (symbol, shares) => {
    return await post('/sell', {
        symbol: symbol,
        shares: shares
    });
};
