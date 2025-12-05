import React, { useState, useEffect } from "react";
import { X, Star, User, MessageCircle } from "lucide-react";
import ApiService from "../services/api";
import Swal from 'sweetalert2';

export default function ReviewsModal({ isOpen, onClose, resourceId, resourceTitle, currentUserId }) {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen && resourceId) {
      loadReviews();
    }
  }, [isOpen, resourceId]);

  const loadReviews = async () => {
    setLoading(true);
    try {
      const reviewsData = await ApiService.getResourceReviews(resourceId);
      setReviews(reviewsData || []);
    } catch (err) {
      console.error("Error loading reviews:", err);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Failed to load reviews'
      });
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '600px', maxHeight: '80vh', overflowY: 'auto' }}>
        <div className="modal-header">
          <div>
            <h3>Reviews for {resourceTitle}</h3>
            <p style={{ fontSize: '14px', color: '#64748b', marginTop: '4px' }}>
              {reviews.length} {reviews.length === 1 ? 'review' : 'reviews'} • All user reviews and comments
            </p>
          </div>
          <button className="close-btn" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        <div style={{ padding: '20px 0' }}>
          {loading ? (
            <div style={{ textAlign: 'center', padding: '40px' }}>
              <p>Loading reviews...</p>
            </div>
          ) : reviews.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '40px', color: '#64748b' }}>
              <MessageCircle size={48} style={{ opacity: 0.3, marginBottom: '16px' }} />
              <p>No reviews yet. Be the first to review!</p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {reviews.map((review) => (
                <div 
                  key={review.id} 
                  style={{ 
                    padding: '16px', 
                    background: '#f8fafc', 
                    borderRadius: '8px',
                    border: '1px solid #e2e8f0'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <User size={16} color="#64748b" />
                      <span style={{ fontWeight: '600', color: '#0f172a' }}>
                        {currentUserId && review.userId === currentUserId ? "You" : review.userName || "Anonymous"}
                      </span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                      {[...Array(5)].map((_, i) => (
                        <Star 
                          key={i} 
                          size={14} 
                          fill={i < review.rating ? "#fbbf24" : "none"} 
                          stroke={i < review.rating ? "#fbbf24" : "#cbd5e1"}
                        />
                      ))}
                    </div>
                  </div>
                  <p style={{ fontSize: '14px', color: '#334155', margin: 0, lineHeight: '1.5' }}>
                    {review.comment}
                  </p>
                  {review.createdAt && (
                    <p style={{ fontSize: '12px', color: '#94a3b8', marginTop: '8px', marginBottom: 0 }}>
                      {new Date(review.createdAt).toLocaleDateString()}
                    </p>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

