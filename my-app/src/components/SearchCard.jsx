import React, { useState, useEffect } from "react";
import { FileText, User, Star, Download, MessageCircle, Bookmark } from "lucide-react";
import ApiService from "../services/api";
import Swal from 'sweetalert2';
import ReviewsModal from "./ReviewsModal";

export default function SearchCard({ data, onRate, onDownload, onPreview, onCommentClick, currentUserId }) {
  const [showReviewsModal, setShowReviewsModal] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Check if uploader is current user
  const isMyUpload = currentUserId && (data.uploaderUserId === currentUserId || data.uploaderId === currentUserId);
  const uploaderDisplay = isMyUpload ? "You" : (data.uploadedBy || "Community");

  // Check if resource is bookmarked
  useEffect(() => {
    const checkBookmark = async () => {
      if (currentUserId && data.id) {
        try {
          const bookmarked = await ApiService.checkBookmark(currentUserId, data.id);
          setIsBookmarked(bookmarked);
        } catch (err) {
          console.error("Error checking bookmark:", err);
        }
      }
    };
    checkBookmark();
  }, [currentUserId, data.id]);

  const handleBookmark = async (e) => {
    e.stopPropagation();
    if (!currentUserId || !data.id) {
      Swal.fire({
        icon: 'warning',
        title: 'Please Login',
        text: 'You need to login to bookmark resources',
      });
      return;
    }

    setIsLoading(true);
    try {
      const result = await ApiService.toggleBookmark(currentUserId, data.id);
      setIsBookmarked(result !== null);
      
      Swal.fire({
        icon: 'success',
        title: result ? 'Bookmarked!' : 'Removed!',
        text: result ? 'Resource added to your bookmarks' : 'Resource removed from bookmarks',
        timer: 1500,
        showConfirmButton: false
      });
    } catch (err) {
      console.error("Error toggling bookmark:", err);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Failed to bookmark resource'
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    // ✅ Added style={{ position: 'relative' }} to ensure the button stays inside the card
    <div className="search-card-item" style={{ position: 'relative' }}>
      
      {/* --- NEW COMMENT BUTTON (UPPER RIGHT) --- */}
      <button 
        className="comment-corner-btn" 
        onClick={() => onCommentClick && onCommentClick(data)}
        title="View Comments"
      >
        <MessageCircle size={18} />
        <span className="comment-count">{data.reviews || 0}</span>
      </button>

      {/* Top Section: Icon + Text */}
      <div className="card-header-section">
        <div className="file-icon-wrapper">
          <FileText size={24} strokeWidth={1.5} />
        </div>
        <div className="card-text-content">
          <h4>{data.title}</h4>
          <p>{data.description}</p>
        </div>
      </div>

      {/* Middle Section: Author, Date, Stats */}
      <div className="card-meta-section">
        <div className="meta-left">
          <div className="meta-item">
            <User size={14} />
            <span>{data.author}</span>
          </div>
          <div className="meta-item">
            <span>📅 {data.date}</span>
          </div>
        </div>
        
        <div className="meta-right">
          <div 
            className="rating-badge" 
            onClick={() => setShowReviewsModal(true)}
            style={{ cursor: 'pointer' }}
            title="Click to view reviews"
          >
            <Star size={12} fill="#fbbf24" stroke="none" />
            <span>{data.rating || 0} ({data.reviews || 0} reviews)</span>
          </div>
          <div className="download-badge">
            <Download size={12} />
            <span>{data.downloads || 0}</span>
          </div>
        </div>
      </div>

      {/* Bottom Section: Uploader & Buttons */}
      <div className="card-footer-section">
        <div className="uploader-block">
          <div className="uploader-avatar">
            <div style={{width:'100%', height:'100%', background:'#ddd', borderRadius: '50%'}}></div>
          </div>
          <span>Uploaded by {uploaderDisplay}</span>
          {isMyUpload && (
            <span style={{ marginLeft: '8px', fontSize: '11px', color: '#5C0000', fontWeight: 'bold' }}>• Your Resource</span>
          )}
        </div>
        
        <div className="card-action-buttons">
          <button 
            className="btn-rate" 
            onClick={handleBookmark}
            disabled={isLoading}
            style={{
              backgroundColor: isBookmarked ? '#fbbf24' : '',
              color: isBookmarked ? '#fff' : '',
              borderColor: isBookmarked ? '#fbbf24' : ''
            }}
          >
            <Bookmark size={14} fill={isBookmarked ? '#fff' : 'none'} />
            {isBookmarked ? 'Saved' : 'Save'}
          </button>
          
          <button className="btn-rate" onClick={() => onRate(data)}>
            <Star size={14} /> Rate
          </button>
          
          <button className="btn-preview" onClick={() => onPreview(data)}>
            Preview
          </button>
          
          <button className="btn-download" onClick={() => onDownload(data)}>
            <Download size={14} /> Downloads
          </button>
        </div>
      </div>

      <ReviewsModal
        isOpen={showReviewsModal}
        onClose={() => setShowReviewsModal(false)}
        resourceId={data.id}
        resourceTitle={data.title}
        currentUserId={currentUserId}
      />
    </div>
  );
}