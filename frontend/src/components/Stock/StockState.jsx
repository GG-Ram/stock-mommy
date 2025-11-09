import React from 'react';

/**
 * Loading state component
 */
export const LoadingState = () => (
    <div className="container">
        <div className="header">
            <h1>Stock Trading Dashboard</h1>
            <p>Loading stock data...</p>
        </div>
    </div>
);

/**
 * Error state component
 */
export const ErrorState = ({ error, onRetry }) => (
    <div className="container">
        <div className="header">
            <h1>Stock Trading Dashboard</h1>
            <p style={{ color: 'red' }}>{error}</p>
            <button onClick={onRetry}>Retry</button>
        </div>
    </div>
);