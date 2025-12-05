import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Menu, FileText, Star, BookOpen, Clock } from "lucide-react";
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
  const [loading, setLoading] = useState(true);
  const [currentUserId, setCurrentUserId] = useState(null);
  const navigate = useNavigate();

  // Load bookmarks from backend
  useEffect(() => {
    const loadBookmarks = async () => {
      try {
        const storedUser = localStorage.getItem("teknotesUser");
        if (!storedUser) {
          Swal.fire({
            icon: 'warning',
            title: 'Not Logged In',
            text: 'Please login to view bookmarks',
          });
          navigate('/login');
          return;
        }

        const user = JSON.parse(storedUser);
        const userId = user.id || user.userId;
        setCurrentUserId(userId);

        // Fetch user's bookmarks from backend
        const userBookmarks = await ApiService.getUserBookmarks(userId);
        
        // Map bookmark data to expected format
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
        
        Swal.fire({
          icon: 'success',
          title: 'Bookmarks Loaded',
          text: `You have ${userBookmarks.length} bookmarks`,
          timer: 2000,
          showConfirmButton: false
        });
      } catch (err) {
        console.error("Error loading bookmarks:", err);
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Failed to load bookmarks: ' + err.message
        });
      } finally {
        setLoading(false);
      }
    };

    loadBookmarks();
  }, [navigate]);

  // Delete bookmark handler
  const handleDeleteBookmark = async (bookmarkId) => {
    const result = await Swal.fire({
      title: 'Remove Bookmark?',
      text: "This will remove the bookmark from your list",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Yes, remove it!'
    });

    if (result.isConfirmed) {
      try {
        await ApiService.deleteBookmark(bookmarkId);
        setBookmarks(bookmarks.filter(b => b.id !== bookmarkId));
        
        Swal.fire({
          icon: 'success',
          title: 'Removed!',
          text: 'Bookmark has been removed',
          timer: 1500,
          showConfirmButton: false
        });
      } catch (err) {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Failed to remove bookmark: ' + err.message
        });
      }
    }
  };

  // Filter Logic
  const filteredBookmarks = bookmarks.filter((item) => {
    const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesSubject = selectedSubject === "All" || item.subject === selectedSubject;
    return matchesSearch && matchesSubject;
  });

  return (
    <div className="dashboard-container">
      {/* Reusing the Sidebar */}
      <Sidebar isOpen={isSidebarOpen} />

      {/* Main Layout Area */}
      <main className="main-content">
        
        {/* Mobile Menu Button (Hidden on Desktop via dashboard.css) */}
        <button 
          className="menu-btn" 
          onClick={() => setSidebarOpen(!isSidebarOpen)}
          style={{ margin: "20px 0 0 20px" }} // distinct styling for this page
        >
          <Menu size={24} />
        </button>

        {/* YOUR CSS STRUCTURE STARTS HERE */}
        <div className="bookmarks-container">
          
          {/* HEADER */}
          <div className="top-header">
            <h1>My Bookmarks</h1>
            <p>Access and manage your saved academic resources.</p>
          </div>

          {/* STATS */}
          <div className="stats-row">
            <div className="stats-card">
              <div className="stat-icon">
                <BookOpen size={20} style={{ margin: "7px", color: "#555" }} />
              </div>
              <div>
                <h2>{bookmarks.length}</h2>
                <span style={{ fontSize: "12px", color: "#777" }}>Total Saved</span>
              </div>
            </div>
            
            <div className="stats-card">
              <div className="stat-icon">
                <Clock size={20} style={{ margin: "7px", color: "#555" }} />
              </div>
              <div>
                <h2>12</h2>
                <span style={{ fontSize: "12px", color: "#777" }}>Read Later</span>
              </div>
            </div>
          </div>

          {/* SEARCH ROW */}
          <div className="search-filter-row">
            <input 
              type="text" 
              className="search-bar" 
              placeholder="Search by title..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            
            <select 
              className="subjects-dropdown"
              value={selectedSubject}
              onChange={(e) => setSelectedSubject(e.target.value)}
            >
              <option value="All">All Subjects</option>
              <option value="Computer Science">Computer Science</option>
              <option value="Mathematics">Mathematics</option>
              <option value="History">History</option>
              <option value="Physics">Physics</option>
            </select>

            <button className="my-bookmarks-btn">
              My List
            </button>
          </div>

          {/* CARDS GRID */}
          <div className="cards-grid">
            {filteredBookmarks.length > 0 ? (
              filteredBookmarks.map((item) => (
                <div key={item.id} className="bookmark-card">
                  <div className="bookmark-icon">
                    <FileText />
                  </div>
                  
                  <div className="card-content" style={{ flex: 1 }}>
                    <h3>{item.title}</h3>
                    <p>{item.subject} • {item.professor}</p>
                    <p style={{ fontSize: '12px', color: '#64748b', marginTop: '4px' }}>
                      Uploaded by {item.uploaderName || item.uploadedBy || 'Unknown'}
                      {currentUserId && item.uploaderUserId === currentUserId && (
                        <span style={{ marginLeft: '8px', color: '#5C0000', fontWeight: 'bold' }}>• Your Resource</span>
                      )}
                    </p>
                    
                    <div className="card-meta">
                      <span className="file-type">{item.fileType}</span>
                      <span className="rating">⭐ {item.rating || 0} ({item.reviews || 0} reviews)</span>
                      <span style={{ marginLeft: "auto" }}>{item.date}</span>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <p style={{ color: "#777", gridColumn: "span 2", textAlign: "center" }}>
                No bookmarks found matching your search.
              </p>
            )}
          </div>

        </div>
      </main>
    </div>
  );
}