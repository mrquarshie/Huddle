import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import './ReviewSection.css';

const ReviewSection = ({ 
  userId, 
  reviews: initialReviews, 
  averageRating, 
  ratingCount,
  isOwnProfile,
  currentUserId,
  onReviewAdded 
}) => {
  const { user } = useAuth();
  const [reviews, setReviews] = useState(initialReviews || []);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [hasReviewed, setHasReviewed] = useState(false);

  useEffect(() => {
    setReviews(initialReviews || []);
    // Check if current user has already reviewed
    if (user && initialReviews) {
      const userReview = initialReviews.find(r => r.reviewer._id === user._id);
      setHasReviewed(!!userReview);
    }
  }, [initialReviews, user]);

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    
    if (!user) {
      setError('Please login to leave a review');
      return;
    }

    if (rating === 0) {
      setError('Please select a rating');
      return;
    }

    try {
      setLoading(true);
      setError('');
      
      const res = await axios.post(`/api/users/${userId}/reviews`, {
        rating,
        comment: comment.trim()
      });

      // Refresh reviews
      const reviewsRes = await axios.get(`/api/users/${userId}/reviews`);
      setReviews(reviewsRes.data.reviews);
      setShowReviewForm(false);
      setRating(0);
      setComment('');
      setHasReviewed(true);
      
      if (onReviewAdded) {
        onReviewAdded();
      }
    } catch (error) {
      console.error('Error submitting review:', error);
      setError(error.response?.data?.message || 'Failed to submit review');
    } finally {
      setLoading(false);
    }
  };

  const canReview = user && !isOwnProfile && !hasReviewed;

  return (
    <div className="review-section">
      {/* Rating Summary */}
      <div className="rating-summary">
        <div className="rating-display">
          <span className="rating-number">{averageRating > 0 ? averageRating.toFixed(1) : '0.0'}</span>
          <div className="rating-stars-large">
            {[1, 2, 3, 4, 5].map((star) => (
              <span
                key={star}
                className={`star ${star <= Math.round(averageRating) ? 'filled' : ''}`}
              >
                ★
              </span>
            ))}
          </div>
          <span className="rating-count-text">
            {ratingCount > 0 ? `${ratingCount} ${ratingCount === 1 ? 'review' : 'reviews'}` : 'No reviews yet'}
          </span>
        </div>
        
        {canReview && (
          <button 
            className="btn-add-review"
            onClick={() => setShowReviewForm(!showReviewForm)}
          >
            {showReviewForm ? 'Cancel' : 'Add Review'}
          </button>
        )}
      </div>

      {/* Review Form */}
      {showReviewForm && canReview && (
        <form className="review-form" onSubmit={handleSubmitReview}>
          <div className="form-group">
            <label>Rating *</label>
            <div className="star-rating-input">
              {[1, 2, 3, 4, 5].map((star) => (
                <span
                  key={star}
                  className={`star-input ${
                    star <= (hoverRating || rating) ? 'filled' : ''
                  }`}
                  onClick={() => setRating(star)}
                  onMouseEnter={() => setHoverRating(star)}
                  onMouseLeave={() => setHoverRating(0)}
                >
                  ★
                </span>
              ))}
            </div>
            {rating > 0 && (
              <span className="rating-text">
                {rating === 1 ? 'Poor' : 
                 rating === 2 ? 'Fair' : 
                 rating === 3 ? 'Good' : 
                 rating === 4 ? 'Very Good' : 'Excellent'}
              </span>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="comment">Comment (optional)</label>
            <textarea
              id="comment"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Share your experience..."
              maxLength={500}
              rows={4}
            />
            <span className="char-count">{comment.length}/500</span>
          </div>

          {error && <div className="error-message">{error}</div>}

          <button type="submit" className="btn-submit-review" disabled={loading || rating === 0}>
            {loading ? 'Submitting...' : 'Submit Review'}
          </button>
        </form>
      )}

      {/* Reviews List */}
      <div className="reviews-list">
        {reviews && reviews.length > 0 ? (
          reviews.map((review) => (
            <div key={review._id} className="review-item">
              <div className="review-header">
                <div className="reviewer-info">
                  {review.reviewer.profileImage ? (
                    <img 
                      src={`/uploads/${review.reviewer.profileImage}`} 
                      alt={review.reviewer.name}
                      className="reviewer-avatar"
                    />
                  ) : (
                    <div className="reviewer-avatar-placeholder">
                      {review.reviewer.name.charAt(0).toUpperCase()}
                    </div>
                  )}
                  <div>
                    <p className="reviewer-name">{review.reviewer.name}</p>
                    <p className="review-date">
                      {new Date(review.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <div className="review-rating">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <span
                      key={star}
                      className={`star ${star <= review.rating ? 'filled' : ''}`}
                    >
                      ★
                    </span>
                  ))}
                </div>
              </div>
              {review.comment && (
                <p className="review-comment">{review.comment}</p>
              )}
            </div>
          ))
        ) : (
          <div className="no-reviews">
            <p>No reviews yet. Be the first to review this user!</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ReviewSection;

