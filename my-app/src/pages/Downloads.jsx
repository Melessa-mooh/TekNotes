import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { 
  Search, 
  Upload, 
  Menu, 
  FileText, 
  Download, 
  Trash2, 
  Star,
  BookOpen
} from "lucide-react";
import Swal from 'sweetalert2';

import Sidebar from "../components/Sidebar";
import ApiService from "../services/api";
import ReviewsModal from "../components/ReviewsModal";
import "../styles/dashboard.css";
import "../styles/downloads.css";

export default function Downloads() {
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [downloads, setDownloads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentUserId, setCurrentUserId] = useState(null);
  const [selectedResource, setSelectedResource] = useState(null);
  const [showReviewsModal, setShowReviewsModal] = useState(false);
  const [selectedSubject, setSelectedSubject] = useState("All Subjects");
  const navigate = useNavigate();

  // Load user downloads from backend
  useEffect(() => {
    const loadDownloads = async () => {
      try {
        const storedUser = localStorage.getItem("teknotesUser");
        if (!storedUser) {
          Swal.fire({
            icon: 'warning',
            title: 'Not Logged In',
            text: 'Please login to view downloads',
          });
          navigate('/login');
          return;
        }

        const user = JSON.parse(storedUser);
        const userId = user.userId || user.id;
        setCurrentUserId(userId);

        if (!userId) {
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'User ID not found'
          });
          return;
        }

        // Fetch user's downloads from backend
        const downloadsData = await ApiService.getUserDownloads(userId);
        
        // Extract resource data from downloads
        // Backend returns: { id: downloadId, downloadDate, resource: ResourceSummaryDto }
        const downloadResources = downloadsData.map(d => {
          const resource = d.resource || {};
          const downloadDate = d.downloadDate ? new Date(d.downloadDate).toLocaleDateString() : 'Recently';
          
          // Check if uploader is current user
          const isMyUpload = userId && resource.uploaderUserId === userId;
          const uploaderDisplay = isMyUpload ? "You" : (resource.uploaderName || resource.professor || resource.teacherName || 'Unknown');
          
          return {
            id: resource.id || resource.resourceId, // Resource ID for display
            downloadId: d.id, // Download record ID for deletion
            title: resource.title || 'Untitled',
            description: resource.tagDescription || resource.description || '',
            subject: resource.subject || resource.courseName || 'General',
            professor: resource.professor || resource.teacherName || 'Unknown',
            fileType: resource.fileType || 'FILE',
            rating: resource.rating || 0,
            downloads: resource.downloads || 0,
            downloadedAt: downloadDate,
            uploadTime: resource.uploadTime || downloadDate,
            date: downloadDate,
            author: resource.professor || resource.teacherName || 'Unknown',
            instructor: resource.professor || resource.teacherName || 'Unknown',
          uploadedBy: uploaderDisplay,
          uploaderUserId: resource.uploaderUserId,
          uploaderName: resource.uploaderName,
          reviewCount: resource.reviews || resource.reviewCount || 0,
          downloadCount: resource.downloads || resource.downloadCount || 0
        };
        });
        
        setDownloads(downloadResources);
      } catch (err) {
        console.error("Error loading downloads:", err);
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Failed to load downloads: ' + err.message
        });
      } finally {
        setLoading(false);
      }
    };

    loadDownloads();
  }, [navigate]);

  // Refresh downloads when component comes into focus (user navigates back)
  useEffect(() => {
    const handleFocus = () => {
      const storedUser = localStorage.getItem("teknotesUser");
      if (storedUser) {
        const user = JSON.parse(storedUser);
        const userId = user.userId || user.id;
        if (userId) {
          // Silently refresh downloads
          ApiService.getUserDownloads(userId)
            .then(downloadsData => {
              const downloadResources = downloadsData.map(d => {
                const resource = d.resource || {};
                const downloadDate = d.downloadDate ? new Date(d.downloadDate).toLocaleDateString() : 'Recently';
                
                return {
                  id: resource.id || resource.resourceId,
                  downloadId: d.id,
                  title: resource.title || 'Untitled',
                  description: resource.tagDescription || resource.description || '',
                  subject: resource.subject || resource.courseName || 'General',
                  professor: resource.professor || resource.teacherName || 'Unknown',
                  fileType: resource.fileType || 'FILE',
                  rating: resource.rating || 0,
                  downloads: resource.downloads || 0,
                  downloadedAt: downloadDate,
                  uploadTime: resource.uploadTime || downloadDate,
                  date: downloadDate,
                  author: resource.professor || resource.teacherName || 'Unknown',
                  instructor: resource.professor || resource.teacherName || 'Unknown',
                  uploadedBy: resource.professor || resource.teacherName || 'Unknown'
                };
              });
              setDownloads(downloadResources);
            })
            .catch(err => console.error("Error refreshing downloads:", err));
        }
      }
    };

    window.addEventListener('focus', handleFocus);
    return () => window.removeEventListener('focus', handleFocus);
  }, []);



  // ✅ 2. ADDED DELETE FUNCTION
  const handleDelete = async (e, itemId) => {
    e.stopPropagation(); // Stop click from bubbling up
    
    const result = await Swal.fire({
      title: 'Remove Download?',
      text: "This will remove this item from your downloads list.",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Yes, remove it!'
    });

    if (result.isConfirmed) {
      try {
        // Find the download ID from the item
        const item = downloads.find(d => d.id === itemId);
        if (item && item.downloadId) {
          await ApiService.deleteDownload(item.downloadId);
        }
        setDownloads(prev => prev.filter(d => d.id !== itemId)); // Update UI
        Swal.fire('Removed!', 'Item removed from downloads.', 'success');
      } catch (err) {
        Swal.fire('Error', 'Failed to remove item: ' + err.message, 'error');
      }
    }
  };

  // Filter downloads based on selected subject
  const filteredDownloads = downloads.filter((item) => {
    if (selectedSubject === "All Subjects") {
      return true;
    }
    
    const itemSubject = item.subject || item.courseName || "";
    const itemCourseCode = item.courseCode || "";
    
    return itemSubject === selectedSubject || itemCourseCode === selectedSubject;
  });

  return (
    <div className="dashboard-container">
      <Sidebar isOpen={isSidebarOpen} />

      <main className="main-content">
        <header className="header">
          <div className="header-left">
            <button className="menu-btn" onClick={() => setSidebarOpen(!isSidebarOpen)}>
              <Menu size={24} />
            </button>
            <h1 className="page-title">Downloads</h1>
          </div>
          <div className="header-right">
            <button className="upload-btn" onClick={() => navigate('/uploads')}>
              <Upload size={18} /> Upload
            </button>
          </div>
        </header>

        <div className="downloads-container">
          
          {/* Filter Bar */}
          <div className="downloads-toolbar">
            <div className="search-bar-download">
              <Search size={18} className="search-icon" />
              <input type="text" placeholder="Search downloads..." />
            </div>
            
            <div className="toolbar-right">
              <select className="subject-select" value={selectedSubject} onChange={(e) => setSelectedSubject(e.target.value)}>
                <option>All Subjects</option>
                <option>Appdev</option>
                <option>TeckNo</option>
                <option>Networking1</option>
                <option>Networking2</option>
                <option>IM1</option>
                <option>IM2</option>
                <option>OOP1</option>
                <option>OOP2</option>
                <option>Electives</option>
                <option>Project Management</option>
              </select>
              <button className="my-downloads-btn">My Downloads</button>
            </div>
          </div>

          {/* Downloads Grid */}
          <div className="downloads-grid">
            {filteredDownloads.length > 0 ? (
              filteredDownloads.map((item) => (
                <div key={item.id} className="download-card-large">
                  
                  {/* --- 3. ADDED DELETE BUTTON --- */}
                  <button 
                    onClick={(e) => handleDelete(e, item.id)}
                    style={{
                        position: 'absolute',
                        top: '15px',
                        right: '15px',
                        background: 'transparent',
                        border: 'none',
                        cursor: 'pointer',
                        color: '#94a3b8',
                        zIndex: 10
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.color = '#ef4444'}
                    onMouseLeave={(e) => e.currentTarget.style.color = '#94a3b8'}
                    title="Remove Download"
                  >
                    <Trash2 size={18} />
                  </button>
                  {/* ----------------------------- */}

                  {/* File Icon + Title Block */}
                  <div className="card-top">
                    <div className="file-icon-red">
                      <FileText size={24} />
                    </div>
                    <div className="card-header-text">
                      <h4>{item.title}</h4>
                      <p className="card-desc">{item.description}</p>
                    </div>
                  </div>

                  {/* Author & Stats Meta */}
                  <div className="card-meta-row">
                    <div className="author-info">
                      {/* Handle different data structures (uploaded vs public) */}
                      <span>{item.author || item.professor || item.instructor || "Unknown"}</span>
                      <span className="dot">•</span>
                      <span>Downloaded: {item.downloadedAt || item.date || item.uploadTime || 'Recently'}</span>
                    </div>
                    <div className="stats-info">
                      <span 
                        className="rating-badge" 
                        onClick={() => {
                          setSelectedResource(item);
                          setShowReviewsModal(true);
                        }}
                        style={{ cursor: 'pointer' }}
                        title="Click to view all reviews and comments"
                      >
                        <Star size={12} fill="#fbbf24" stroke="none" />
                        {item.rating || 0} ({item.reviews || item.reviewCount || 0} reviews)
                      </span>
                      <span className="download-count">
                        <Download size={12} />
                        {item.downloads || item.downloadCount || 0} downloads
                      </span>
                    </div>
                  </div>

                  {/* Footer Actions */}
                  <div className="card-footer">
                    <div className="uploader-info">
                      <div className="uploader-avatar">
                        <div style={{width:'100%', height:'100%', background:'#ddd', borderRadius:'50%'}}></div>
                      </div>
                      <span>Uploaded by {item.uploadedBy || "System"}</span>
                      {currentUserId && item.uploaderUserId === currentUserId && (
                        <span style={{ marginLeft: '8px', fontSize: '11px', color: '#5C0000', fontWeight: 'bold' }}>• Your Resource</span>
                      )}
                    </div>
                    <div className="card-buttons">
                      <button className="preview-btn" onClick={() => {
                        if (item.fileUrl) {
                          // Construct full URL if it's a relative path
                          const fileUrl = item.fileUrl.startsWith('http') 
                            ? item.fileUrl 
                            : `http://localhost:8080${item.fileUrl}`;
                          window.open(fileUrl, '_blank');
                        } else {
                          Swal.fire({
                            icon: 'warning',
                            title: 'File Not Available',
                            text: 'The file URL is not available for this resource.'
                          });
                        }
                      }}>
                        View
                      </button>
                    
                      <button className="download-action-btn">
                        <Download size={14} /> Downloaded
                      </button>
                    </div>
                  </div>

                </div>
              ))
            ) : (
              <div style={{gridColumn: "1/-1", textAlign: "center", padding: "60px", color: "#64748b"}}>
                <div style={{fontSize: "48px", marginBottom: "16px", opacity: 0.5}}>📂</div>
                <h3>{selectedSubject === "All Subjects" ? "No downloads yet" : `No Matching File for "${selectedSubject}"`}</h3>
                <p>{selectedSubject === "All Subjects" ? "Visit the Search Resources page to find and download materials." : "Try selecting a different subject or visit Search Resources to find materials."}</p>
              </div>
            )}
          </div>

        </div>

        <ReviewsModal
          isOpen={showReviewsModal}
          onClose={() => {
            setShowReviewsModal(false);
            setSelectedResource(null);
          }}
          resourceId={selectedResource?.id}
          resourceTitle={selectedResource?.title}
          currentUserId={currentUserId}
        />
      </main>
    </div>
  );
}