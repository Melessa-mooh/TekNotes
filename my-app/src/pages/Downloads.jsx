import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { 
  Search, 
  Upload, 
  Bell, 
  User, 
  Menu, 
  Bookmark, 
  Folder, 
  Heart, 
  FileText, 
  Star, 
  Download,
  Trash2 // <--- 1. ADD IMPORT HERE
} from "lucide-react";
import Swal from 'sweetalert2';

import Sidebar from "../components/Sidebar";
import ApiService from "../services/api";
import "../styles/dashboard.css"; 
import "../styles/downloads.css"; 

export default function Downloads() {
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [downloads, setDownloads] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Load downloads from backend (all resources)
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

        // Fetch all available resources from backend
        const allResources = await ApiService.getAllResources();
        setDownloads(allResources);
        
        Swal.fire({
          icon: 'success',
          title: 'Downloads Available',
          text: `${allResources.length} resources available for download`,
          timer: 2000,
          showConfirmButton: false
        });
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

  const stats = [
    { label: "Reviews Written", count: 5, icon: Bookmark, color: "red" },
    { label: "Folders", count: 5, icon: Folder, color: "yellow" },
    { label: "Total Downloads", count: downloads.length, icon: Heart, color: "green" }, // Dynamic count
  ];

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
        // await ApiService.deleteDownload(itemId); // API Call
        setDownloads(prev => prev.filter(item => item.id !== itemId)); // Update UI
        Swal.fire('Removed!', 'Item removed from downloads.', 'success');
      } catch (err) {
        Swal.fire('Error', 'Failed to remove item.', 'error');
      }
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
            <h1 className="page-title">Downloads</h1>
          </div>
          <div className="header-right">
            <button className="upload-btn"><Upload size={18} /> Upload</button>
            <button className="icon-btn"><Bell size={20} /></button>
            <button className="icon-btn"><User size={20} /></button>
          </div>
        </header>

        <div className="downloads-container">
          
          {/* Stats Row */}
          <div className="stats-row">
            {stats.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <div className="stat-card-download" key={index}>
                  <div className={`stat-icon-square ${stat.color}`}>
                    <Icon size={20} />
                  </div>
                  <div className="stat-info-download">
                    <h3>{stat.count}</h3>
                    <p>{stat.label}</p>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Filter Bar */}
          <div className="downloads-toolbar">
            <div className="search-bar-download">
              <Search size={18} className="search-icon" />
              <input type="text" placeholder="Search downloads..." />
            </div>
            
            <div className="toolbar-right">
              <select className="subject-select">
                <option>All Subjects</option>
                <option>Math</option>
                <option>Science</option>
              </select>
              <button className="my-downloads-btn">My Downloads</button>
            </div>
          </div>

          {/* Downloads Grid */}
          <div className="downloads-grid">
            {downloads.length > 0 ? (
              downloads.map((item) => (
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
                      <User size={14} />
                      {/* Handle different data structures (uploaded vs public) */}
                      <span>{item.author || item.instructor || "Unknown"}</span>
                      <span className="dot">•</span>
                      <span>{item.date || item.uploadTime || item.downloadedAt}</span>
                    </div>
                    <div className="stats-info">
                      <span className="rating-badge">
                        <Star size={12} fill="#fbbf24" stroke="none" />
                        {item.rating || 0}
                      </span>
                      <span className="download-count">
                        <Download size={12} />
                        {/* Fallback to 1 if just downloaded */}
                        {item.downloads || item.downloadCount || 1}
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
                    </div>
                    <div className="card-buttons">
                      <button className="preview-btn">Preview</button>
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
                <h3>No downloads yet</h3>
                <p>Visit the Search Resources page to find and download materials.</p>
              </div>
            )}
          </div>

        </div>
      </main>
    </div>
  );
}