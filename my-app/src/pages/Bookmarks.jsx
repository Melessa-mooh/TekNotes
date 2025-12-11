import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Menu, FileText, Star, BookOpen, Clock, Upload, Search } from "lucide-react"; 
import Swal from 'sweetalert2';

// Components
import Sidebar from "../components/Sidebar";
import ApiService from "../services/api";

// Styles
import "../styles/bookmarks.css";
import "../styles/dashboard.css";

export default function Bookmarks() {
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSubject, setSelectedSubject] = useState("All");
  const [bookmarks, setBookmarks] = useState([]);
  const [currentUserId, setCurrentUserId] = useState(null);
  const navigate = useNavigate();

  // Load bookmarks
  useEffect(() => {
    const loadBookmarks = async () => {
      try {
        const storedUser = localStorage.getItem("teknotesUser");
        if (!storedUser) {
          navigate('/login');
          return;
        }
        const user = JSON.parse(storedUser);
        const userId = user.id || user.userId;
        setCurrentUserId(userId);

        const userBookmarks = await ApiService.getUserBookmarks(userId);
        
        const mappedBookmarks = userBookmarks.map(b => {
          const resource = b.resource || {};
          return {
            id: b.id || b.bookmarkId,
            title: resource.title || 'Untitled',
            subject: resource.subject || resource.courseName || 'General',
            professor: resource.professor || resource.teacherName || 'Unknown',
            fileType: resource.fileType || 'FILE',
            rating: resource.rating || 0,
            reviews: resource.reviews || resource.reviewCount || 0,
            downloads: resource.downloads || resource.downloadCount || 0,
            date: b.saveDate ? new Date(b.saveDate).toLocaleDateString() : 'Recently',
            resourceId: resource.id || resource.resourceId,
            uploaderUserId: resource.uploaderUserId,
            uploaderName: resource.uploaderName,
            uploadedBy: resource.uploaderName || 'Unknown'
          };
        });
        
        setBookmarks(mappedBookmarks);
      } catch (err) {
        console.error("Error loading bookmarks:", err);
      }
    };
    loadBookmarks();
  }, [navigate]);

  const renderStars = (rating) => {
    return [...Array(5)].map((_, i) => (
      <Star 
        key={i} 
        size={14} 
        fill={i < Math.round(rating) ? "#f59e0b" : "none"} 
        color={i < Math.round(rating) ? "#f59e0b" : "#cbd5e1"}
        style={{ marginRight: '1px' }}
      />
    ));
  };

  const filteredBookmarks = bookmarks.filter((item) => {
    const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesSubject = selectedSubject === "All" || item.subject === selectedSubject || 
                          (item.courseCode && item.courseCode === selectedSubject);
    return matchesSearch && matchesSubject;
  });

  return (
    <div className="dashboard-container">
      <Sidebar isOpen={isSidebarOpen} />

      <main className="main-content">
        
        {/* --- HEADER --- */}
        <header className="header">
          <div className="header-left">
            <button className="menu-btn" onClick={() => setSidebarOpen(!isSidebarOpen)}>
              <Menu size={24} />
            </button>
            <h1 className="page-title">Bookmarks</h1>
          </div>
          <div className="header-right">
            <button className="upload-btn" onClick={() => navigate('/uploads')}>
              <Upload size={18} /> Upload
            </button>
        
          </div>
        </header>

        <div className="bookmarks-container">
          
          {/* STATS ROW - "Read Later" Card Removed */}
          <div className="stats-row">
            <div className="stats-card">
              <div className="stat-icon-square red">
                <BookOpen size={24} />
              </div>
              <div className="stat-info-download">
                <h3>{bookmarks.length}</h3>
                <p>Total Saved</p>
              </div>
            </div>
          </div>

          {/* SEARCH ROW */}
          <div className="search-filter-row">
            <div className="search-wrapper">
                <Search size={20} className="search-icon" />
                <input 
                  type="text" 
                  placeholder="Search bookmarks..." 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
            </div>
            
            <div className="filter-actions">
                <select 
                  className="subjects-dropdown"
                  value={selectedSubject}
                  onChange={(e) => setSelectedSubject(e.target.value)}
                >
                  <option value="All">All Subjects</option>
                  <option value="Appdev">Appdev</option>
                  <option value="TeckNo">TeckNo</option>
                  <option value="Networking1">Networking1</option>
                  <option value="Networking2">Networking2</option>
                  <option value="IM1">IM1</option>
                  <option value="IM2">IM2</option>
                  <option value="OOP1">OOP1</option>
                  <option value="OOP2">OOP2</option>
                  <option value="Electives">Electives</option>
                  <option value="Project Management">Project Management</option>
                </select>

                <button className="my-bookmarks-btn">
                  My List
                </button>
            </div>
          </div>

          {/* CARDS GRID */}
          <div className="cards-grid">
            {filteredBookmarks.length > 0 ? (
              filteredBookmarks.map((item) => (
                <div key={item.id} className="bookmark-card">
                  
                  {/* ICON */}
                  <div className="card-icon-container">
                    <FileText size={24} strokeWidth={1.5} />
                  </div>
                  
                  {/* CONTENT */}
                  <div className="card-content">
                    <div className="card-header-row">
                        <h3>{item.title}</h3>
                        <p className="subtitle">{item.subject} • {item.professor}</p>
                    </div>
                    
                    <div className="card-meta-row">
                        <span className="file-type-badge">{item.fileType}</span>
                        
                        {/* 5 STARS DISPLAY */}
                        <div className="rating-container">
                            <div className="stars-row">
                                {renderStars(item.rating)}
                            </div>
                            <span className="review-count">
                                ({item.reviews || 0})
                            </span>
                        </div>

                        <span className="date-info">
                           <Clock size={14} />
                           {item.date}
                        </span>
                    </div>
                  </div>
                </div>
              ))
            ) : (
                <div className="empty-state-container">
                    <div className="empty-folder-icon">
                        <BookOpen size={48} color="#fcd34d" fill="#fcd34d" />
                    </div>
                    <h3>No bookmarks yet</h3>
                    <p>Visit the Materials page to find and save resources.</p>
                </div>
            )}
          </div>

        </div>
      </main>
    </div>
  );
}