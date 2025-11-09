import React, { useEffect } from 'react';
import './AvatarPage.css';
import { useUser } from '../../Hooks/userContext';

const AvatarPage = () => {
  const { user, loading, fetchUser } = useUser();

  // Refresh user data when component mounts
  useEffect(() => {
    fetchUser();
  }, []);

  if (loading) {
    return (
      <div className="avatar-container">
        <div className="avatar-loading">⏳ Loading...</div>
      </div>
    );
  }

  return (
    <div className="avatar-container">
      {/* Header */}
      <div className="avatar-header">
        <h1 className="avatar-title">👶 Dress Your Baby</h1>
        <p className="avatar-subtitle">Click items to dress up your little one!</p>
      </div>

      {/* Character Display Area */}
      <div className="character-section">
        <div className="character-placeholder">
          {/* Placeholder for mommy/baby PNG */}
          <div className="character-image">
            <span className="character-emoji">👶</span>
            <p className="character-text">Character Model</p>
          </div>
        </div>
      </div>

      {/* Inventory Section */}
      <div className="inventory-section">
        <h2 className="inventory-title">
          <span className="inventory-icon">🎒</span>
          Your Inventory
        </h2>
        
        <div className="inventory-grid">
          {user?.inventory && user.inventory.length > 0 ? (
            user.inventory.map((item, index) => (
              <div key={index} className="inventory-item">
                <div className="item-emoji">{item.emoji}</div>
                <div className="item-name">{item.name}</div>
                <div className="item-category">{item.category}</div>
              </div>
            ))
          ) : (
            <div className="empty-inventory">
              <p>🛍️ Your inventory is empty!</p>
              <p className="empty-subtitle">Visit the shop to buy items</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AvatarPage;