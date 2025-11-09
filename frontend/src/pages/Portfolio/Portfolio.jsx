import React from 'react';
import { useUser } from '../../Hooks/userContext';
import './Portfolio.css';

const Portfolio = () => {
    const { user } = useUser();

    // Calculate total portfolio value
    const calculateTotalValue = () => {
        return user?.positions?.reduce((total, position) => {
            return total + (position.shares * position.stock_data.buyPrice);
        }, 0) || 0;
    };

    if (!user) {
        return (
            <div className="portfolio-container">
                <h1>Loading...</h1>
            </div>
        );
    }

    return (
        <div className="portfolio-container">
            <div className="portfolio-header">
                <h1>My Portfolio</h1>
                <div className="balance-section">
                    <div className="balance-card">
                        <span className="label">Available Balance</span>
                        <span className="amount">${user.balance?.toFixed(2) || '0.00'}</span>
                    </div>
                    <div className="balance-card">
                        <span className="label">Total Holdings</span>
                        <span className="amount">${calculateTotalValue().toFixed(2)}</span>
                    </div>
                </div>
            </div>

            <div className="holdings-section">
                <h2>Stock Holdings</h2>
                {user.positions && user.positions.length > 0 ? (
                    <div className="holdings-grid">
                        {user.positions.map((position, index) => (
                            <div key={index} className="holding-card">
                                <div className="holding-header">
                                    <h3 className="stock-symbol">{position.stock_data.symbol}</h3>
                                    <span className="shares-badge">{position.shares} shares</span>
                                </div>
                                <div className="holding-details">
                                    <div className="detail-row">
                                        <span className="detail-label">Company:</span>
                                        <span className="detail-value">{position.stock_data.name}</span>
                                    </div>
                                    <div className="detail-row">
                                        <span className="detail-label">Shares Owned:</span>
                                        <span className="detail-value">{position.shares}</span>
                                    </div>
                                    <div className="detail-row">
                                        <span className="detail-label">Buy Price:</span>
                                        <span className="detail-value">${position.stock_data.buyPrice.toFixed(2)}</span>
                                    </div>
                                    <div className="detail-row">
                                        <span className="detail-label">Total Value:</span>
                                        <span className="detail-value total">
                                            ${(position.shares * position.stock_data.buyPrice).toFixed(2)}
                                        </span>
                                    </div>
                                    
                                    
                                    
                                </div>
                            </div>
                        ))}
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