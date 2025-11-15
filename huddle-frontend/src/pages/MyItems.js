import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';

const MyItems = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { user } = useAuth();

  useEffect(() => {
    if (user && user.role === 'seller') {
      fetchMyItems();
    }
  }, [user]);

  const fetchMyItems = async () => {
    try {
      setLoading(true);
      const res = await axios.get('/api/items/seller/my-items');
      setItems(res.data || []);
      setError('');
    } catch (error) {
      setError('Failed to fetch your items');
      console.error('Error fetching items:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleAvailability = async (itemId, currentStatus) => {
    try {
      await axios.put(`/api/items/${itemId}`, {
        isAvailable: !currentStatus
      });
      fetchMyItems(); // Refresh the list
    } catch (error) {
      console.error('Error updating item:', error);
    }
  };

  const handleDeleteItem = async (itemId) => {
    if (window.confirm('Are you sure you want to delete this item?')) {
      try {
        await axios.delete(`/api/items/${itemId}`);
        fetchMyItems(); // Refresh the list
      } catch (error) {
        console.error('Error deleting item:', error);
      }
    }
  };

  if (!user || user.role !== 'seller') {
    return (
      <div className="page-container">
        <div className="error-message">
          You need to be a seller to view your items.
        </div>
      </div>
    );
  }

  return (
    <div className="page-container">
      <h1>My Items</h1>
      
      {error && <div className="error-message">{error}</div>}

      {loading ? (
        <div className="loading">Loading your items...</div>
      ) : (
        <div className="items-grid">
          {items.length === 0 ? (
            <div className="no-items">
              <p>You haven't added any items yet.</p>
              <a href="/add-item" className="btn-primary">Add Your First Item</a>
            </div>
          ) : (
            items.map(item => (
              <div key={item._id} className="item-card">
                {item.images && item.images.length > 0 && (
                  <img 
                    src={`/uploads/${item.images[0]}`} 
                    alt={item.title}
                  />
                )}
                <div className="item-info">
                  <h3>{item.title}</h3>
                  <p className="price">GHS {item.price}</p>
                  <p className="category">{item.category}</p>
                  <p className="condition">{item.condition}</p>
                  <p className={`status ${item.isAvailable ? 'available' : 'unavailable'}`}>
                    {item.isAvailable ? 'Available' : 'Unavailable'}
                  </p>
                  <p className="views">{item.views} views</p>
                  
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
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default MyItems;
