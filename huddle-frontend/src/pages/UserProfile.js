import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import ReviewSection from '../components/ReviewSection';
import './UserProfile.css';

const UserProfile = () => {
  const { id } = useParams();
  const { user: currentUser } = useAuth();
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchUserProfile();
  }, [id]);

  const fetchUserProfile = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`/api/users/${id}`);
      setProfileData(res.data);
      setError('');
    } catch (error) {
      console.error('Error fetching user profile:', error);
      setError('Failed to load user profile');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="loading">Loading profile...</div>;
  }

  if (error || !profileData) {
    return <div className="error-message">{error || 'User not found'}</div>;
  }

  const { user, items, reviews, averageRating, ratingCount } = profileData;
  const isOwnProfile = currentUser && currentUser._id === user._id;

  return (
    <div className="user-profile">
      <div className="profile-header">
        <div className="profile-image-container">
          {user.profileImage ? (
            <img 
              src={`/uploads/${user.profileImage}`} 
              alt={user.name}
              className="profile-image"
            />
          ) : (
            <div className="profile-image-placeholder">
              {user.name.charAt(0).toUpperCase()}
            </div>
          )}
        </div>
        <div className="profile-info">
          <h1>{user.name}</h1>
          <p className="profile-university">🏫 {user.university}</p>
          {user.campus && <p className="profile-campus">📍 {user.campus}</p>}
          <p className="profile-role">{user.role === 'seller' ? '🛒 Seller' : '🛍️ Buyer'}</p>
          {user.phone && <p className="profile-phone">📞 {user.phone}</p>}
          
          {/* Rating Display */}
          <div className="profile-rating">
            <div className="rating-stars">
              {[1, 2, 3, 4, 5].map((star) => (
                <span
                  key={star}
                  className={`star ${star <= Math.round(averageRating) ? 'filled' : ''}`}
                >
                  ★
                </span>
              ))}
            </div>
            <span className="rating-value">
              {averageRating > 0 ? averageRating.toFixed(1) : 'No ratings yet'}
            </span>
            {ratingCount > 0 && (
              <span className="rating-count">({ratingCount} {ratingCount === 1 ? 'review' : 'reviews'})</span>
            )}
          </div>
        </div>
      </div>

      <div className="profile-content">
        {/* User's Items Section */}
        <section className="profile-section">
          <h2>Products & Services</h2>
          {items && items.length > 0 ? (
            <div className="items-grid">
              {items.map(item => (
                <Link key={item._id} to={`/item/${item._id}`} className="item-card">
                  {item.images && item.images.length > 0 && (
                    <img 
                      src={`/uploads/${item.images[0]}`} 
                      alt={item.title}
                    />
                  )}
                  <div className="item-info">
                    <h3>{item.title}</h3>
                    <p className="price">GHS {item.price}</p>
                    <p className="condition">{item.condition}</p>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="no-items">
              <p>No products or services listed yet.</p>
            </div>
          )}
        </section>

        {/* Reviews Section */}
        <section className="profile-section">
          <h2>Reviews & Ratings</h2>
          <ReviewSection 
            userId={id}
            reviews={reviews}
            averageRating={averageRating}
            ratingCount={ratingCount}
            isOwnProfile={isOwnProfile}
            currentUserId={currentUser?._id}
            onReviewAdded={fetchUserProfile}
          />
        </section>
      </div>
    </div>
  );
};

export default UserProfile;

