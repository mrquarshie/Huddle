import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';

const MyItems = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      fetchMyItems();
    }
  }, [user]);

  const fetchMyItems = async () => {
    try {
      setLoading(true);
      // Try seller endpoint first, fallback to user items
      const endpoint = user.role === 'seller' ? '/api/items/seller/my-items' : '/api/items/my-items';
      const res = await axios.get(endpoint);
      setItems(res.data || []);
      setError('');
    } catch (error) {
      // Fallback: try alternative endpoint
      try {
        const res = await axios.get('/api/items/my-items');
        setItems(res.data || []);
        setError('');
      } catch (err) {
        setError('Failed to fetch your items');
        console.error('Error fetching items:', err);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleToggleAvailability = async (itemId, currentStatus) => {
    try {
      await axios.put(`/api/items/${itemId}`, {
        isAvailable: !currentStatus
      });
      fetchMyItems();
    } catch (error) {
      console.error('Error updating item:', error);
    }
  };

  const handleDeleteItem = async (itemId) => {
    if (window.confirm('Are you sure you want to delete this item?')) {
      try {
        await axios.delete(`/api/items/${itemId}`);
        fetchMyItems();
      } catch (error) {
        console.error('Error deleting item:', error);
      }
    }
  };

  if (!user) {
    return (
      <div className="page-container">
        <div className="error-message">
          Please login to view your items.
        </div>
      </div>
    );
  }

  return (
    <div className="page-container">
      <div style={{marginBottom: '40px'}}>
        <h1 style={{fontSize: '2.5em', fontWeight: 700, color: '#333', marginBottom: '10px'}}>My Listings</h1>
        <p style={{fontSize: '1.1em', color: '#666'}}>Manage your posted items</p>
      </div>
      
      {error && <div className="error-message">{error}</div>}

      {loading ? (
        <div className="loading">Loading your items...</div>
      ) : (
        <>
          {items.length === 0 ? (
            <div className="no-items">
              <p style={{marginBottom: '20px', fontSize: '1.2em'}}>You haven't added any items yet.</p>
              <Link to="/add-item" className="btn btn-primary">Add Your First Item</Link>
            </div>
          ) : (
            <div className="items-grid">
              {items.map(item => (
                <div key={item._id} className="item-card">
                  {item.images && item.images.length > 0 ? (
                    <img 
                      src={`/uploads/${item.images[0]}`} 
                      alt={item.title}
                      className="listing-image"
                    />
                  ) : (
                    <div className="listing-image"></div>
                  )}
                  <div className="item-info">
                    <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '10px'}}>
                      <h3 style={{flex: 1, marginRight: '10px'}}>{item.title}</h3>
                      <span style={{
                        padding: '4px 12px',
                        borderRadius: '15px',
                        fontSize: '0.75em',
                        fontWeight: 600,
                        background: item.type === 'buy' ? '#e3f2fd' : '#fff3e0',
                        color: item.type === 'buy' ? '#1976d2' : '#e65100'
                      }}>
                        {item.type === 'buy' ? '🔍 WANTED' : '🛒 FOR SALE'}
                      </span>
                    </div>
                    <p className="price">GHS {item.price}</p>
                    <p className="category">{item.category}</p>
                    {item.condition && <p className="condition">{item.condition}</p>}
                    <p className={`status ${item.isAvailable ? 'available' : 'unavailable'}`}>
                      {item.isAvailable ? '✅ Available' : '❌ Unavailable'}
                    </p>
                    <p className="views">👁️ {item.views || 0} views</p>
                    
                    <div className="item-actions">
                      <button 
                        onClick={() => handleToggleAvailability(item._id, item.isAvailable)}
                        className={`btn ${item.isAvailable ? 'btn-warning' : 'btn-success'}`}
                      >
                        {item.isAvailable ? 'Mark Unavailable' : 'Mark Available'}
                      </button>
                      <button 
                        onClick={() => handleDeleteItem(item._id)}
                        className="btn btn-danger"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default MyItems;
