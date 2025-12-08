import React, { useState, useEffect } from 'react';
import { X, User, Star, MessageSquare } from 'lucide-react';
import ApiService from '../services/api'; 
import '../styles/resource-comments.css';

export default function ResourceCommentsModal({ isOpen, onClose, resourceId, resourceTitle, currentUserId }) {
  const [reviews, setReviews] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const loadReviews = async () => {
      setIsLoading(true);
      try {
        const data = await ApiService.getResourceReviews(resourceId);
        setReviews(data || []);
      } catch (error) {
        console.error("Failed to load reviews", error);
      } finally {
        setIsLoading(false);
      }
    };

    if (isOpen && resourceId) {
      loadReviews();
    }
  }, [isOpen, resourceId]);

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content comments-modal-width" onClick={e => e.stopPropagation()}>
        
        {/* Header */}
        <div className="modal-header">
          <div>
            <h3>Reviews</h3>
            <p className="modal-subtitle">for "{resourceTitle}"</p>
          </div>
          <button className="close-btn" onClick={onClose}>
            <X size={24} />
          </button>
        </div>

        {/* List of Reviews/Comments */}
        <div className="comments-list-container">
          {isLoading ? (
            <div className="loading-state">
              <div className="spinner-small"></div>
              <p>Loading community feedback...</p>
            </div>
          ) : reviews.length > 0 ? (
            reviews.map((review, index) => (
              <div key={index} className={`comment-item ${review.userId === currentUserId ? 'own-comment' : ''}`}>
                <div className="comment-avatar">
                  <User size={16} />
                </div>
                <div className="comment-bubble">
                  <div className="comment-meta">
                    <span className="comment-author">
                      {/* ✅ FIX: Added checks for 'userName' (camelCase) and 'reviewerName' */}
                      {review.userId === currentUserId ? "You" : (review.userName || review.username || review.reviewerName || review.user?.username || review.user?.firstName || 'User')}
                    </span>
                    <span className="comment-date">
                       {review.createdAt ? new Date(review.createdAt).toLocaleDateString() : "Recently"}
                    </span>
                  </div>
                  
                  {/* Display Star Rating */}
                  <div className="star-display">
                    {[...Array(5)].map((_, i) => (
                      <Star 
                        key={i} 
                        size={12} 
                        fill={i < review.rating ? "#fbbf24" : "none"} 
                        stroke={i < review.rating ? "#fbbf24" : "#cbd5e1"}
                      />
                    ))}
                  </div>

                  {/* Display the Comment Text */}
                  <p className="comment-text">
                    {review.comment || review.text || "No written comment."}
                  </p>
                </div>
              </div>
            ))
          ) : (
            <div className="empty-state">
              <MessageSquare size={48} strokeWidth={1} />
              <p>No reviews yet.</p>
              <p className="empty-sub">Be the first to rate this resource!</p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="modal-footer-info">
           To add your own review, close this window and click the <strong>Rate</strong> button.
        </div>

      </div>
    </div>
  );
}