import React, { useEffect, useState, useRef } from 'react';
import './MarketPage.css';
import { get, post } from '../../util/util';

function MarketPage() {
    const [stocks, setStocks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const chartRefs = useRef({});

    // Fetch stock data on component mount
    useEffect(() => {
        fetchStockData();
        // Optional: Set up polling to refresh data every 30 seconds
        const interval = setInterval(fetchStockData, 30000);
        return () => clearInterval(interval);
    }, []);

    // Draw charts when stock data changes
    useEffect(() => {
        if (stocks.length > 0) {
            stocks.forEach(stock => {
                drawChart(stock.symbol, stock.graph);
            });
        }
    }, [stocks]);

    // Fetch all stock data from backend
    const fetchStockData = async () => {
        try {
            setLoading(true);
            const data = await get('/stocks');
            // Expected response format:
            // [
            //   {
            //     symbol: 'AAPL',
            //     name: 'Apple Inc.',
            //     price: 175.43,
            //     change: 2.34,
            //     changePercent: 1.35,
            //     graph: [150, 155, 160, 165, 170, 175]
            //   },
            //   ...
            // ]
            setStocks(data);
            setError(null);
        } catch (err) {
            console.error('Error fetching stock data:', err);
            setError('Failed to load stock data');
        } finally {
            setLoading(false);
        }
    };

    // Draw chart on canvas
    const drawChart = (symbol, graphData) => {
        const canvas = chartRefs.current[symbol];
        if (!canvas || !graphData || graphData.length === 0) return;

        const ctx = canvas.getContext('2d');
        const width = canvas.width;
        const height = canvas.height;

        // Clear canvas
        ctx.clearRect(0, 0, width, height);

        // Calculate scaling
        const maxPrice = Math.max(...graphData);
        const minPrice = Math.min(...graphData);
        const priceRange = maxPrice - minPrice || 1;
        const xStep = width / (graphData.length - 1);

        // Draw line
        ctx.beginPath();
        ctx.strokeStyle = graphData[graphData.length - 1] > graphData[0] ? '#27ae60' : '#e74c3c';
        ctx.lineWidth = 2;

        graphData.forEach((price, index) => {
            const x = index * xStep;
            const y = height - ((price - minPrice) / priceRange) * height;
            
            if (index === 0) {
                ctx.moveTo(x, y);
            } else {
                ctx.lineTo(x, y);
            }
        });

        ctx.stroke();

        // Draw area under the line
        ctx.lineTo(width, height);
        ctx.lineTo(0, height);
        ctx.closePath();
        
        const gradient = ctx.createLinearGradient(0, 0, 0, height);
        gradient.addColorStop(0, graphData[graphData.length - 1] > graphData[0] 
            ? 'rgba(39, 174, 96, 0.2)' 
            : 'rgba(231, 76, 60, 0.2)');
        gradient.addColorStop(1, 'rgba(255, 255, 255, 0)');
        ctx.fillStyle = gradient;
        ctx.fill();
    };

    // Handle buy button click
    const handleBuy = async (stock) => {
        try {
            const quantity = prompt(`How many shares of ${stock.symbol} do you want to buy?`);
            if (!quantity || isNaN(quantity) || quantity <= 0) {
                alert('Invalid quantity');
                return;
            }

            const response = await post('/trades/buy', {
                symbol: stock.symbol,
                quantity: parseInt(quantity),
                price: stock.price
            });

            alert(`Successfully bought ${quantity} shares of ${stock.symbol}!`);
            fetchStockData(); // Refresh data
        } catch (err) {
            console.error('Error buying stock:', err);
            alert('Failed to buy stock. Please try again.');
        }
    };

    // Handle sell button click
    const handleSell = async (stock) => {
        try {
            const quantity = prompt(`How many shares of ${stock.symbol} do you want to sell?`);
            if (!quantity || isNaN(quantity) || quantity <= 0) {
                alert('Invalid quantity');
                return;
            }

            const response = await post('/trades/sell', {
                symbol: stock.symbol,
                quantity: parseInt(quantity),
                price: stock.price
            });

            alert(`Successfully sold ${quantity} shares of ${stock.symbol}!`);
            fetchStockData(); // Refresh data
        } catch (err) {
            console.error('Error selling stock:', err);
            alert('Failed to sell stock. Please try again.');
        }
    };

    // Loading state
    if (loading && stocks.length === 0) {
        return (
            <div className="container">
                <div className="header">
                    <h1>Stock Trading Dashboard</h1>
                    <p>Loading stock data...</p>
                </div>
            </div>
        );
    }

    // Error state
    if (error && stocks.length === 0) {
        return (
            <div className="container">
                <div className="header">
                    <h1>Stock Trading Dashboard</h1>
                    <p style={{ color: 'red' }}>{error}</p>
                    <button onClick={fetchStockData}>Retry</button>
                </div>
            </div>
        );
    }

    return (
        <div className="container">
            <div className="header">
                <h1>Stock Trading Dashboard</h1>
                <p>Real-time stock monitoring and trading</p>
            </div>

            <div className="stock-container">
                {stocks.map((stock) => (
                    <div key={stock.symbol} className="stock-row">
                        <div className="stock-info">
                            <div className="stock-header">
                                <h2 className="stock-symbol">{stock.symbol}</h2>
                                <span className="stock-name">{stock.name}</span>
                            </div>
                            <div className="stock-price">
                                <span className="price">${stock.price.toFixed(2)}</span>
                                <span className={`change ${stock.change >= 0 ? 'positive' : 'negative'}`}>
                                    {stock.change >= 0 ? '+' : ''}{stock.change.toFixed(2)} 
                                    ({stock.change >= 0 ? '+' : ''}{stock.changePercent.toFixed(2)}%)
                                </span>
                            </div>
                        </div>
                        
                        <div className="chart-container">
                            <canvas 
                                ref={el => chartRefs.current[stock.symbol] = el}
                                id={`chart-${stock.symbol}`} 
                                className="stock-chart"
                                width="600"
                                height="150"
                            ></canvas>
                        </div>
                        
                        <div className="action-buttons">
                            <button 
                                className="btn btn-buy" 
                                onClick={() => handleBuy(stock)}
                            >
                                <span className="btn-icon">📈</span>
                                <span className="btn-text">Buy</span>
                            </button>
                            <button 
                                className="btn btn-sell" 
                                onClick={() => handleSell(stock)}
                            >
                                <span className="btn-icon">📉</span>
                                <span className="btn-text">Sell</span>
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default MarketPage;