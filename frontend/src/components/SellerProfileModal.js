import React, { useState, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';

function SellerProfileModal({ sellerId, sellerName, onClose, currentUserId }) {
  const [reviews, setReviews] = useState([]);
  const [averageRating, setAverageRating] = useState(0);
  const [rating, setRating] = useState(5);
  const [reviewText, setReviewText] = useState('');

  useEffect(() => {
    fetchReviews();
  }, [sellerId]);

  const fetchReviews = async () => {
    try {
      const res = await axios.get(`http://localhost:5000/api/reviews/${sellerId}`);
      setReviews(res.data.reviews);
      setAverageRating(res.data.averageRating);
    } catch (err) {
      console.error("Error fetching reviews", err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!currentUserId) {
      toast.error("You must be logged in to leave a review.");
      return;
    }
    
    try {
      await axios.post("http://localhost:5000/api/reviews", {
        reviewerId: currentUserId,
        sellerId: sellerId,
        rating: rating,
        reviewText: reviewText
      });
      toast.success("Review submitted!");
      setReviewText('');
      setRating(5);
      fetchReviews();
    } catch (err) {
      toast.error(err.response?.data?.message || "Error submitting review");
    }
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        <button className="close-btn" onClick={onClose}>&times;</button>
        <h2>{sellerName}'s Profile</h2>
        
        <div className="rating-summary">
          <span className="big-rating">{averageRating} ⭐</span>
          <span className="review-count">({reviews.length} reviews)</span>
        </div>

        {currentUserId !== sellerId && (
          <form onSubmit={handleSubmit} className="review-form">
            <h3>Leave a Review</h3>
            <select className="form-input" value={rating} onChange={(e) => setRating(Number(e.target.value))}>
              <option value="5">5 - Excellent</option>
              <option value="4">4 - Good</option>
              <option value="3">3 - Average</option>
              <option value="2">2 - Poor</option>
              <option value="1">1 - Terrible</option>
            </select>
            <textarea 
              className="form-input"
              placeholder="Write your review here..."
              value={reviewText}
              onChange={(e) => setReviewText(e.target.value)}
              required
              rows={3}
              style={{ marginTop: '10px', resize: 'vertical' }}
            />
            <button type="submit" className="btn-primary" style={{ marginTop: '10px' }}>Submit Review</button>
          </form>
        )}

        <div className="reviews-list">
          <h3>Past Reviews</h3>
          {reviews.length === 0 ? <p className="text-muted">No reviews yet.</p> : null}
          {reviews.map(r => (
            <div key={r.id} className="review-item">
              <div className="review-header">
                <strong>{r.reviewer_name}</strong>
                <span>{r.rating} ⭐</span>
              </div>
              <p className="review-text">{r.review_text}</p>
              <small className="text-muted">{new Date(r.created_at).toLocaleDateString()}</small>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default SellerProfileModal;
