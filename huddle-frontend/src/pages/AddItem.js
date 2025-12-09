import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';

const AddItem = () => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    category: '',
    condition: '',
    type: 'sell', // 'sell' or 'buy'
    images: []
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleImageChange = (e) => {
    setFormData({
      ...formData,
      images: Array.from(e.target.files)
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (!user || user.role !== 'seller') {
      setError('Only sellers can add items');
      setLoading(false);
      return;
    }

    try {
      const formDataToSend = new FormData();
      formDataToSend.append('title', formData.title);
      formDataToSend.append('description', formData.description);
      formDataToSend.append('price', formData.price);
      formDataToSend.append('category', formData.category);
      formDataToSend.append('condition', formData.condition);
      formDataToSend.append('type', formData.type);
      
      formData.images.forEach((image, index) => {
        formDataToSend.append('images', image);
      });

      await axios.post('/api/items', formDataToSend, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      navigate('/');
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to add item');
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return (
      <div className="page-container">
        <div className="error-message">
          Please login to add listings.
        </div>
      </div>
    );
  }

  return (
    <div className="page-container">
      <div className="auth-form">
        <h2>Add New Listing</h2>
        
        {error && <div className="error-message">{error}</div>}
        
        <form onSubmit={handleSubmit}>
          <div style={{marginBottom: '1.5rem'}}>
            <label style={{display: 'block', marginBottom: '8px', fontWeight: 600, color: '#333'}}>
              I want to:
            </label>
            <div style={{display: 'flex', gap: '15px'}}>
              <label style={{
                flex: 1,
                padding: '16px',
                border: `2px solid ${formData.type === 'sell' ? '#003366' : '#e0e0e0'}`,
                borderRadius: '8px',
                cursor: 'pointer',
                textAlign: 'center',
                background: formData.type === 'sell' ? '#003366' : 'white',
                color: formData.type === 'sell' ? 'white' : '#333',
                fontWeight: 600,
                transition: 'all 0.3s'
              }}>
                <input
                  type="radio"
                  name="type"
                  value="sell"
                  checked={formData.type === 'sell'}
                  onChange={handleChange}
                  style={{display: 'none'}}
                />
                🛒 Sell
              </label>
              <label style={{
                flex: 1,
                padding: '16px',
                border: `2px solid ${formData.type === 'buy' ? '#003366' : '#e0e0e0'}`,
                borderRadius: '8px',
                cursor: 'pointer',
                textAlign: 'center',
                background: formData.type === 'buy' ? '#003366' : 'white',
                color: formData.type === 'buy' ? 'white' : '#333',
                fontWeight: 600,
                transition: 'all 0.3s'
              }}>
                <input
                  type="radio"
                  name="type"
                  value="buy"
                  checked={formData.type === 'buy'}
                  onChange={handleChange}
                  style={{display: 'none'}}
                />
                🔍 Buy
              </label>
            </div>
          </div>

          <input
            type="text"
            name="title"
            placeholder={formData.type === 'sell' ? "What are you selling?" : "What are you looking for?"}
            value={formData.title}
            onChange={handleChange}
            required
          />
          
          <textarea
            name="description"
            placeholder={formData.type === 'sell' ? "Describe your item..." : "Describe what you're looking for..."}
            value={formData.description}
            onChange={handleChange}
            rows="6"
            required
          />
          
          <input
            type="number"
            name="price"
            placeholder={formData.type === 'sell' ? "Price (GHS)" : "Budget (GHS)"}
            value={formData.price}
            onChange={handleChange}
            min="0"
            step="0.01"
            required
          />
          
          <select
            name="category"
            value={formData.category}
            onChange={handleChange}
            required
          >
            <option value="">Select Category</option>
            <option value="electronics">Electronics</option>
            <option value="books">Books & Textbooks</option>
            <option value="clothing">Clothing & Fashion</option>
            <option value="furniture">Furniture</option>
            <option value="sports">Sports & Fitness</option>
            <option value="accessories">Accessories</option>
            <option value="services">Services</option>
            <option value="other">Other</option>
          </select>
          
          {formData.type === 'sell' && (
            <select
              name="condition"
              value={formData.condition}
              onChange={handleChange}
              required
            >
              <option value="">Select Condition</option>
              <option value="new">New</option>
              <option value="like-new">Like New</option>
              <option value="good">Good</option>
              <option value="fair">Fair</option>
              <option value="poor">Poor</option>
            </select>
          )}
          
          {formData.type === 'sell' && (
            <div style={{marginBottom: '1.5rem'}}>
              <label style={{display: 'block', marginBottom: '8px', fontWeight: 600, color: '#333'}}>
                Upload Images (Optional but recommended)
              </label>
              <input
                type="file"
                name="images"
                multiple
                accept="image/*"
                onChange={handleImageChange}
                style={{
                  width: '100%',
                  padding: '12px',
                  border: '2px solid #e0e0e0',
                  borderRadius: '8px',
                  fontSize: '1em',
                  fontFamily: 'Inter, sans-serif'
                }}
              />
            </div>
          )}
          
          <button type="submit" disabled={loading} className="btn btn-primary" style={{width: '100%'}}>
            {loading ? 'Posting...' : formData.type === 'sell' ? '📢 Post for Sale' : '🔍 Post Wanted Ad'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddItem;
