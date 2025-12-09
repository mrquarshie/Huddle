import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import { getAllUniversities, getCampuses } from '../utils/ghanaUniversities';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: '',
    university: '',
    campus: '',
    phone: ''
  });
  const [universities] = useState(getAllUniversities());
  const [availableCampuses, setAvailableCampuses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    if (name === 'university') {
      // When university changes, update campuses and reset campus selection
      const campuses = getCampuses(value);
      setAvailableCampuses(campuses);
      setFormData({
        ...formData,
        university: value,
        campus: '' // Reset campus when university changes
      });
    } else {
      setFormData({
        ...formData,
        [name]: value
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // Frontend validation
    if (!formData.name || !formData.email || !formData.password || !formData.role || !formData.university || !formData.campus) {
      setError('Please fill in all required fields');
      setLoading(false);
      return;
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters long');
      setLoading(false);
      return;
    }

    try {
      // Log the data being sent for debugging
      console.log('Registering with data:', {
        name: formData.name,
        email: formData.email,
        role: formData.role,
        university: formData.university,
        campus: formData.campus,
        phone: formData.phone || undefined
      });

      await register(formData);
      navigate('/');
    } catch (error) {
      console.error('Registration error:', error);
      console.error('Error response:', error.response);
      console.error('Error request:', error.request);
      
      if (error.response) {
        // Server responded with error
        const errorData = error.response.data;
        let errorMessage = 'Registration failed';
        
        if (errorData?.message) {
          errorMessage = errorData.message;
        } else if (errorData?.error) {
          errorMessage = errorData.error;
        } else if (typeof errorData === 'string') {
          errorMessage = errorData;
        } else if (errorData?.errors) {
          // Handle validation errors
          const errors = errorData.errors;
          errorMessage = Object.values(errors).flat().join(', ');
        }
        
        setError(errorMessage);
      } else if (error.request) {
        // Request was made but no response received
        setError('Cannot connect to server. Please make sure the backend server is running on http://localhost:5000');
      } else {
        // Error setting up the request
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
        <p style={{textAlign: 'center', color: '#666', marginBottom: '20px', fontSize: '0.9em'}}>
          Create your student account to start buying and selling
        </p>
        
        {error && (
          <div className="error-message" style={{
            background: '#ffebee',
            color: '#c62828',
            padding: '16px',
            borderRadius: '8px',
            marginBottom: '20px',
            borderLeft: '4px solid #f44336',
            fontSize: '0.95em',
            lineHeight: '1.5'
          }}>
            <strong>⚠️ Registration Error:</strong><br />
            {error}
            {error.includes('connect to server') && (
              <div style={{marginTop: '10px', fontSize: '0.9em', opacity: 0.9}}>
                <strong>Tip:</strong> The app will use mock authentication for testing. Make sure your backend server is running on http://localhost:5000 for full functionality.
              </div>
            )}
          </div>
        )}
        
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

        {formData.university && (
          <select
            name="campus"
            value={formData.campus}
            onChange={handleChange}
            required
          >
            <option value="">Select Campus</option>
            {availableCampuses.map(campus => (
              <option key={campus} value={campus}>{campus}</option>
            ))}
          </select>
        )}

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
