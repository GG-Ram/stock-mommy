import React from 'react';
import './ShopPage.css';

const ShopPage = () => {
  // Sample products for the shop
  const products = [
    {
      id: 1,
      name: "Baby Bottle",
      price: 25,
      emoji: "🍼",
      category: "Essentials"
    },
    {
      id: 2,
      name: "Cute Pacifier",
      price: 15,
      emoji: "👶",
      category: "Essentials"
    },
    {
      id: 3,
      name: "Soft Blanket",
      price: 40,
      emoji: "🛏️",
      category: "Comfort"
    },
    {
      id: 4,
      name: "Baby Toy",
      price: 30,
      emoji: "🧸",
      category: "Toys"
    },
    {
      id: 5,
      name: "Diaper Pack",
      price: 35,
      emoji: "🧷",
      category: "Essentials"
    },
    {
      id: 6,
      name: "Baby Food",
      price: 20,
      emoji: "🥣",
      category: "Food"
    },
    {
      id: 7,
      name: "Stroller",
      price: 150,
      emoji: "🚼",
      category: "Equipment"
    },
    {
      id: 8,
      name: "Baby Monitor",
      price: 80,
      emoji: "📹",
      category: "Equipment"
    },
    {
      id: 9,
      name: "Rattle",
      price: 12,
      emoji: "🎵",
      category: "Toys"
    },
    {
      id: 10,
      name: "Baby Clothes",
      price: 45,
      emoji: "👕",
      category: "Clothing"
    },
    {
      id: 11,
      name: "Baby Shoes",
      price: 35,
      emoji: "👟",
      category: "Clothing"
    },
    {
      id: 12,
      name: "Baby Book",
      price: 18,
      emoji: "📚",
      category: "Education"
    }
  ];

  return (
    <div className="shop-container">
      {/* Header Section */}
      <div className="shop-header">
        <h1 className="shop-title">🏪 Baby Shop</h1>
        <p className="shop-subtitle">Everything you need for your little one!</p>
        <div className="shop-balance">
          <span className="balance-label">Your Balance:</span>
          <span className="balance-amount">💰 $500</span>
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
        {products.map((product) => (
          <div key={product.id} className="product-card">
            <div className="product-emoji">{product.emoji}</div>
            <div className="product-category">{product.category}</div>
            <h3 className="product-name">{product.name}</h3>
            <div className="product-price">${product.price}</div>
            <button className="buy-button">
              <span className="button-icon">🛒</span>
              <span className="button-text">Buy Now</span>
            </button>
          </div>
        ))}
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