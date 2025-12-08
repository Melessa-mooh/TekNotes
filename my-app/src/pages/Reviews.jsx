import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { 
  Search, 
  Upload, 
  Bell, 
  User, 
  Menu, 
  MessageCircle, 
  ThumbsUp, 
  Star,
  Edit2, 
  Trash2, 
  MessageSquare
} from "lucide-react";
import Swal from 'sweetalert2';

import Sidebar from "../components/Sidebar";
import ApiService from "../services/api";
import CommentsModal from "../components/CommentsModal";
import "../styles/dashboard.css"; 
import "../styles/reviews.css";   

export default function Reviews() {
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentUserId, setCurrentUserId] = useState(null);
  const [selectedReviewId, setSelectedReviewId] = useState(null);
  const [showCommentsModal, setShowCommentsModal] = useState(false);
  const navigate = useNavigate();

  // Load reviews from backend
  useEffect(() => {
    const loadReviews = async () => {
      try {
        const storedUser = localStorage.getItem("teknotesUser");
        if (!storedUser) {
          Swal.fire({
            icon: 'warning',
            title: 'Not Logged In',
            text: 'Please login to view reviews',
          });
          navigate('/login');
          return;
        }

        const user = JSON.parse(storedUser);
        const userId = user.id || user.userId;
        setCurrentUserId(userId);

        // Fetch ALL reviews from backend (not just current user's) with like/comment counts
        const allReviews = await ApiService.getAllReviews(userId);
        setReviews(allReviews);
        
        Swal.fire({
          icon: 'success',
          title: 'Reviews Loaded',
          text: `Loaded ${allReviews.length} reviews`,
          timer: 2000,
          showConfirmButton: false
        });
      } catch (err) {
        console.error("Error loading reviews:", err);
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Failed to load reviews: ' + err.message
        });
      } finally {
        setLoading(false);
      }
    };

    loadReviews();
  }, [navigate]);

  const handleLike = async (reviewId) => {
    if (!currentUserId) {
      Swal.fire({
        icon: 'warning',
        title: 'Please Login',
        text: 'You need to login to like reviews',
      });
      return;
    }

    try {
      const result = await ApiService.toggleReviewLike(reviewId, currentUserId);
      // Reload reviews to get updated like counts
      const allReviews = await ApiService.getAllReviews(currentUserId);
      setReviews(allReviews);
    } catch (err) {
      console.error("Error toggling like:", err);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Failed to like review: ' + (err.message || 'Unknown error')
      });
    }
  };

  const handleComments = (reviewId) => {
    setSelectedReviewId(reviewId);
    setShowCommentsModal(true);
  };

  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: 'Delete Review?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Yes, delete it!'
    });

    if (result.isConfirmed) {
      try {
        await ApiService.deleteReview(id);

const updatedReviews = reviews.filter((r) => (r.id !== id && r.reviewId !== id));
        setReviews(updatedReviews);
        
        Swal.fire({
          icon: 'success',
          title: 'Deleted!',
          text: 'Your review has been deleted',
          timer: 1500,
          showConfirmButton: false
        });
      } catch (err) {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Failed to delete review: ' + err.message
        });
      }
    }
  };

  
  const totalReviews = reviews.length;
  const totalLikes = reviews.reduce((sum, item) => sum + (item.likes || 0), 0);
  const avgRating = totalReviews > 0 
    ? (reviews.reduce((sum, item) => sum + item.rating, 0) / totalReviews).toFixed(1) 
    : 0;

  const stats = [
    { label: "Reviews Written", count: totalReviews, icon: MessageCircle, color: "red" },
    { label: "Avg Rating", count: avgRating, icon: Star, color: "yellow" },
    { label: "Likes Received", count: totalLikes, icon: ThumbsUp, color: "green" },
  ];

  const renderStars = (count) => {
    return [...Array(5)].map((_, i) => (
      <Star 
        key={i} 
        size={16} 
        className={i < count ? "star-filled" : "star-empty"} 
        fill={i < count ? "#fbbf24" : "none"} 
        stroke={i < count ? "#fbbf24" : "#cbd5e1"}
      />
    ));
  };

  return (
    <div className="dashboard-container">
      <Sidebar isOpen={isSidebarOpen} />

      <main className="main-content">
        <header className="header">
          <div className="header-left">
            <button className="menu-btn" onClick={() => setSidebarOpen(!isSidebarOpen)}>
              <Menu size={24} />
            </button>
            <h1 className="page-title">Reviews</h1>
          </div>
          <div className="header-right">
            <button className="upload-btn" onClick={() => navigate('/uploads')}>
              <Upload size={18} /> Upload
            </button>
            <button className="icon-btn"><Bell size={20} /></button>
            <button className="icon-btn"><User size={20} /></button>
          </div>
        </header>

        <div className="reviews-container">
          
          {/* Dynamic Stats Row */}
          <div className="stats-row">
            {stats.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <div className="stat-card-review" key={index}>
                  <div className={`stat-icon-circle ${stat.color}`}>
                    <Icon size={20} />
                  </div>
                  <div className="stat-info">
                    <h3>{stat.count}</h3>
                    <p>{stat.label}</p>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Filter Bar */}
          <div className="filter-bar-container">
            <div className="search-wrapper">
              <Search size={20} className="search-icon" />
              <input type="text" placeholder="Search reviews..." />
            </div>
            <div className="filter-dropdowns">
              <select className="filter-select">
                <option>All Subjects</option>
                <option>Math</option>
                <option>Science</option>
              </select>
              <select className="filter-select">
                <option>All Subjects</option>
                <option>Newest</option>
                <option>Oldest</option>
              </select>
            </div>
          </div>

          {/* Reviews List */}
          <div className="reviews-list">
            {reviews.length > 0 ? (
              reviews.map((review) => (
               
                <div key={review.reviewId || review.id} className="review-card">
                  
                  <div className="review-card-header">
                    <div className="header-content">
                      {/* FIX 1: Access the nested resource title */}
                      <h4>{review.resourceTitle || (review.resource ? review.resource.title : "Resource Review")}</h4>
                      
                      {/* Show reviewer name - "You" if it's current user */}
                      <p style={{ fontSize: '12px', color: '#64748b', marginTop: '4px' }}>
                        Reviewed by {currentUserId && review.userId === currentUserId ? "You" : (review.userName || "Unknown")}
                      </p>
                    </div>
                    <div className="card-actions">
                      <button className="action-btn edit"><Edit2 size={18} /></button>
                      <button className="action-btn delete" onClick={() => handleDelete(review.reviewId || review.id)}>
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </div>

                  <div className="review-stars">
                    {renderStars(review.rating)}
                  </div>

                  {/* FIX 2: Use 'comment' instead of 'content' */}
                  <p className="review-text">{review.comment}</p>

                  <div className="review-footer">
                    <button 
                      className="engagement-item" 
                      onClick={() => handleLike(review.reviewId || review.id)}
                      style={{ 
                        background: 'transparent', 
                        border: 'none', 
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px',
                        color: review.isLiked ? '#5C0000' : 'inherit'
                      }}
                      title="Like this review"
                    >
                      <ThumbsUp size={18} fill={review.isLiked ? '#5C0000' : 'none'} />
                      <span>{review.likeCount || review.likes || 0}</span>
                    </button>
                    <button 
                      className="engagement-item"
                      onClick={() => handleComments(review.reviewId || review.id)}
                      style={{ 
                        background: 'transparent', 
                        border: 'none', 
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px'
                      }}
                      title="View comments"
                    >
                      <MessageSquare size={18} />
                      <span>{review.commentCount || 0}</span>
                    </button>
                  </div>

                </div>
              ))
            ) : (
              <div style={{textAlign: "center", color: "#888", marginTop: "40px"}}>
                <p>No reviews yet. Go to Search Resources to add one!</p>
              </div>
            )}
          </div>
        </div>

        <CommentsModal
          isOpen={showCommentsModal}
          onClose={() => {
            setShowCommentsModal(false);
            setSelectedReviewId(null);
            // Reload reviews to get updated comment counts
            if (currentUserId) {
              ApiService.getAllReviews(currentUserId).then(setReviews).catch(console.error);
            }
          }}
          reviewId={selectedReviewId}
          currentUserId={currentUserId}
        />
      </main>
    </div>
  );
}