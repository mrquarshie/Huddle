import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: '',
    university: '',
    phone: ''
  });
  const [universities, setUniversities] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { register } = useAuth();
  const navigate = useNavigate();

  React.useEffect(() => {
    fetchUniversities();
  }, []);

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
        'University of Professional Studies, Accra',
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

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await register(formData);
      navigate('/');
    } catch (error) {
      console.error('Registration error:', error);
      if (error.response) {
        // Server responded with error status
        setError(error.response.data?.message || 'Registration failed');
      } else if (error.request) {
        // Network error - server not responding
        setError('Cannot connect to server. Please check your internet connection.');
      } else {
        // Other error
        setError('An unexpected error occurred. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <form onSubmit={handleSubmit} className="auth-form">
        <h2>Join Huddle</h2>
        
        {error && <div className="error-message">{error}</div>}
        
        <input
          type="text"
          name="name"
          placeholder="Full Name"
          value={formData.name}
          onChange={handleChange}
          required
        />
        
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
          required
        />
        
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleChange}
          required
        />
        
        <input
          type="tel"
          name="phone"
          placeholder="Phone Number"
          value={formData.phone}
          onChange={handleChange}
        />

        <select
          name="role"
          value={formData.role}
          onChange={handleChange}
          required
        >
          <option value="">Select Role</option>
          <option value="buyer">Buyer</option>
          <option value="seller">Seller</option>
        </select>

        <select
          name="university"
          value={formData.university}
          onChange={handleChange}
          required
        >
          <option value="">Select University</option>
          {universities.map(uni => (
            <option key={uni} value={uni}>{uni}</option>
          ))}
        </select>

        <button type="submit" disabled={loading}>
          {loading ? 'Registering...' : 'Register'}
        </button>
        
        <p>
          Already have an account? <Link to="/login">Login here</Link>
        </p>
      </form>
    </div>
  );
};

export default Register;