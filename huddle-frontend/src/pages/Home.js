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
      // Fallback to hardcoded list if API fails
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

  return (
    <div className="home">
      <div className="hero-section">
        <h1>Welcome to Huddle</h1>
        <p>Buy and sell items within Ghanaian universities</p>
        
        <form onSubmit={handleSearch} className="search-form">
          <input
            type="text"
            placeholder="Search items..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          
          <select
            value={selectedUniversity}
            onChange={handleUniversityChange}
          >
            <option value="">All Universities</option>
            {universities.map(uni => (
              <option key={uni} value={uni}>{uni}</option>
            ))}
          </select>

          <select
            value={selectedCategory}
            onChange={handleCategoryChange}
          >
            <option value="">All Categories</option>
            <option value="electronics">Electronics</option>
            <option value="books">Books</option>
            <option value="clothing">Clothing</option>
            <option value="furniture">Furniture</option>
            <option value="sports">Sports</option>
            <option value="accessories">Accessories</option>
            <option value="other">Other</option>
          </select>
          
          <button type="submit">Search</button>
        </form>
      </div>

      {error && <div className="error-message">{error}</div>}

      {loading ? (
        <div className="loading">Loading items...</div>
      ) : (
        <div className="items-grid">
          {items.length === 0 ? (
            <div className="no-items">No items found</div>
          ) : (
            items.map(item => (
              <div key={item._id} className="item-card">
                <Link to={`/item/${item._id}`}>
                  {item.images && item.images.length > 0 && (
                    <img 
                      src={`/uploads/${item.images[0]}`} 
                      alt={item.title}
                    />
                  )}
                  <div className="item-info">
                    <h3>{item.title}</h3>
                    <p className="price">GHS {item.price}</p>
                    <p className="university">{item.university}</p>
                    <p className="condition">{item.condition}</p>
                  </div>
                </Link>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default Home;