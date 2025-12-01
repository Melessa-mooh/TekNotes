import React, { useState, useEffect } from "react";
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
  Download
} from "lucide-react";

import Sidebar from "../components/Sidebar";
import "../styles/dashboard.css"; 
import "../styles/downloads.css"; 

export default function Downloads() {
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  
  // State for downloads (starts empty)
  const [downloads, setDownloads] = useState([]);

  // ✅ LOAD DOWNLOADS FROM STORAGE
  useEffect(() => {
    // 1. Fetch the list saved by the Search page
    const savedDownloads = JSON.parse(localStorage.getItem("myDownloads")) || [];
    setDownloads(savedDownloads);
  }, []);

  const stats = [
    { label: "Reviews Written", count: 5, icon: Bookmark, color: "red" },
    { label: "Folders", count: 5, icon: Folder, color: "yellow" },
    { label: "Total Downloads", count: downloads.length, icon: Heart, color: "green" }, // Dynamic count
  ];

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