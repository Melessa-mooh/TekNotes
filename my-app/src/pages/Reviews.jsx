import React, { useState } from "react";
import { 
  Search, 
  Upload, 
  Bell, 
  User, 
  Menu, 
  MessageCircle, 
  ThumbsUp, 
  Star,
  Edit2,     // For the pencil icon
  Trash2,    // For the delete/trash icon
  MessageSquare // For the comment icon
} from "lucide-react";

// Shared Components
import Sidebar from "../components/Sidebar";

// Styles
import "../styles/dashboard.css"; 
import "../styles/reviews.css";   

export default function Reviews() {
  const [isSidebarOpen, setSidebarOpen] = useState(false);

  // Stats Data
  const stats = [
    { label: "Reviews Written", count: 4, icon: MessageCircle, color: "red" },
    { label: "Avg Rating", count: 4.3, icon: Star, color: "yellow" },
    { label: "Likes Received", count: 3, icon: ThumbsUp, color: "green" },
  ];

  // Review Data matching your screenshot
  const [reviews] = useState([
    { 
      id: 1, 
      title: "Data Structures - Binary Trees", 
      content: "Excellent comprehensive guide! The examples are clear and the explanations really helped me understand complex algorithms. Highly recommended for CS students.",
      rating: 4, 
      likes: 12, 
      comments: 8,
      isMyReview: true 
    },
    { 
      id: 2, 
      title: "Calculus II - Integration Techniques", 
      content: "The step-by-step breakdown of integration by parts was a lifesaver. However, I wish there were more practice problems included at the end of the chapter.",
      rating: 4, 
      likes: 12, 
      comments: 8,
      isMyReview: true 
    },
    { 
      id: 3, 
      title: "World History - Renaissance Era", 
      content: "Great summary of the key events. The timeline visualization was particularly helpful for memorizing dates for the final exam.",
      rating: 4, 
      likes: 12, 
      comments: 8,
      isMyReview: true 
    },
  ]);

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
        {/* Header */}
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
          
          {/* 1. Stats Row */}
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

          {/* 2. Filter Bar */}
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

          {/* 3. Reviews List (Custom Cards) */}
          <div className="reviews-list">
            {reviews.map((review) => (
              <div key={review.id} className="review-card">
                
                {/* Card Header: Title + Badge + Actions */}
                <div className="review-card-header">
                  <div className="header-content">
                    <h4>{review.title}</h4>
                    {review.isMyReview && <span className="my-review-badge">My Reviews</span>}
                  </div>
                  <div className="card-actions">
                    <button className="action-btn edit"><Edit2 size={18} /></button>
                    <button className="action-btn delete"><Trash2 size={18} /></button>
                  </div>
                </div>

                {/* Rating Stars */}
                <div className="review-stars">
                  {renderStars(review.rating)}
                </div>

                {/* Text Content */}
                <p className="review-text">{review.content}</p>

                {/* Footer: Likes & Comments */}
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
            ))}
          </div>

        </div>
      </main>
    </div>
  );
}