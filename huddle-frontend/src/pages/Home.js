import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const Home = () => {
  const [items, setItems] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedUniversity, setSelectedUniversity] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [universities, setUniversities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchItems();
    fetchUniversities();
  }, []);

  const fetchItems = async (search = '', university = '', category = '') => {
    try {
      setLoading(true);
      const params = {};
      if (search) params.search = search;
      if (university) params.university = university;
      if (category) params.category = category;
      
      const res = await axios.get('/api/items', { params });
      setItems(res.data.items || []);
      setError('');
    } catch (error) {
      setError('Failed to fetch items');
      console.error('Error fetching items:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchUniversities = async () => {
    try {
      const res = await axios.get('/api/universities');
      setUniversities(res.data || []);
    } catch (error) {
      console.error('Error fetching universities:', error);
      setUniversities([
        'University of Ghana',
        'Kwame Nkrumah University of Science and Technology',
        'University of Cape Coast',
        'University of Education, Winneba',
        'University for Development Studies',
        'Ashesi University',
        'Central University',
        'University of Professional Studies',
        'Ghana Technology University College',
        'Ghana Institute of Management and Public Administration',
        'Presbyterian University College',
        'Valley View University',
        'Regent University College',
        'Wisconsin International University College',
        'Methodist University College',
        'Catholic University College',
        'Islamic University College',
        'Pentecost University College',
        'Accra Institute of Technology',
        'BlueCrest University College',
        'Garden City University College',
        'Kings University College',
        'Knutsford University College',
        'Lancaster University Ghana',
        'Maranatha University College',
        'MountCrest University College',
        'Radford University College',
        'Sunyani Technical University',
        'Takoradi Technical University',
        'Tamale Technical University',
        'Koforidua Technical University',
        'Ho Technical University',
        'Cape Coast Technical University',
        'Accra Technical University',
        'Kumasi Technical University',
        'Wa Technical University',
        'Bolgatanga Technical University'
      ]);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    fetchItems(searchTerm, selectedUniversity, selectedCategory);
  };

  const handleUniversityChange = (e) => {
    setSelectedUniversity(e.target.value);
    fetchItems(searchTerm, e.target.value, selectedCategory);
  };

  const handleCategoryChange = (e) => {
    setSelectedCategory(e.target.value);
    fetchItems(searchTerm, selectedUniversity, e.target.value);
  };

  const categories = [
    { icon: '📚', name: 'Textbooks', count: '1,234 listings' },
    { icon: '💻', name: 'Electronics', count: '856 listings' },
    { icon: '🪑', name: 'Furniture', count: '432 listings' },
    { icon: '👕', name: 'Clothing', count: '678 listings' },
  ];

  return (
    <div className="home">
      {/* Hero Section */}
      <div className="hero">
        <div className="hero-title">Your Campus Marketplace</div>
        <div className="hero-subtitle">Buy, sell, and connect with students on your campus</div>
        <form onSubmit={handleSearch} className="hero-search">
          <input
            type="text"
            placeholder="Search for clothes`, furniture, electronics..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <button type="submit" className="btn btn-primary" style={{borderRadius: '50px', padding: '16px 45px'}}>
            Search
          </button>
        </form>
      </div>

      {/* Categories Section */}
      <div className="categories">
        <div className="section-title">Popular Categories</div>
        <div className="section-subtitle">Find what you need in seconds</div>
        <div className="category-grid">
          {categories.map((category, index) => (
            <div key={index} className="category-card">
              <div className="category-icon">{category.icon}</div>
              <div className="category-name">{category.name}</div>
              <div className="category-count">{category.count}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Listings Section */}
      <div className="listings-section">
        <div style={{maxWidth: '1400px', margin: '0 auto'}}>
          <div className="section-title">Recently Added</div>
          <div className="section-subtitle">Fresh listings from your campus community</div>
          
          {error && <div className="error-message">{error}</div>}

          {loading ? (
            <div className="loading">Loading items...</div>
          ) : (
            <div className="listings-grid">
              {items.length === 0 ? (
                <div className="no-items">No items found</div>
              ) : (
                items.map(item => (
                  <Link key={item._id} to={`/item/${item._id}`} className="listing-card" style={{textDecoration: 'none', color: 'inherit'}}>
                    <div className="listing-image">
                      {item.images && item.images.length > 0 ? (
                        <img 
                          src={`/uploads/${item.images[0]}`} 
                          alt={item.title}
                          style={{width: '100%', height: '100%', objectFit: 'cover'}}
                        />
                      ) : (
                        <div style={{width: '100%', height: '100%', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'}}></div>
                      )}
                      <div className="listing-badge">NEW</div>
                    </div>
                    <div className="listing-info">
                      <div className="listing-badge-top">
                        {item.type === 'buy' ? '🔍 WANTED' : '🛒 FOR SALE'}
                      </div>
                      <div className="listing-title">{item.title}</div>
                      <div className="listing-price">GHS {item.price}</div>
                      {item.condition && (
                        <div className="listing-condition">{item.condition}</div>
                      )}
                      <div className="listing-meta">
                        <span>📍 {item.university || 'Campus'}</span>
                        {item.type === 'sell' && <span>⭐ 4.8</span>}
                      </div>
                      {item.seller && (
                        <div className="seller-info">
                          <div className="seller-avatar">
                            {item.seller.name ? item.seller.name.charAt(0).toUpperCase() : 'S'}
                          </div>
                          <div className="seller-details">
                            <div className="seller-name">{item.seller.name || 'Seller'}</div>
                            <div className="seller-location">
                              {item.seller.university && <span>🏫 {item.seller.university}</span>}
                              {item.seller.campus && <span> • 📍 {item.seller.campus}</span>}
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </Link>
                ))
              )}
            </div>
          )}
        </div>
      </div>

      {/* Footer */}
      <div className="footer">
        <div className="footer-grid">
          <div>
            <div className="footer-title" style={{fontSize: '1.8em'}}>Huddle</div>
            <p style={{opacity: 0.8, lineHeight: 1.8}}>
              Your trusted campus marketplace for buying, selling, and connecting with fellow students.
            </p>
          </div>
          <div>
            <div className="footer-title">Quick Links</div>
            <div className="footer-links">
              <Link to="/" className="footer-link">Browse Listings</Link>
              <Link to="/" className="footer-link">Categories</Link>
              <Link to="" className="footer-link">How It Works</Link>
              <Link to="/" className="footer-link">About Us</Link>
            </div>
          </div>
          <div>
            <div className="footer-title">Support</div>
            <div className="footer-links">
              <Link to="/" className="footer-link">Help Center</Link>
              <Link to="/" className="footer-link">Safety Tips</Link>
              <Link to="/" className="footer-link">Contact Us</Link>
              <Link to="/" className="footer-link">FAQ</Link>
            </div>
          </div>
          <div>
            <div className="footer-title">Legal</div>
            <div className="footer-links">
              <Link to="/" className="footer-link">Privacy Policy</Link>
              <Link to="/" className="footer-link">Terms of Service</Link>
              <Link to="/" className="footer-link">Community Guidelines</Link>
            </div>
          </div>
        </div>
        <div className="footer-bottom">
          <div>© 2025 Huddle. All rights reserved.</div>
          <div>Made with ❤️ for campus communities</div>
        </div>
      </div>
    </div>
  );
};

export default Home;
