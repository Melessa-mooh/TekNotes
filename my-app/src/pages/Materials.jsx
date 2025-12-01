import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom"; // ✅ Added useNavigate
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
  File
} from "lucide-react";

import Sidebar from "../components/Sidebar";
import "../styles/dashboard.css"; 
import "../styles/materials.css"; 

export default function Materials() {
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate(); // ✅ Hook for navigation

  // State to hold all materials (Starts empty)
  const [materials, setMaterials] = useState([]);

  // Load Data
  useEffect(() => {
    const savedNotes = JSON.parse(localStorage.getItem("myMaterials")) || [];
    setMaterials(savedNotes);
  }, []);

  // Stats
  const stats = [
    { label: "Total Notes", count: materials.length, icon: File, color: "gray" },
    { label: "Download", count: 0, icon: Download, color: "gray" },
    { label: "Published", count: materials.length, icon: CheckCircle, color: "gray" },
  ];

  // ✅ Handle Preview Click
  const handlePreview = (item) => {
    // Navigate to /preview and pass the item data in state
    navigate(`/preview/${item.id}`, { state: { file: item } });
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
            <Link to="/uploads">
                <button className="upload-btn-primary">
                <Upload size={18} /> Upload
                </button>
            </Link>
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
              <input type="text" placeholder="Search materials..." />
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
            {materials.length > 0 ? (
              materials.map((item) => (
                <div key={item.id} className="material-card">
                  
                  <div className="card-top">
                    <div className="file-icon-red">
                      <FileText size={24} />
                    </div>
                    <div className="card-header-text">
                      <h4>{item.title}</h4>
                      <p className="card-desc">{item.description}</p>
                    </div>
                  </div>

                  <div className="card-meta-row">
                    <div className="author-info">
                      <User size={14} />
                      <span>{item.instructor}</span>
                      <span className="dot">🗓️</span>
                      <span>{item.date}</span>
                    </div>
                    <div className="stats-info">
                      <span className="rating-badge">
                        <Star size={12} fill="#fbbf24" stroke="none" />
                        {item.rating || "New"}
                      </span>
                      <span className="download-count">
                        <Download size={12} />
                        {item.downloadCount}
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
                      {/* ✅ UPDATED: Preview Button */}
                      <button className="preview-btn" onClick={() => handlePreview(item)}>
                        Preview
                      </button>
                      
                      <button className="download-action-btn">
                        <Download size={14} /> Downloads
                      </button>
                    </div>
                  </div>

                </div>
              ))
            ) : (
              <div style={{ gridColumn: "1 / -1", textAlign: "center", padding: "40px", color: "#64748b" }}>
                <p>No materials found. Upload your first note!</p>
              </div>
            )}
          </div>

        </div>
      </main>
    </div>
  );
}