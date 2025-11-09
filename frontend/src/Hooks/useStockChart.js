import { useRef, useState, useEffect } from 'react';

/**
 * Custom hook for managing stock chart drawing and hover interactions
 */
export const useStockChart = (stocks) => {
    const chartRefs = useRef({});
    const [hoveredData, setHoveredData] = useState({});

    // Draw charts when stock data changes
    useEffect(() => {
        if (stocks.length > 0) {
            stocks.forEach(stock => {
                drawChart(stock.symbol, stock.graph);
            });
        }
    }, [stocks]);

    // Redraw chart with hover indicator
    useEffect(() => {
        stocks.forEach(stock => {
            drawChart(stock.symbol, stock.graph);
        });
    }, [hoveredData]);

    const drawChart = (symbol, graphData) => {
        const canvas = chartRefs.current[symbol];
        if (!canvas || !graphData || graphData.length === 0) return;

        const ctx = canvas.getContext('2d');
        const width = canvas.width;
        const height = canvas.height;

        ctx.clearRect(0, 0, width, height);

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

        // Draw area fill
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

        // Draw hover elements
        const hoverData = hoveredData[symbol];
        if (hoverData) {
            const { x, y, price } = hoverData;

            // Vertical line
            ctx.beginPath();
            ctx.strokeStyle = 'rgba(0, 0, 0, 0.3)';
            ctx.lineWidth = 1;
            ctx.setLineDash([5, 5]);
            ctx.moveTo(x, 0);
            ctx.lineTo(x, height);
            ctx.stroke();

            // Horizontal line
            ctx.moveTo(0, y);
            ctx.lineTo(width, y);
            ctx.stroke();
            ctx.setLineDash([]);

            // Point
            ctx.beginPath();
            ctx.arc(x, y, 5, 0, 2 * Math.PI);
            ctx.fillStyle = '#667eea';
            ctx.fill();
            ctx.strokeStyle = 'white';
            ctx.lineWidth = 2;
            ctx.stroke();

            // Tooltip
            const tooltipText = `$${price.toFixed(2)}`;
            ctx.font = 'bold 14px Arial';
            const textWidth = ctx.measureText(tooltipText).width;
            const tooltipX = x > width / 2 ? x - textWidth - 20 : x + 10;
            const tooltipY = y > height / 2 ? y - 10 : y + 20;

            ctx.fillStyle = 'rgba(255, 255, 255, 0.95)';
            ctx.shadowColor = 'rgba(0, 0, 0, 0.2)';
            ctx.shadowBlur = 10;
            ctx.shadowOffsetX = 2;
            ctx.shadowOffsetY = 2;
            ctx.fillRect(tooltipX - 5, tooltipY - 18, textWidth + 10, 24);
            ctx.shadowColor = 'transparent';

            ctx.fillStyle = '#2c3e50';
            ctx.fillText(tooltipText, tooltipX, tooltipY);
        }
    };

    const handleMouseMove = (symbol, graphData, event) => {
        const canvas = chartRefs.current[symbol];
        if (!canvas || !graphData) return;

        const rect = canvas.getBoundingClientRect();
        const mouseX = event.clientX - rect.left;
        const xStep = canvas.width / (graphData.length - 1);
        const index = Math.round(mouseX / xStep);

        if (index >= 0 && index < graphData.length) {
            const price = graphData[index];
            const maxPrice = Math.max(...graphData);
            const minPrice = Math.min(...graphData);
            const priceRange = maxPrice - minPrice || 1;
            const x = index * xStep;
            const y = canvas.height - ((price - minPrice) / priceRange) * canvas.height;

            setHoveredData(prev => ({
                ...prev,
                [symbol]: { index, x, y, price }
            }));
        }
    };

    const handleMouseLeave = (symbol) => {
        setHoveredData(prev => {
            const newData = { ...prev };
            delete newData[symbol];
            return newData;
        });
    };

    return {
        chartRefs,
        handleMouseMove,
        handleMouseLeave
    };
};