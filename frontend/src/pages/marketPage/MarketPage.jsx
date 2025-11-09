import React from 'react';
import './MarketPage.css';
import StockRow from '../../components/Stock/StockRow';
import { LoadingState, ErrorState } from '../../components/Stock/StockState';
import { useStockData } from '../../Hooks/useStockData';
import { useStockChart } from '../../Hooks/useStockChart';
import { useUser } from '../../Hooks/userContext';

/**
 * MarketPage - Clean stock trading dashboard with hover functionality
 */
function MarketPage() {
    const { stocks, loading, error, fetchStockData } = useStockData();
    const { chartRefs, handleMouseMove, handleMouseLeave } = useStockChart(stocks);
    const { user } = useUser();

    if (loading && stocks.length === 0) {
        return <LoadingState />;
    }

    if (error && stocks.length === 0) {
        return <ErrorState error={error} onRetry={fetchStockData} />;
    }

    return (
        <div className="container">
            <div className="header">
                <div className="header-content">
                    <div className="header-text">
                        <h1>Stock Trading Dashboard</h1>
                        <p>Real-time stock monitoring and trading</p>
                    </div>
                    <div className="user-balance">
                        <span className="balance-label">Available Balance</span>
                        <span className="balance-amount">${user?.balance?.toFixed(2) || '0.00'}</span>
                    </div>
                </div>
            </div>

            <div className="stock-container">
                {stocks.map((stock) => (
                    <StockRow
                        key={stock.symbol}
                        stock={stock}
                        chartRef={el => chartRefs.current[stock.symbol] = el}
                        onMouseMove={handleMouseMove}
                        onMouseLeave={handleMouseLeave}
                    />
                ))}
            </div>
        </div>
    );
}

export default MarketPage;