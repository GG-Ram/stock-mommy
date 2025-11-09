import React, { useEffect, useState } from "react";
import axios from "axios";
import { useUser } from "../../Hooks/userContext";
import "./Portfolio.css";

const Portfolio = () => {
  const { user } = useUser();
  const [stockPrices, setStockPrices] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStockPrices = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/stocks");
        const prices = {};
        res.data.forEach((stock) => {
          prices[stock.symbol] = stock.price;
        });
        setStockPrices(prices);
        setLoading(false);
      } catch (err) {
        console.error("[DEBUG] Error fetching stock prices:", err.message);
      }
    };

    fetchStockPrices();
    const interval = setInterval(fetchStockPrices, 5000);
    return () => clearInterval(interval);
  }, []);

  const calculateTotalValue = () => {
    return (
      user?.positions?.reduce((total, position) => {
        const price =
          stockPrices[position.stock_data.symbol] ||
          position.stock_data.price;
        return total + position.shares * price;
      }, 0) || 0
    );
  };

  if (loading)
    return <div className="loading">Loading portfolio data...</div>;

  return (
    <div className="portfolio-container">
      <div className="portfolio-header">
        <h1>Your Portfolio</h1>
        <div className="balance-section">
          <div className="balance-card">
            <span className="label">Cash Balance</span>
            <span className="amount">${user?.balance?.toFixed(2)}</span>
          </div>
          <div className="balance-card">
            <span className="label">Total Portfolio Value</span>
            <span className="amount">${calculateTotalValue().toFixed(2)}</span>
          </div>
          <div className="balance-card total">
            <span className="label">Total Net Worth</span>
            <span className="amount">
              ${(calculateTotalValue() + (user?.balance || 0)).toFixed(2)}
            </span>
          </div>
        </div>
      </div>

      <div className="holdings-section">
        <h2>Stock Holdings</h2>
        {user?.positions?.length > 0 ? (
          <div className="holdings-grid">
            {user.positions.map((position, i) => {
              const price =
                stockPrices[position.stock_data.symbol] ||
                position.stock_data.price;
              const totalValue = position.shares * price;
              const profit = totalValue - position.totalCost;
              const profitPercent =
                position.totalCost > 0
                  ? (profit / position.totalCost) * 100
                  : 0;

              return (
                <div key={i} className="holding-card">
                  <div className="holding-header">
                    <h3 className="stock-symbol">
                      {position.stock_data.symbol}
                    </h3>
                    <span className="shares-badge">
                      {position.shares} shares
                    </span>
                  </div>
                  <div className="holding-details">
                    <div className="detail-row">
                      <span className="detail-label">Current Price:</span>
                      <span className="detail-value">
                        ${price.toFixed(2)}
                      </span>
                    </div>
                    <div className="detail-row">
                      <span className="detail-label">Total Value:</span>
                      <span className="detail-value total">
                        ${totalValue.toFixed(2)}
                      </span>
                    </div>
                    <div className="detail-row">
                      <span className="detail-label">Profit/Loss:</span>
                      <span
                        className={`detail-value ${
                          profit >= 0 ? "positive" : "negative"
                        }`}
                      >
                        ${profit.toFixed(2)} ({profitPercent.toFixed(2)}%)
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="empty-state">
            <p>📈 No stocks in your portfolio yet!</p>
            <p>Start trading to build your portfolio.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Portfolio;
