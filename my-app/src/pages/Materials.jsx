import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { 
  Search, 
  Upload, 
  Bell, 
  User, 
  Menu, 
  FileText, 
  Download, 
  Star,
  CheckCircle,
  File,
  Bookmark,
  Trash2 
} from "lucide-react";
import Swal from 'sweetalert2';

import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import ApiService from "../services/api";
import "../styles/dashboard.css"; 
import "../styles/materials.css"; 

export default function Materials() {
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate();

  const [materials, setMaterials] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // 1. ADD SEARCH STATE
  const [searchTerm, setSearchTerm] = useState("");

  // Load materials from backend
  useEffect(() => {
    const loadMaterials = async () => {
      try {
        const storedUser = localStorage.getItem("teknotesUser");
        if (!storedUser) {
          Swal.fire({
            icon: 'warning',
            title: 'Not Logged In',
            text: 'Please login to view materials',
          });
          navigate('/login');
          return;
        }

        const user = JSON.parse(storedUser);
        const userId = user.id || user.userId;

        // Fetch user's resources from backend
        const resources = await ApiService.getUserResources(userId);
        setMaterials(resources);
        
        Swal.fire({
          icon: 'success',
          title: 'Materials Loaded',
          text: `Successfully loaded ${resources.length} materials`,
          timer: 2000,
          showConfirmButton: false
        });
      } catch (err) {
        console.error("Error loading materials:", err);
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Failed to load materials: ' + err.message
        });
      } finally {
        setLoading(false);
      }
    };

    loadMaterials();
  }, [navigate]);

  // 2. CREATE FILTER LOGIC
  // This checks if the Search Term exists in the Title OR the Description
  const filteredMaterials = materials.filter((item) => {
    if (!searchTerm) return true; // Show all if search is empty
    
    const lowerTerm = searchTerm.toLowerCase();
    const titleMatch = item.title?.toLowerCase().includes(lowerTerm);
    const descMatch = item.description?.toLowerCase().includes(lowerTerm) || 
                      item.tagDescription?.toLowerCase().includes(lowerTerm);
    
    return titleMatch || descMatch;
  });


  // Stats (Using filteredMaterials.length so stats update when you search)
  const stats = [
    { label: "Total Notes", count: materials.length, icon: File, color: "gray" },
    { label: "Download", count: 0, icon: Download, color: "gray" },
    { label: "Published", count: materials.length, icon: CheckCircle, color: "gray" },
  ];

  // Handle Preview Click
  const handlePreview = (item) => {
    const description = item.description || item.tagDescription || 'No description available.';
    Swal.fire({
      title: item.title,
      html: `
        <div style="text-align: left; padding: 10px;">
          <p><strong>Subject:</strong> ${item.subject || item.courseName || 'N/A'}</p>
          <p><strong>Professor:</strong> ${item.professor || item.teacherName || 'N/A'}</p>
          <p><strong>File Type:</strong> ${item.fileType || 'N/A'}</p>
          <p><strong>Description:</strong></p>
          <p style="margin-top: 10px; padding: 10px; background: #f8fafc; border-radius: 4px; white-space: pre-wrap; word-wrap: break-word;">
            ${description}
          </p>
          <p style="margin-top: 10px;"><strong>Rating:</strong> ${item.averageRating || item.rating || 0} (${item.reviewCount || item.reviews || 0} reviews)</p>
          <p><strong>Downloads:</strong> ${item.downloadCount || item.downloads || 0}</p>
          <p style="margin-top: 10px; font-size: 12px; color: #64748b;"><strong>Uploaded by:</strong> You</p>
        </div>
      `,
      width: '600px',
      showCloseButton: true,
      showConfirmButton: true,
      confirmButtonText: 'Close'
    });
  };

  // Handle Delete Action
  const handleDelete = async (e, itemId) => {
    e.stopPropagation(); 
    
    const result = await Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Yes, delete it!'
    });

    if (result.isConfirmed) {
      try {
        // await ApiService.deleteResource(itemId); // Uncomment when API is ready
        setMaterials(prev => prev.filter(item => item.id !== itemId)); 
        Swal.fire('Deleted!', 'Your file has been deleted.', 'success');
      } catch (err) {
        Swal.fire('Error', 'Failed to delete file.', 'error');
      }
    }
  };

  // Handle Bookmark
  const handleBookmark = async (item) => {
    try {
      const storedUser = localStorage.getItem("teknotesUser");
      if (!storedUser) {
        Swal.fire({
            icon: 'warning',
            title: 'Please Login',
            text: 'You need to login to bookmark resources',
        });
        return;
      }
      const user = JSON.parse(storedUser);
      const userId = user.id || user.userId;

      const result = await ApiService.toggleBookmark(userId, item.id);
      
      Swal.fire({
        icon: 'success',
        title: result ? 'Bookmarked!' : 'Removed!',
        text: result ? 'Resource added to your bookmarks' : 'Resource removed from bookmarks',
        timer: 2000,
        showConfirmButton: false
      });
    } catch (err) {
      console.error("Error bookmarking:", err);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Failed to bookmark resource'
      });
    }
  };

  // Handle Download
  const handleDownload = async (item) => {
    try {
      const storedUser = localStorage.getItem("teknotesUser");
      if (!storedUser) {
        Swal.fire({
          icon: 'warning',
          title: 'Please Login',
          text: 'You need to login to download resources',
        });
        return;
      }
      
      const user = JSON.parse(storedUser);
      const userId = user.id || user.userId;
      const resourceId = item.id || item.resourceId;

      if (!userId || !resourceId) {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Missing user or resource information'
        });
        return;
      }

      // Track the download in the backend
      await ApiService.createDownload(userId, resourceId);

      // Trigger actual file download if fileUrl exists
      if (item.fileUrl) {
        const fileUrl = item.fileUrl.startsWith('http') 
          ? item.fileUrl 
          : `http://localhost:8080${item.fileUrl}`;
        const link = document.createElement('a');
        link.href = fileUrl;
        link.download = item.title || 'download';
        link.target = '_blank';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }

      Swal.fire({
        icon: 'success',
        title: 'Download Started',
        text: `${item.title} has been added to your downloads`,
        timer: 2000,
        showConfirmButton: false
      });

      // Trigger a custom event to notify dashboard to refresh
      window.dispatchEvent(new CustomEvent('downloadCompleted'));
    } catch (err) {
      console.error("Error downloading:", err);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Failed to download resource: ' + err.message
      });
    }
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
            <div className="page-header-text">
              <h1>My Materials</h1>
              <p>Manage and track your uploaded study materials</p>
            </div>
          </div>
          <div className="header-right">
            <button className="upload-btn" onClick={() => navigate('/uploads')}>
                          <Upload size={18} /> Upload
                        </button>
            <button className="icon-btn"><Bell size={20} /></button>
            <button className="icon-btn"><User size={20} /></button>
          </div>
        </header>

        <div className="materials-container">
          
          {/* Stats Row */}
          <div className="materials-stats-row">
            {stats.map((stat, index) => (
              <div className="material-stat-card" key={index}>
                <div className="stat-content">
                  <h3>{stat.count}</h3>
                  <p>{stat.label}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Filter Bar */}
          <div className="materials-toolbar">
            <div className="search-bar-material">
              <Search size={18} className="search-icon" />
              
              {/* 3. CONNECT INPUT TO STATE */}
              <input 
                type="text" 
                placeholder="Search materials..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            
            </div>
            <div className="toolbar-right">
              <select className="subject-select">
                <option>All Subjects</option>
                <option>Math</option>
                <option>Science</option>
                <option>History</option>
              </select>
              <button className="my-notes-btn">My Notes</button>
            </div>
          </div>

          {/* Materials Grid */}
          <div className="materials-grid">
            {/* 4. USE filteredMaterials INSTEAD OF materials */}
            {filteredMaterials.length > 0 ? (
              filteredMaterials.map((item) => (
                <div key={item.id} className="material-card" style={{ position: 'relative' }}>
                  
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
                    title="Delete Note"
                  >
                    <Trash2 size={18} />
                  </button>

                  <div className="card-top">
                    <div className="file-icon-red">
                      <FileText size={24} />
                    </div>
                    <div className="card-header-text">
                      <h4>{item.title}</h4>
                      <p className="card-desc">{item.tagDescription || item.description || 'No description'}</p>
                    </div>
                  </div>

                  <div className="card-meta-row">
                    <div className="author-info">
                      <User size={14} />
                      <span>{item.teacherName || 'Unknown'}</span>
                      <span className="dot">🗓️</span>
                      <span>{item.createdAt ? new Date(item.createdAt).toLocaleDateString() : 'N/A'}</span>
                    </div>
                    <div className="stats-info">
                      <span className="rating-badge">
                        <Star size={12} fill="#fbbf24" stroke="none" />
                        {item.averageRating || "0.0"}
                      </span>
                      <span className="download-count">
                        <Download size={12} />
                        {item.downloadCount || 0}
                      </span>
                    </div>
                  </div>

                  <div className="card-footer">
                    <div className="uploader-info">
                      <div className="uploader-avatar">
                        <div style={{width: '100%', height:'100%', background: '#ccc'}}></div>
                      </div>
                      <span>Uploaded by {item.uploadedBy}</span>
                    </div>
                    <div className="card-buttons">
                      <button className="preview-btn" onClick={() => handlePreview(item)}>
                        Preview
                      </button>
                      
                      <button className="download-action-btn" onClick={() => handleBookmark(item)}>
                        <Bookmark size={14} /> Save
                      </button>
                      
                      <button className="download-action-btn" onClick={() => handleDownload(item)}>
                        <Download size={14} /> Download
                      </button>
                    </div>
                  </div>

                </div>
              ))
            ) : (
              <div style={{ gridColumn: "1 / -1", textAlign: "center", padding: "40px", color: "#64748b" }}>
                {searchTerm ? (
                  <p>No materials found matching "{searchTerm}".</p>
                ) : (
                  <p>No recent uploads yet.</p>
                )}
              </div>
            )}
          </div>

        </div>
      </main>
    </div>
  );
}