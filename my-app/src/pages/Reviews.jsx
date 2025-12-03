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
import "../styles/dashboard.css"; 
import "../styles/reviews.css";   

export default function Reviews() {
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
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

        // Fetch user's reviews from backend
        const userReviews = await ApiService.getUserReviews(userId);
        setReviews(userReviews);
        
        Swal.fire({
          icon: 'success',
          title: 'Reviews Loaded',
          text: `You have written ${userReviews.length} reviews`,
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

  // Delete functionality with SweetAlert2
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
        const updatedReviews = reviews.filter((r) => r.id !== id);
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

  // ✅ 4. Calculate Stats Dynamically based on 'reviews' state
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

  // Helper to render stars
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
            <button className="upload-btn"><Upload size={18} /> Upload</button>
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
                <div key={review.id} className="review-card">
                  
                  <div className="review-card-header">
                    <div className="header-content">
                      <h4>{review.title}</h4>
                      {review.isMyReview && <span className="my-review-badge">My Reviews</span>}
                    </div>
                    <div className="card-actions">
                      <button className="action-btn edit"><Edit2 size={18} /></button>
                      <button className="action-btn delete" onClick={() => handleDelete(review.id)}>
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </div>

                  <div className="review-stars">
                    {renderStars(review.rating)}
                  </div>

                  <p className="review-text">{review.content}</p>

                  <div className="review-footer">
                    <div className="engagement-item">
                      <ThumbsUp size={18} />
                      <span>{review.likes}</span>
                    </div>
                    <div className="engagement-item">
                      <MessageSquare size={18} />
                      <span>{review.comments}</span>
                    </div>
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
      </main>
    </div>
  );
}