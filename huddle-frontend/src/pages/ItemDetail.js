import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import PaystackButton from '../components/PaystackButton';

const ItemDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    fetchItem();
  }, [id]);

  const fetchItem = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`/api/items/${id}`);
      setItem(res.data);
      setError('');
    } catch (error) {
      console.error('Error fetching item:', error);
      setError('Failed to load item details');
    } finally {
      setLoading(false);
    }
  };

  const handlePaymentSuccess = (reference) => {
    console.log('Payment successful:', reference);
    // TODO: Update item status, send notification, etc.
    alert('Payment successful! The seller will contact you soon.');
  };

  const handlePaymentClose = () => {
    console.log('Payment closed');
  };

  const handleContactSeller = () => {
    if (item?.seller?.phone) {
      window.open(`tel:${item.seller.phone}`);
    } else if (item?.seller?.email) {
      window.open(`mailto:${item.seller.email}`);
    }
  };

  if (loading) {
    return <div className="loading">Loading item details...</div>;
  }

  if (error || !item) {
    return (
      <div className="page-container">
        <div className="error-message">{error || 'Item not found'}</div>
        <Link to="/" className="btn btn-primary" style={{marginTop: '20px', display: 'inline-block'}}>
          Back to Home
        </Link>
      </div>
    );
  }

  const isOwner = user && item.seller && user._id === item.seller._id;

  return (
    <div className="page-container">
      <div style={{marginBottom: '30px'}}>
        <button 
          onClick={() => navigate(-1)} 
          className="btn btn-outline"
          style={{marginBottom: '20px'}}
        >
          ← Back
        </button>
      </div>

      <div className="item-detail-container">
        {/* Image Gallery */}
        <div className="item-detail-images">
          {item.images && item.images.length > 0 ? (
            <>
              <div className="main-image">
                <img 
                  src={`/uploads/${item.images[currentImageIndex]}`} 
                  alt={item.title}
                />
                {item.type === 'buy' && (
                  <div className="item-badge">🔍 WANTED</div>
                )}
                {item.type === 'sell' && (
                  <div className="item-badge">🛒 FOR SALE</div>
                )}
              </div>
              {item.images.length > 1 && (
                <div className="image-thumbnails">
                  {item.images.map((image, index) => (
                    <img
                      key={index}
                      src={`/uploads/${image}`}
                      alt={`${item.title} ${index + 1}`}
                      className={index === currentImageIndex ? 'active' : ''}
                      onClick={() => setCurrentImageIndex(index)}
                    />
                  ))}
                </div>
              )}
            </>
          ) : (
            <div className="main-image placeholder">
              <div style={{
                width: '100%',
                height: '100%',
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'white',
                fontSize: '3em'
              }}>
                📷
              </div>
            </div>
          )}
        </div>

        {/* Item Info */}
        <div className="item-detail-info">
          <div className="item-detail-header">
            <h1>{item.title}</h1>
            <div className="item-price-large">GHS {item.price}</div>
            {item.condition && (
              <div className="item-condition-badge">{item.condition}</div>
            )}
          </div>

          <div className="item-detail-section">
            <h3>Description</h3>
            <p>{item.description}</p>
          </div>

          <div className="item-detail-section">
            <h3>Details</h3>
            <div className="item-details-grid">
              <div>
                <strong>Category:</strong> {item.category}
              </div>
              {item.condition && (
                <div>
                  <strong>Condition:</strong> {item.condition}
                </div>
              )}
              <div>
                <strong>Type:</strong> {item.type === 'buy' ? '🔍 Wanted' : '🛒 For Sale'}
              </div>
              <div>
                <strong>Location:</strong> {item.university || 'Not specified'}
              </div>
            </div>
          </div>

          {/* Seller Info */}
          {item.seller && (
            <div className="item-detail-section seller-section">
              <h3>Seller Information</h3>
              <div className="seller-card">
                <div className="seller-avatar-large">
                  {item.seller.name ? item.seller.name.charAt(0).toUpperCase() : 'S'}
                </div>
                <div className="seller-info-large">
                  <div className="seller-name-large">{item.seller.name || 'Seller'}</div>
                  <div className="seller-university">🏫 {item.seller.university || 'University not specified'}</div>
                  {item.seller.campus && (
                    <div className="seller-campus">📍 {item.seller.campus}</div>
                  )}
                  <Link 
                    to={`/user/${item.seller._id}`} 
                    className="view-profile-link"
                  >
                    View Profile →
                  </Link>
                </div>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          {!isOwner && (
            <div className="item-detail-actions">
              <button 
                onClick={handleContactSeller}
                className="btn btn-secondary"
                style={{width: '100%', marginBottom: '15px'}}
              >
                📞 Contact Seller
              </button>
              {item.type === 'sell' && (
                <PaystackButton
                  amount={parseFloat(item.price)}
                  email={user?.email || ''}
                  metadata={{
                    itemId: item._id,
                    userId: user?._id,
                    sellerId: item.seller?._id
                  }}
                  onSuccess={handlePaymentSuccess}
                  onClose={handlePaymentClose}
                  text={`💳 Pay GHS ${item.price} with Paystack`}
                />
              )}
            </div>
          )}

          {isOwner && (
            <div className="item-detail-actions">
              <div className="info-box">
                This is your listing. You can manage it from <Link to="/my-items">My Items</Link>.
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ItemDetail;

