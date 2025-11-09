import React, { useState, useEffect } from 'react';
import './ShopPage.css';
import { useUser } from '../../Hooks/userContext';
import { getShopData, buyAccessory } from '../../services/shopService';

const ShopPage = () => {
  const { user, updateBalance } = useUser();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch products on component mount
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const data = await getShopData();
        setProducts(data);
        setError(null);
      } catch (err) {
        console.error('Error fetching shop data:', err);
        setError('Failed to load products. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // Handle buy button click
  const handleBuyProduct = async (productId) => {
    try {
      const result = await buyAccessory(productId);
      
      if (result.success) {
        // Update balance in context
        updateBalance(result.new_balance);
        
        // Remove product from local state
        setProducts(products.filter(p => p.id !== productId));
        
        // Optional: show success message
        alert(result.message);
      } else {
        alert(result.message);
      }
    } catch (err) {
      console.error('Error buying product:', err);
      alert('Failed to purchase item. Please try again.');
    }
  };

  // Show loading state
  if (loading) {
    return (
      <div className="shop-container">
        <div className="shop-header">
          <h1 className="shop-title">🏪 Baby Shop</h1>
          <p className="shop-subtitle">Loading products...</p>
        </div>
        <div className="loading-spinner">⏳ Loading...</div>
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <div className="shop-container">
        <div className="shop-header">
          <h1 className="shop-title">🏪 Baby Shop</h1>
          <p className="shop-subtitle" style={{ color: '#ff6b6b' }}>{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="shop-container">
      {/* Header Section */}
      <div className="shop-header">
        <h1 className="shop-title">🏪 Baby Shop</h1>
        <p className="shop-subtitle">Everything you need for your little one!</p>
        <div className="shop-balance">
          <span className="balance-label">Your Balance:</span>
          <span className="balance-amount">💰 ${user?.balance.toFixed(2)}</span>
        </div>
      </div>

      {/* Filter Buttons */}
      <div className="shop-filters">
        <button className="filter-btn filter-active">All Items</button>
        <button className="filter-btn">Essentials</button>
        <button className="filter-btn">Toys</button>
        <button className="filter-btn">Food</button>
        <button className="filter-btn">Equipment</button>
        <button className="filter-btn">Clothing</button>
      </div>

      {/* Products Grid */}
      <div className="products-grid">
        {products.length === 0 ? (
          <div className="no-products">
            <p>No products available at the moment.</p>
          </div>
        ) : (
          products.map((product) => (
            <div key={product.id} className="product-card">
              <div className="product-emoji">{product.emoji}</div>
              <div className="product-category">{product.category}</div>
              <h3 className="product-name">{product.name}</h3>
              <div className="product-price">${product.price}</div>
              <button 
                className="buy-button"
                onClick={() => handleBuyProduct(product.id)}
              >
                <span className="button-icon">🛒</span>
                <span className="button-text">Buy Now</span>
              </button>
            </div>
          ))
        )}
      </div>

      {/* Cart Summary */}
      <div className="cart-summary">
        <div className="cart-info">
          <span className="cart-icon">🛒</span>
          <span className="cart-text">Cart: 0 items</span>
        </div>
        <button className="checkout-button">
          <span>💳 Checkout</span>
        </button>
      </div>
    </div>
  );
};

export default ShopPage;