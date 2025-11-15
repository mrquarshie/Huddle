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

  if (!user || user.role !== 'seller') {
    return (
      <div className="page-container">
        <div className="error-message">
          You need to be a seller to add items. Please register as a seller.
        </div>
      </div>
    );
  }

  return (
    <div className="page-container">
      <div className="auth-form">
        <h2>Add New Item</h2>
        
        {error && <div className="error-message">{error}</div>}
        
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            name="title"
            placeholder="Item Title"
            value={formData.title}
            onChange={handleChange}
            required
          />
          
          <textarea
            name="description"
            placeholder="Item Description"
            value={formData.description}
            onChange={handleChange}
            rows="4"
            required
          />
          
          <input
            type="number"
            name="price"
            placeholder="Price (GHS)"
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
            <option value="books">Books</option>
            <option value="clothing">Clothing</option>
            <option value="furniture">Furniture</option>
            <option value="sports">Sports</option>
            <option value="accessories">Accessories</option>
            <option value="other">Other</option>
          </select>
          
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
          
          <input
            type="file"
            name="images"
            multiple
            accept="image/*"
            onChange={handleImageChange}
            required
          />
          
          <button type="submit" disabled={loading}>
            {loading ? 'Adding Item...' : 'Add Item'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddItem;