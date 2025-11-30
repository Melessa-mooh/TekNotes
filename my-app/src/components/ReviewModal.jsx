import React, { useState } from "react";
import { Star, X } from "lucide-react";

export default function ReviewModal({ isOpen, onClose, onSubmit, resourceTitle }) {
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [comment, setComment] = useState("");

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({ rating, comment });
    // Reset form after submit
    setRating(0);
    setComment("");
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-header">
          <h3>Write a Review</h3>
          <button className="close-btn" onClick={onClose}>
            <X size={20} />
          </button>
        </div>
        
        <p className="modal-subtitle">
          Rate your experience with <strong>{resourceTitle}</strong>
        </p>

        <form onSubmit={handleSubmit}>
          {/* Star Rating Section */}
          <div className="star-rating-section">
            {[...Array(5)].map((_, index) => {
              const ratingValue = index + 1;
              return (
                <label key={index}>
                  <input 
                    type="radio" 
                    name="rating" 
                    value={ratingValue} 
                    onClick={() => setRating(ratingValue)}
                    style={{ display: "none" }}
                  />
                  <Star 
                    size={32} 
                    className="star-icon" 
                    fill={ratingValue <= (hover || rating) ? "#fbbf24" : "none"}
                    stroke={ratingValue <= (hover || rating) ? "#fbbf24" : "#cbd5e1"}
                    onMouseEnter={() => setHover(ratingValue)}
                    onMouseLeave={() => setHover(0)}
                  />
                </label>
              );
            })}
          </div>

          <div className="form-group">
            <label>Your Review</label>
            <textarea 
              rows="4" 
              placeholder="What did you think about this resource?"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              required
            ></textarea>
          </div>

          <div className="modal-actions">
            <button type="button" className="btn-cancel" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn-submit">
              Submit Review
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}