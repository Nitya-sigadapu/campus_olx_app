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
      const res = await axios.get(`/api/reviews/${sellerId}`);
      setReviews(res.data.reviews);
      setAverageRating(res.data.averageRating);
    } catch (err) {
      // console.error("Error fetching reviews", err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!currentUserId) {
      toast.error("You must be logged in to leave a review.");
      return;
    }
    
    try {
      await axios.post("/api/reviews", {
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

  const renderDisplayStars = (avgRating, sizeClass = "text-2xl") => {
    return (
      <div className={`flex space-x-1 ${sizeClass}`}>
        {[1, 2, 3, 4, 5].map((star) => (
          <span key={star} className={star <= Math.round(avgRating) ? "text-yellow-400 drop-shadow-sm" : "text-slate-200"}>
            ★
          </span>
        ))}
      </div>
    );
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4" onClick={onClose}>
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden flex flex-col max-h-[90vh] transform transition-all" onClick={e => e.stopPropagation()}>
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-slate-50 relative">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 to-indigo-600"></div>
          <h2 className="text-xl font-bold text-slate-800 truncate pr-4">{sellerName}'s Profile</h2>
          <button 
            className="text-gray-400 hover:text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-full h-8 w-8 flex items-center justify-center transition-colors focus:outline-none active:scale-95" 
            onClick={onClose}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
          </button>
        </div>
        
        <div className="overflow-y-auto p-6">
          
          <div className="flex flex-col items-center mb-8 bg-gradient-to-b from-slate-50 to-white py-6 rounded-2xl border border-slate-100 shadow-sm">
            <div className="text-5xl font-extrabold text-slate-800 mb-2">{Number(averageRating).toFixed(1)}</div>
            {renderDisplayStars(averageRating, "text-3xl mb-3")}
            <span className="text-sm font-semibold text-slate-500 bg-slate-100 px-4 py-1.5 rounded-full shadow-inner">{reviews.length} total reviews</span>
          </div>

          {currentUserId !== sellerId && (
            <form onSubmit={handleSubmit} className="mb-8 bg-indigo-50/50 p-6 rounded-2xl border border-indigo-100/50">
              <h3 className="text-sm font-bold text-indigo-900 mb-4 uppercase tracking-wider">Leave a Review</h3>
              
              <div className="mb-4">
                <p className="text-xs text-indigo-700 font-semibold mb-2">Select Rating</p>
                <div className="flex space-x-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      type="button"
                      key={star}
                      className={`text-3xl focus:outline-none transition-transform hover:scale-110 ${star <= rating ? "text-yellow-400 drop-shadow-sm" : "text-slate-300 hover:text-yellow-200"}`}
                      onClick={() => setRating(star)}
                    >
                      ★
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-4">
                <textarea 
                  className="w-full bg-white border border-indigo-200 rounded-xl shadow-sm py-3 px-4 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors text-slate-700 resize-none"
                  placeholder="Share your experience with this seller..."
                  value={reviewText}
                  onChange={(e) => setReviewText(e.target.value)}
                  required
                  rows={3}
                />
                <button 
                  type="submit" 
                  className="w-full flex justify-center py-3 px-4 rounded-xl shadow-md text-sm font-bold text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all duration-200 active:translate-y-1 active:scale-95 active:shadow-inner"
                >
                  Submit Review
                </button>
              </div>
            </form>
          )}

          <div>
            <h3 className="text-sm font-bold text-slate-800 mb-4 uppercase tracking-wider border-b border-gray-100 pb-2">Past Reviews</h3>
            {reviews.length === 0 ? (
              <div className="text-center py-8 text-slate-500 bg-slate-50 rounded-xl border border-dashed border-gray-200">
                <p>No reviews yet.</p>
                <p className="text-xs mt-1">Be the first to leave a review!</p>
              </div>
            ) : (
              <div className="space-y-4">
                {reviews.map(r => (
                  <div key={r.id} className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <strong className="text-sm text-slate-800 block mb-1">{r.reviewer_name}</strong>
                        {renderDisplayStars(r.rating, "text-sm")}
                      </div>
                      <div className="text-[11px] text-slate-400 font-medium bg-slate-50 px-2 py-1 rounded">
                        {new Date(r.created_at).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })}
                      </div>
                    </div>
                    <p className="text-sm text-slate-600 leading-relaxed bg-slate-50 p-3 rounded-lg border border-slate-100">{r.review_text}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default SellerProfileModal;
